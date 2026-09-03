# Phase 3 — Server-Side Zod Validation

- **Date:** 2026-09-04 (UTC)
- **Branch:** `chore/zod-validation`
- **Base:** `main` @ Phase 2 merge (`chore(phase-2): remove deprecated dead code`)
- **Scope:** Server-only input validation with Zod v3. No client changes, no URL changes, no auth changes. Multi-tenant still deferred.

## 1. Why
- `postATask` did `Task.create(req.body)` and `editATask` did `findByIdAndUpdate(id, req.body)` — full mass assignment. A caller could set `status`, `assignedBy`, `_id`, or garbage enums.
- `/:taskId/*` routes never validated the id — malformed ids fell through to Mongoose CastError → 500 instead of 400.
- `POST /api/auth/login` accepted any body shape (empty `{}` → confusing 500 path; object-valued `email` → NoSQL-ish `findOne` input).
- `POST /api/ai/*` duplicated the same `title >= 3` check in both handlers.
- Model enums disagreed with reality: `status` lacked `failed` (yet `getAllTasks` writes it), `category` was a free string (client + AI use a fixed set of 4).

## 2. What was added
| File | Contents |
|---|---|
| `server/validation/task.schemas.js` | Shared `objectId/category/priority/status/dueDate` atoms; `createTaskSchema` (strict, excludes `status/assignedBy/_id`); `updateTaskSchema` (all-optional, ≥1 key, strict); `taskIdParamSchema`. Past due dates allowed (auto-fail behavior unchanged). |
| `server/validation/auth.schemas.js` | `loginSchema` — trimmed/lowercased email, non-empty password, strict. |
| `server/validation/ai.schemas.js` | `aiTitleSchema` — trimmed title 3–200 chars, strict. |
| `server/middleware/validate.middleware.js` | Generic `validateBody/validateParams` → `400 { message: 'Validation failed', issues: [{path, message}] }`, replaces `req.body/params` with parsed data. |
| `server/package.json` | `zod@^3.25` dependency. |

## 3. What was wired/changed
| File | Before → After |
|---|---|
| `server/routes/taskRoutes.js` | `POST /` += `validateBody(createTaskSchema)`; `PATCH /:id/edit` += `validateParams + validateBody(updateTaskSchema)`; `PATCH /:id/complete` + `DELETE /:id/delete` += `validateParams(taskIdParamSchema)`. |
| `server/routes/authRoutes.js` | `POST /login` += `validateBody(loginSchema)`. |
| `server/routes/geminiRoutes.js` | Both `POST` += `validateBody(aiTitleSchema)`. |
| `server/controllers/taskController.js` | `postATask` sets `assignedBy: req.user.id` server-side (client can no longer spoof it); `editATask` += `runValidators: true` as defense-in-depth. |
| `server/controllers/geminiController.js` | Removed duplicated manual `title >= 3` checks (now in middleware). |
| `server/models/task.model.js` | `status` enum += `failed`; `category` += `enum [General, Design, Development, Debugging]`; `priority` order normalized (same 5 values). Type change of `assignedBy` String→ObjectId deliberately left for multi-tenant. |

## 4. Behavior contract
- Valid requests: unchanged shape/status codes (`201 {task}`, `200 {...}`, `401/403` auth as before).
- Invalid input: `400 { message: 'Validation failed', issues }` from middleware, before controllers/auth-DB hit. Unknown keys rejected (`.strict()`), so `status`/`assignedBy` smuggling on create now 400s.
- Malformed `:taskId`: 400 instead of 500.
- Canonical sets enforced: category `General|Design|Development|Debugging`; priority `General|Average|High|Low|Medium`; status `assigned|completed|failed` (create still forbids client-set status; edit allows it).

## 5. Verification
1. `node --check` on all touched files — pass.
2. Schema smoke test (no DB): valid create/update/param/login/ai payloads parse; bad create rejected with 6 issues; empty update, bad id, empty login, short AI title all rejected.
3. Route modules load: `require('./routes/taskRoutes|authRoutes|geminiRoutes')` — OK.
4. Manual (needs env + DB): admin create with missing title → 400; create with `status`/`assignedBy` keys → 400; edit `assignedTo:'abc'` → 400; `PATCH /tasks/bad-id/complete` → 400; login `{}` → 400; AI `{title:'ab'}` → 400; happy-path admin create → employee complete → socket events unchanged.

## 6. Deliberately deferred
- Client-side form parity (server is source of truth; client still shows generic errors).
- Ownership checks (any employee can complete any task; any admin can edit any task) — needs product decision.
- `assignedBy` String→ObjectId migration, `position`/`role` enums on Employee, logger/dotenv cleanup, Socket JWT, rate-limit/helmet — future phases.
