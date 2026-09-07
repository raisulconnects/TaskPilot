# Plan — Postgres Migration (Prisma), Then RLS-Backed Tenancy

- **Date:** 2026-09-06 (UTC)
- **Status:** Planned (not started)
- **Decisions locked:** Postgres first, then multi-tenancy · Prisma ORM · plain JavaScript / CJS server stays as-is
- **Rationale:** `doc/why-postgres.md`
- **Estimate:** 1–2 weeks migration + ~1 week tenancy; notifications/audit deferred out of the window

## Phase 0 — Version spike (30-minute gate, nothing proceeds until it passes)

> **OUTCOME (2026-09-07, branch `chore/postgres-migration`): PASSED on Prisma
> v7 stable (`prisma@7.10.0`, `@prisma/client@7.10.0`). Findings:
> - The default `prisma-client` generator emits TypeScript sources only —
>   unusable from plain CJS. Use the classic `provider = "prisma-client-js"`.
> - Prisma 7 requires a driver adapter: `new PrismaClient({ adapter })` with
>   `@prisma/adapter-pg` + `pg` — both CJS-compatible via `require()`.
> - `prisma7.config.ts` (TS) is Prisma's own file, loaded by its CLI; the app
>   stays plain JS. `datasource` URL comes from `DATABASE_URL` in that config.
> - Local dev DB: Docker `postgres:16` on host port **5433** (5432 was taken by
>   another project's container); volume `taskpilot-pgdata`.
> - First `npm install` attempt hit a transient Windows esbuild postinstall
>   crash — retry succeeded; no action needed.
> - Gate proof: CJS `require('@prisma/client')` + adapter → create/read/count/
>   delete round-trip against local Postgres, all green.

1. `npm i -D prisma && npm i @prisma/client` in `server/` (plus `pg` if the
   chosen version needs a driver adapter).
2. `npx prisma init` against a throwaway database.
3. Define one model, `migrate dev`, `generate`, then `require()` the client
   from a plain CJS script and run one query.
4. **Gate:** if the newest toolchain fights CJS, pin the proven v6 line
   (classic `generator client`, fully CJS-compatible) and record why in this
   doc. Either way the Vitest suite catches breakage instantly.

## Phase 1 — Schema design (`prisma/schema.prisma`)

Design tenancy in from day one so it needs no re-migration:

- `Organization { id (uuid), name, createdAt }`.
- `User` (current Employee, renamed conceptually; keep API field names stable):
  `id, orgId → Organization, name, email @unique, password, role (native enum:
  ADMIN | EMPLOYEE), timestamps`. Email uniqueness becomes
  `@@unique([orgId, email])` — same address can exist in two orgs, never twice
  in one.
- `Task`: `id, orgId → Organization, title, description, category + priority +
  status as NATIVE PG enums (single source of truth — ends the 5-vs-3 drift),
  dueDate (timestamptz), assignedTo → User + assignedBy → User as REAL foreign
  keys with explicit `ON DELETE` behavior (restrict user delete while tasks
  reference them), timestamps.
- Compound indexes: `@@index([orgId, status])`, `@@index([orgId, assignedToId])`
  so org-scoped queries stay fast as data grows.

## Phase 2 — Migration + seed + hosting

- `prisma migrate dev` history from the start (`001_init`, …) — every schema
  step a reviewable SQL file.
- Seed script porting existing Mongo users/tasks, with an explicit org
  assignment strategy for the current single-pool data (one default org; no
  silent drops — migration asserts row counts match).
- Hosted demo DB on Neon or Supabase free tier (`DATABASE_URL`); `.env.example`
  updated; `MONGODB_URI` retired after cutover.
- Prisma Studio noted as the DB GUI for development/debugging.

## Phase 3 — Per-request org context + RLS (the core)

- JWT gains an `orgId` claim at login; middleware verifies it and stamps
  `req.orgId` (single enforcement point — controllers never hand-roll scoping).
- RLS policies per table, e.g.
  `USING (org_id = current_setting('app.org_id')::uuid)` (+ `WITH CHECK` on
  writes so rows can't be inserted into another org).
- **Hard requirement (pooling caveat):** the per-request setting runs INSIDE a
  transaction (Prisma interactive `$transaction`), otherwise the setting can
  leak across reused pooled connections and defeat the entire design. A
  dedicated test hammers concurrent cross-tenant requests to prove it.
- Socket.IO rooms namespaced per org (`org_<id>:admin-room`,
  `org_<id>:user_<id>`) so realtime events can't cross tenants either.

## Phase 4 — Controller-by-controller query map (~10 sites)

- `populate("assignedTo", ...)` → Prisma `include: { assignedTo: { select:
  { id, name, email } } }`.
- `Task.create(req.body)` → `prisma.task.create` (already Zod-validated;
  `assignedBy`/`orgId` still server-stamped, never client-set).
- `findByIdAndUpdate` + `runValidators` → `prisma.task.update` (invalid id →
  Prisma's known-request error mapped to 400/404, preserving the current
  contract the tests lock).
- Auto-fail `updateMany` → `prisma.task.updateMany`.
- `GET /tasks` list + dashboards: `GROUP BY` aggregations replace
  fetch-all-count-in-JS (RLS scopes them automatically).
- Zod schemas extended with `orgId` where client-supplied; server-set fields
  stay forbidden.

## Phase 5 — Test rework (all 62 assertions survive, seams change)

- Decide: mocked Prisma client vs `pg-mem` in-memory Postgres (real SQL, no
  server). `pg-mem` is the lean: stronger seam than today's Mongoose spies.
- New tests: FK rejection (assign to nonexistent user), leakage suite (org B
  token reads/writes org A data → empty/403, including a deliberately
  unscoped query to prove RLS, plus the concurrent-request pooling test),
  transaction atomicity for multi-row writes.
- `tests/helpers/socket-test-helper.js` pattern carries over (CJS helper on
  the controllers' pipeline).
- CI updates: `DATABASE_URL` for migrate/generate steps, Prisma generate in
  the server job, `pg-mem` needs no service container.

## Phase 6 — Tracking & delivery

- Branch `chore/postgres-migration` off `main` (spike first, then schema →
  queries → tests as reviewable commits); PR with migration files + seed +
  updated `doc/` note.
- Tenancy lands as its own `doc/` design note on top (policies, indexes,
  socket namespacing, leakage proof).
- Resume bullets this unlocks: *"Migrated MongoDB/Mongoose to Postgres/Prisma
  with real FKs, native enums, and versioned migrations"* and *"Enforced
  multi-tenant isolation at the database layer with RLS policies plus
  per-request org context, proven by cross-tenant leakage tests."*

## Deliberately deferred (unchanged)

Notifications/escalation, audit trail, pagination, component tests, coverage
thresholds — all queued behind migration + tenancy, in that order.
