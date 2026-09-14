# UI Agent Brief — Members Area + Dashboard Sidebar

- **Date:** 2026-09-14 · **Status:** ready to build (backend contract frozen below)
- **Audience:** the UI agent building this. Backend (`POST /api/users`,
  `DELETE /api/users/:id`, `AdminRoute` guard) lands in a parallel backend PR
  to these exact shapes — build the UI against them; do not invent variants.

## 1. What exists today (do not rebuild)

- Routes (`client/src/App.jsx`, react-router-dom v7): `/` Landing,
  `/login`, `/signup`, `/dashboard` (role switch inside `DashboardRoute`),
  `*` → `/`. Guards live in `App.jsx` following the `DashboardRoute` pattern
  (loading spinner → unauthenticated `Navigate` → role switch).
- Member data: `fetchAllEmployeeInfo()` (`services/taskService.js`) → scoped
  `GET /api/allemployees` → `[{ id, name, email, role }]` (caller's org only).
- Auth: `useAuthContext()` gives `{ user, login, logout, ... }`;
  `user = { id, name, email, role, orgId }`. Server error shape everywhere is
  `{ message, issues? }` with `issues = [{ path, message }]` (`path` is a
  STRING — never call `.join()` on it).
- Form-guard precedent: pure functions (`services/validateTaskForm.js`,
  `services/validateSignupForm.js`) returning a message or `null`; components
  only display. Follow it: add `services/validateMemberForm.js`.
- Error display precedent: `Signup.jsx` (form error + per-field issue list).
- Theme: `client/src/index.css` `@theme` tokens ONLY (no new colors).
  No new npm dependencies. No hardcoded URLs (via `services/` +
  `API_BASE_URL`). Responsive like current screens. Must render with zero
  backend (no crashing on empty data).

## 2. What to build

### A. Sidebar (dashboard shell)

- For Design, You have the complete independece, you can find design tokens and all in the docs/ui-design, as that was used for building the app pages and components
- Persistent left sidebar on desktop, collapsing to topbar/hamburger on mobile.
- Contents: TaskPilot logo (existing `Common/TaskPilotLogo`), nav items with
  icons — **Tasks** (`/dashboard`), **Members** (`/dashboard/members`,
  admin-only visible), user chip (name + role badge + org context), logout.
- Active-route highlighting. Both roles see Tasks; only admins see Members.
- Wrap the existing `AdminDashboard` / `EmployeeDashboard` content inside the
  shell — do not restyle their interiors (separate concern).

### B. Members page at `/dashboard/members` (admin-only)

- Route entry using the backend PR's `AdminRoute` guard (same pattern as
  `DashboardRoute`; import path will be `client/src/App.jsx` — coordinate the
  exact export name with the backend PR, default `AdminRoute`).
- **Table:** name, email, role badge, remove button (confirm first, e.g. the
  existing SweetAlert2 pattern). Empty state when org has only the admin.
- **Add-member form** (two-part layout like signup): name (2–100), email
  (valid format), password (min 8), role select (employee/admin). Client guard
  first, then POST; on success clear the form + refresh the table.
- **Error display:** server `message` verbatim + per-field `issues` list
  (same component pattern as `Signup.jsx`). Known server messages to handle
  gracefully: `"Email already registered"`, `"Cannot delete your own
account"`, `"Cannot delete the last admin"`, `"Reassign or resolve their
tasks first"`.

## 3. Backend contract (frozen — implemented in parallel to these shapes)

- `POST /api/users` `{ name, email, password, role }`
  → `201 { user: { id, name, email, role, orgId } }`
  → `400 { message, issues }` · `409 { message: "Email already registered" }`
  · `401` anon · `403` non-admin. Org stamped server-side, never sent.
- `DELETE /api/users/:id`
  → `200 { message }`
  → `404` (missing, or another org's user — indistinguishable by design)
  → `409` with a specific message for: own account / last admin / user still
  has tasks.
- `GET /api/allemployees` (existing, unchanged) → scoped member list.

## 4. Acceptance (definition of done for the UI side)

- Sidebar navigates Tasks ↔ Members without full reloads; role-appropriate
  items only; mobile collapses sanely.
- Members table reflects the org; add/remove round-trips update it; every
  listed server error renders readably; no blank-screen crashes on any
  400/404/409 payload.
- `vite build` + `vitest run` + `eslint` clean; no new dependencies; no
  hardcoded URLs; theme tokens only.

## 5. Explicitly out of scope

- Backend endpoints and guards (parallel backend PR). Invite-by-email flow
  (direct-create only). Editing members (add/remove only). Task
  reassignment UI (covered by the 409 message + existing edit flows).
