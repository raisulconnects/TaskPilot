# Phase 5 — Tenancy Core: Org-Scoped App + RLS Backstop + Namespaced Sockets

- **Date:** 2026-09-08 (UTC)
- **Branch:** `chore/postgres-migration` (checkpoint 2; checkpoint 1 = auth org claims + controller scoping)
- **Locked decisions:** RLS-backstop posture · owner runtime connection · socket handshake trust kept
- **Scope:** Tenancy enforcement + proof. No org-switching UI, no invite flow, no socket JWT hardening (all deferred with reasons).

## 1. Enforcement architecture (three layers, one direction)

1. **Identity (JWT):** login embeds `orgId`; `orgScope` middleware stamps
   `req.orgId` and 401s legacy tokens. Single enforcement point — controllers
   never resolve the org themselves (`postATask`'s creator lookup was deleted).
2. **App queries (primary):** every task/employee query carries
   `where: { orgId }`; mutations 404 on foreign-org rows (deliberately 404,
   not 403 — ids cannot be enumerated across tenants). Create/edit verify the
   assignee belongs to the caller's org (400 otherwise).
3. **RLS (backstop):** `user_isolation` / `task_isolation` policies on
   `current_setting('app.org_id')`, fail-closed on unset. Runtime keeps the
   owner connection (owners bypass RLS); the NOLOGIN `taskpilot_test` role
   exists solely for the proof suite via `SET ROLE` — no passwords in the repo.

`Organization` itself has no RLS (seed/tooling reads it; it holds no
tenant-private payload beyond names).

## 2. What was found while building (kept on purpose)

- **TEXT vs uuid cast:** org ids are stored as TEXT (Prisma String), so the
  first policy draft (`::uuid` cast) failed the migration; fixed to a direct
  text comparison. Failed attempt resolved via `migrate resolve --rolled-back`
  (PG DDL is transactional — nothing applied).
- **`SET LOCAL` needs a transaction:** outside one it warns and silently does
  nothing — which is exactly the pooling caveat. The integration helper wraps
  everything in BEGIN/ROLLBACK (which also guarantees probe writes never
  persist).
- **Raw SQL must supply timestamps:** Prisma fills `createdAt`/`updatedAt`
  client-side, so hand-written fixture INSERTs provide `now()` explicitly.

## 3. Sockets

`config/rooms.js` (pure, unit-tested) is the single source of room names:
`org_<id>:admin-room`, `org_<id>:employee-room`, `org_<id>:user_<id>`.
`socket.js` joins them from `handshake.auth.orgId`; all five emit sites use
them; client `AuthContext` sends `orgId` (present on login response and `/me`,
so rooms survive reloads). Trust model unchanged by design — JWT-for-sockets
is a separate hardening item.

## 4. Proof (72 server + 11 client tests)

- Unit (67): stamping/rejection, org claim in JWT + login + `/me`, `orgId` in
  every controller query, 3 cross-org 404s, legacy-token 401, room-name unit
  tests, room args on emissions, same/cross-org assignment checks.
- Integration (5, real Postgres, gated on `TEST_DATABASE_URL`): unscoped query
  sees own-org rows only; unknown org and unset setting see nothing;
  `WITH CHECK` blocks cross-org writes (42501); 10 concurrent cross-tenant
  requests never cross-contaminate. Fixtures are namespaced probe rows, safe
  on a demo-data DB; keyless runs skip the file.
- Seed: RivalOrg (admin/employee/task, distinct emails) + upsert no longer
  overwrites `orgId` (anchor to first-seen org).

## 5. Deferred with reasons

- Org-switching UI / invite flow (needs product decisions, not just code).
- Socket JWT verification, restricted-role live connection, RLS-primary
  tx-per-request (each reviewed; backstop posture covers the threat model at
  this scale — revisit with enterprise/compliance pressure).
- `mongodb` driver + Mongoose removal (its own cleanup commit after cutover
  proves itself in production use).
