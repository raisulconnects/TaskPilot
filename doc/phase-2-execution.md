# Phase 2 Execution — Deprecated Dead Code Removed

- **Date:** 2026-09-04 (UTC)
- **Branch:** `chore/phase-2-execute-cleanup`
- **Base:** `main` @ Phase 1 merge (`chore(phase-1): deprecate dead code, minimal auth hardening`)
- **Scope:** Execute every `@deprecated`/NOTE marked in Phase 1 (`doc/phase-1-clean.md` + code comments). No new features. Zod + multi-tenant still deferred.

## 1. What was removed and why

### Server — separate Admin auth stack (deleted, was deprecated)
| Removed | Why it was safe |
|---|---|
| `server/models/admin.model.js` (deleted) | Unified auth lives in `Employee` + `role`. Zero live imports. |
| `server/controllers/adminController.js` (deleted) | Superseded by `authController.login` (JWT + cookie). Only consumer was the deleted route below. |
| `server/routes/adminRoutes.js` (deleted) | Never mounted in `server/index.js`. Dead endpoint. |

### Server — legacy login + unused helper (deleted)
| Removed | Why it was safe |
|---|---|
| `employeeLogin` in `server/controllers/employeeController.js` + unused `bcrypt` import | Superseded by `authController.login`. Unreferenced anywhere. |
| `position` in `allEmployees` select (`_id name email position role` → `_id name email role`) | `position` is not in the `Employee` schema; Mongoose ignored it. Pure noise. |
| `getEmployeeTasks` in `server/controllers/taskController.js` + export | No route referenced it; employee filtering is client-side. Server `markTaskCompleted` (live, used by `taskRoutes.js`) was NOT touched. |
| Commented-out legacy `getAllTasks` block in `taskController.js` | Stale copy; active `getAllTasks` is canonical. |

### Server — dead comments/imports (deleted)
| Removed | Why |
|---|---|
| Commented `join-room` handler in `server/config/socket.js` | Auto-join via `handshake.auth` is canonical. |
| Unused `bcrypt` import + commented `pre("save")`/`matchPassword` in `server/models/employee.model.js` | Hashing intentionally omitted (seeds pre-hashed). Condensed to a 4-line NOTE so the reason stays tracked. |

### Client — mock data + buggy helper (deleted)
| Removed | Why it was safe |
|---|---|
| `client/src/Data/tasks.json`, `employees.json`, `admins.json` (deleted) | Zero runtime imports (verified via grep). `client/src/Data/README.md` updated to record the deletion instead of the deprecation notice. |
| `markTaskCompleted` in `client/src/context/TaskContext.jsx` + provider entry, stale commented `console.log` | Buggy (`t.id` vs `_id`), zero consumers (grep). Canonical path is `updateTaskStatus` → `PATCH /tasks/:id/complete`. Server-side `markTaskCompleted` untouched. |

### Docs
| Changed | Why |
|---|---|
| `README.md` project structure | Removed `adminController.js`, `admin.model.js`, `adminRoutes.js` entries; added missing `config/socket.js` entry. |
| `doc/phase-2-execution.md` (this file) | Tracking for this execution, mirroring Phase 1 doc convention. |

## 2. Deliberately NOT touched
- Cookie flags, Socket.IO auth model, rate-limit/helmet, refresh tokens.
- `status` enum (`failed` written at runtime but missing from schema), `priority` model-vs-AI mismatch, `in_progress` stat key, logger order, `dotenv` path cleanup, Zod schemas — all Phase 2-Zod / multi-tenant follow-ups.
- `fetchTasksByEmployee` client-side filtering — still live, replacement needs API + Zod design.

## 3. Verification
1. `grep` for `admin.model|adminController|adminRoutes|adminLogin|employeeLogin|getEmployeeTasks|src/Data/*.json|TaskContext.*markTaskCompleted` → only hits are `doc/phase-1-clean.md`, `doc/phase-2-execution.md` (history) and `README.md` history-free.
2. `node --check` on all touched server files (`index.js`, `config/*`, `controllers/*`, `routes/*`, `models/*`).
3. `git status --short` shows 6 deletions + edits listed below; no other files touched.
4. Manual (needs env): `npm run dev` both sides; admin login → dropdown + AI autofill; employee complete → live update; unauthed `/api/allemployees`, `/api/ai/*` → 401.

## 4. Files changed
```
D  server/models/admin.model.js
D  server/controllers/adminController.js
D  server/routes/adminRoutes.js
D  client/src/Data/tasks.json
D  client/src/Data/employees.json
D  client/src/Data/admins.json
M  server/controllers/employeeController.js
M  server/controllers/taskController.js
M  server/config/socket.js
M  server/models/employee.model.js
M  client/src/context/TaskContext.jsx
M  client/src/Data/README.md
M  README.md
A  doc/phase-2-execution.md
```
