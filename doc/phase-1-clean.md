# Phase 1 Clean — Dead Code Deprecation + Minimal Security

- **Date:** 2026-09-03 (UTC)
- **Branch:** `chore/phase-1-cleanup`
- **Scope:** Code quality pass #1 — deprecate-first dead code + minimal security fixes only.
- **Explicitly out of scope (deferred):** Zod validation, multi-tenant design, cookie `secure/sameSite` change, Socket.IO JWT verify, rate-limit/helmet, refresh tokens, schema enum alignment, logger reorder.

Policy agreed with maintainer: **deprecate first, delete later**. No source files were
deleted in this phase. Only stale inline comments were removed. Everything else got
`@deprecated` headers + this doc so removal after the multi-tenant decision is safe.

## 1. What was there and why we deprecated it (not deleted)

### Server — separate Admin auth stack (dead)
| File | What was there | Why deprecated |
|---|---|---|
| `server/models/admin.model.js` | `Admin` Mongoose model (`name, email, password, role=admin`) | Auth is unified in `Employee` collection with `role` field. Live login (`controllers/authController.js`) only queries `Employee`. Model never imported by live code. |
| `server/controllers/adminController.js` | `adminLogin` (find + bcrypt.compare, no JWT/cookie) | Superseded by `authController.login` (JWT + httpOnly cookie). Only referenced by deprecated `adminRoutes.js`. |
| `server/routes/adminRoutes.js` | `POST /login` router | Never mounted in `server/index.js`. Dead endpoint. |

Action: added `@deprecated` file/function headers. No deletion.

### Server — legacy employee login (dead)
| File | What was there | Why deprecated |
|---|---|---|
| `server/controllers/employeeController.js: employeeLogin` | Duplicate login returning `{employee}` with `position` field, no JWT | Superseded by `authController.login`. Unreferenced. `position` doesn't even exist in `employee.model.js` schema. |

Action: `@deprecated` on `employeeLogin` only. `allEmployees` stays live.

### Server — unused task helper + stale comment (dead)
| File | What was there | Why deprecated |
|---|---|---|
| `server/controllers/taskController.js: getEmployeeTasks` | `Task.find({assignedTo: req.params.employeeId})` | No route in `routes/taskRoutes.js` references it. Employee filtering is currently client-side in `services/taskService.js`. |
| `server/controllers/taskController.js: commented getAllTasks` | Old commented-out `getAllTasks` without auto-expire | Stale copy; active `getAllTasks` below it is canonical. Marked as reference-only. |

Action: `@deprecated` headers. Export kept to avoid breaking imports.

### Server — disabled/commented blocks (clarified, not deleted)
| File | What was there | Why |
|---|---|---|
| `server/models/employee.model.js` | Commented `pre("save")` hashing + `matchPassword` | Hashing is intentionally off; seeds are pre-hashed, login uses `bcrypt.compare`. Added NOTE explaining when to re-enable (user registration, post multi-tenant). |
| `server/config/db.js` | `// const MONGODB_URI`, `// connectDB();` | Pure noise. Removed (only comment deletions in this PR). |
| `server/config/socket.js` | Commented `console.log(handshake.auth)`, commented `join-room` handler | Debug log removed; `join-room` marked `@deprecated` (auto-join via `handshake.auth` is canonical). |
| `server/models/admin.model.js` | Commented hashing hooks | Left in place under deprecation header (whole file deprecated anyway). |

### Client — legacy mock data (dead)
| Files | What was there | Why |
|---|---|---|
| `client/src/Data/tasks.json`, `employees.json`, `admins.json` | Static seed/mock arrays (includes `in_progress` status nowhere else used) | Zero runtime imports; live data comes from API via `TaskContext`. JSON can't hold comments, so added `client/src/Data/README.md` deprecation notice. Files kept. |

### Client — buggy unused helper (dead)
| File | What was there | Why |
|---|---|---|
| `client/src/context/TaskContext.jsx: markTaskCompleted` | Local `setTasks` mapper using `t.id` (tasks use `_id`) | Superseded by `updateTaskStatus` (PATCH `/tasks/:id/complete` + refetch/socket). Marked `@deprecated`. Export kept to avoid breaking imports. `in_progress` key in `getDashboardStats` left untouched (harmless, cleanup later with status enum fix). |

## 2. Minimal security fixes (per maintainer: log + missing auth only)

| File | Before | After | Why |
|---|---|---|---|
| `server/controllers/authController.js` | `console.log("Auth Route Being HIT!", email, password)` | Removed | **Credential leak** — passwords must never hit logs. |
| `server/routes/employeeRoutes.js` | `router.get("/", allEmployees)` — public | `authCheck + roleCheck("admin")` | Was leaking user PII (`_id, name, email, role`) to unauthed callers. Only used by admin `CreateTask` dropdown, so `admin`-only is non-breaking. |
| `server/routes/geminiRoutes.js` | `POST /gendesc`, `POST /gencatpri` — public (auth imports present but unused) | `authCheck + roleCheck("admin")` using existing imports | Was exposing Gemini quota to the internet. Only used by admin `CreateTask` AI autofill (which already sends `credentials:include`), so non-breaking. |
| `client/src/services/taskService.js: fetchAllEmployeeInfo` | `fetch(url)` without credentials | Added `credentials:include` | Required companion to the new server auth; otherwise admin dropdown breaks with 401. |
| `client/src/components/Task Boxes/CreateTask.jsx` | AI `fetch` calls | No change needed | Already send `credentials:include` — verified compatible with new AI auth. |

Intentionally untouched: cookie `secure:true, sameSite:none` (breaks localhost HTTP but maintainer chose minimal scope), Socket.IO trust of `handshake.auth {userId, role}` (no JWT verify yet), no rate-limit/helmet, no input validation (Zod is next phase).

## 3. Files changed in this branch

```
server/models/admin.model.js
server/controllers/adminController.js
server/routes/adminRoutes.js
server/controllers/employeeController.js
server/controllers/taskController.js
server/controllers/authController.js
server/routes/employeeRoutes.js
server/routes/geminiRoutes.js
server/models/employee.model.js
server/config/db.js
server/config/socket.js
client/src/services/taskService.js
client/src/context/TaskContext.jsx
client/src/Data/README.md (new)
doc/phase-1-clean.md (new, this file)
```

## 4. How to verify

1. `git diff main...chore/phase-1-cleanup --stat` — only headers + 3 auth lines + 1 client fetch option + 2 new docs.
2. `cd server && npm run dev`, `cd client && npm run dev` — both boot.
3. Login as admin → Create Task dropdown loads (proves `GET /allemployees` with cookie works) → AI autofill works (proves `POST /ai/*` with cookie works).
4. Unauthed `curl GET /api/allemployees` → 401; `curl POST /api/ai/gendesc` → 401.
5. Employee login → task complete → admin sees `task:updated` live (socket untouched).
6. `cd client && npm run lint` — no new warnings from touched files.

## 5. Next phases (not started)

- **Phase 2 (Zod):** `server/validation/` schemas for task create/edit, replace `Task.create(req.body)` mass assignment, align `status` (`failed` missing from enum) and `priority` (model vs AI prompt mismatch) enums, fix `position` select mismatch.
- **Phase 3 (multi-tenant):** decision needed on `single-DB + orgId` vs `DB-per-tenant`; prep is already safe because auth stays unified in `Employee` and deprecated split-model files are isolated for deletion.
