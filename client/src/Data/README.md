# @deprecated — Phase 1 cleanup (chore/phase-1-cleanup)

The JSON files in this folder (`tasks.json`, `employees.json`, `admins.json`)
are legacy seed/mock data and are NOT imported anywhere at runtime.

- Live data comes from the API via `services/taskService.js` + `TaskContext.jsx`.
- Kept for reference only (deprecate-first policy).
- Scheduled for removal after the multi-tenant decision.
- Do not import these files in new code.
