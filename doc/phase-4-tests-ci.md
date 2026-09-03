# Phase 4 — Tests + CI (Vitest, all green)

- **Date:** 2026-09-04 (UTC)
- **Branch:** `chore/tests-ci` (PR #5 — refactors reviewed first, tests added on the same branch)
- **Scope:** All-Vitest suites (server + client, mocked boundaries, no DB/Gemini needed) + GitHub Actions CI + tracking doc. No behavior changes except two tiny hardening fixes the tests exposed (below).

## 1. Testability refactors (reviewed separately in PR #5)
| Change | Why |
|---|---|
| `server/app.js` (new) | Express app factory with zero side effects; `index.js` keeps dotenv/DB/socket/listen. Supertest imports the app without booting infrastructure. |
| `roleCheck.middleware.js` | Missing `req.user` → 401 instead of `TypeError` crash; dropped per-request `console.log` noise. |
| `client/src/services/validateTaskForm.js` (new) | Pure form guard extracted from `CreateTask`; component behavior identical. |
| `server/models/*.model.js` | `mongoose.models.X \|\|` reuse guard (canonical practice; also prevents double-compile crashes). |

## 2. Suites (62 tests, ~2s total)
| File | Covers |
|---|---|
| `server/tests/validation.schemas.test.js` (20) | Zod create/update/param/login/AI schemas: happy paths, rejections, mass-assignment keys, NoSQL-shaped email, email normalization. |
| `server/tests/validate.middleware.test.js` (4) | 400 `{message, issues}` shape, `req` replacement, `next()` discipline for body + params. |
| `server/tests/auth.middleware.test.js` (7) | JWT missing/invalid/expired/valid; role allow/deny/missing-user (regression test for the `TypeError`). |
| `server/tests/tasks.routes.test.js` (20) | Supertest RBAC matrix (401/403), validation 400s with controller-not-hit assertions, `assignedBy` server-stamping, auto-fail `updateMany`, socket emissions, AI-route wiring without calling Gemini. |
| `server/tests/auth.routes.test.js` (6) | Login 400s, unknown-email/wrong-password 401s (real `bcrypt.compare` vs hash fixture), 200 + cookie + payload, `/me` 401. |
| `client/src/services/validateTaskForm.test.js` (8) | Blank/whitespace/missing field in every slot + valid form. |
| `client/src/services/taskService.test.js` (3) | Success passthrough, server `{message, issues}` surfacing, empty-body fallback (mocked `fetch`). |

Boundaries: Mongoose statics stubbed via `vi.spyOn` (no DB), Socket.IO is the REAL server on an unlistened socket (emissions captured by spying `to()`), Gemini never called, `bcrypt.compare` real.

## 3. Key debugging story: Vitest ESM ↔ CJS interop
`vi.mock()` factories are invisible to the controllers' CJS `require()` in this setup (proven with a throwaway probe: ESM importers saw the mock, CJS requirers saw the real module). Two consequences, both now documented patterns:
- **Models:** spy on the real model — safe because every model file reuses the compiled model off Mongoose's shared singleton, so the spied object is exactly what controllers query.
- **Socket:** `server/tests/helpers/socket-test-helper.js` — a CJS helper on the controllers' pipeline that boots the real Socket.IO server; tests spy `io.to()` to capture emissions.
Rule of thumb for future tests: never `vi.mock` anything a CJS controller requires; spy shared singletons instead.

## 4. CI (`.github/workflows/ci.yml`)
Two jobs on push/PR to `main`, Node 22 pinned: `server` (`npm ci` + `npm test` with fake `JWT_SECRET`), `client` (`npm ci` + `test` + `lint` + `build`). No DB, no secrets needed.

## 5. How to run
- `cd server && npm test` — 51 tests, ~1s.
- `cd client && npm test` — 11 tests, <1s.
- `cd client && npm run build` stays the UI gate.

## 6. Deliberately deferred
- `mongodb-memory-server` real-DB integration tests (mocks unblock everything; upgrade path open).
- Component tests (Testing Library/jsdom), socket-client round-trip tests (room scheme changes with multi-tenancy — testing today's scheme would bake in what we're about to change).
- Coverage thresholds (add once the suite stabilizes post-multi-tenancy).
