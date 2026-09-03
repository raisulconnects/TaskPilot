# Legacy mock data — REMOVED (Phase 2, chore/phase-2-execute-cleanup)

The JSON seed files (`tasks.json`, `employees.json`, `admins.json`) were
deprecated in Phase 1 and deleted in Phase 2. They had zero runtime imports;
live data comes from the API via `services/taskService.js` + `TaskContext.jsx`.

This folder/README is kept so the deletion stays tracked. Remove the folder
entirely once the team confirms no external tooling references it.
