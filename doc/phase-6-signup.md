# Phase 6 — Org Signup API (no UI; frontend already merged)

- **Date:** 2026-09-14 (UTC)
- **Branch:** `feat/org-signup`
- **Scope:** `POST /api/auth/signup` + validation + tests + doc. No UI changes
  (merged `Signup.jsx` + `signupOrg` already call this exact contract).
  Members API stays its own later PR. Rate limiting deliberately deferred
  (see below).

## Endpoint

`POST /api/auth/signup` with `{ orgName, name, email, password }`:
- Zod `signupSchema` (strict): org 2–60, name 2–100, email normalized,
  password min-8 → `400 { message, issues }` on failure.
- Email-free check → `409 { message: "Email already registered" }`.
- Atomic `prisma.$transaction`: create org + admin (`bcrypt.hash`, cost 10,
  role forced `"admin"` server-side) — org without admin (or vice versa) is
  unrepresentable.
- Auto-login: same JWT cookie + `201 { user: { id, name, email, role,
  orgId } }` shape as login, so the client needs no new handling.

## Deliberate decisions

- **Explicit hash in controller, never a model hook** — seeds store
  pre-hashed passwords; a hook would double-hash them.
- **Rate limiting deferred to pre-launch hardening**, not forgotten:
  `TODO(rate-limit)` at the route + attempt logging in the controller
  (`[signup] ...`, no PII) so abuse is visible in production logs until
  enforcement lands. Open endpoint + expensive hashing is a CPU-burn target;
  acceptable now (no public traffic), mandatory before launch.
- **Login untouched** (min-1 password policy stays for existing accounts).

## Proof

- 8 new tests (5 route: 400s, 409 + transaction-never-runs, 201 shape +
  forced role + real hash verification + JWT org claim, mid-transaction
  failure creates nothing; 3 schema). Suite: 80/80 server, 11/11 client.
- Live vs Docker PG: 201 + payload shape, 409 message, fresh-credential
  login 200, bad payload 400. Probe org removed afterwards.
