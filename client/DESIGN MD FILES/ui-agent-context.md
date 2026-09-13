# TaskPilot — UI Agent Context

> Read this file FIRST, in full, before creating or editing any UI.
> It is the single source of truth for what the product is, what you are
> building, and the contracts your components must honor so a second agent
> can wire them to routes and APIs afterward without rewrites.

## 1. What TaskPilot Is (read carefully — this is the honest product)

TaskPilot is an **early-stage multi-tenant SaaS task manager for small teams**
— deliberately simpler than Asana/Jira: no projects-within-projects, no
sprints, no custom workflows. One workspace per company, two roles, one
loop: assign work, do work, see it happen live.

**The real user journey, screen by screen (verified against the app):**

1. A company signs up and gets an isolated **Organization** workspace with one
   **Admin** account. Data from different orgs can never mix (enforced in the
   API and the database).
2. The Admin opens a dashboard with a **task creation form**: title, assignee
   dropdown (their employees), due date, category, priority, description. Two
   **AI assist buttons** sit in the form: "Generate Description with AI"
   (writes a professional description from the title) and "Autofill Category
   and Priority" (suggests both from the title). Beside the form live the
   **analytics charts**: task-status distribution (pie) and completions per
   employee (bar).
3. The assigned **Employee** sees the task **instantly, no refresh** (realtime
   push). Their dashboard opens with three stat cards — Completed / Assigned /
   Failed counts — above a horizontally draggable task list. They read the
   task and press to mark it complete.
4. The Admin sees that completion **instantly** on their side. If a due date
   passes with the task still open, the system marks it **failed**
   automatically — nothing slips silently; the failure is visible to both
   sides and counted on the dashboards.
5. Auth is email + password with a cookie session; the app routes admins and
   employees to their respective dashboards automatically.

**Who it's for (say this, not generic "teams everywhere"):** small teams and
founders who currently coordinate work over chat threads and spreadsheets,
and want assignment + live tracking + basic accountability without learning
an enterprise platform.

**What it is NOT yet (never imply otherwise):** there is no public signup
*in the app* yet (you are building that page now), no member-invite emails,
no deadline reminders or notifications, no comments or file attachments, no
search/filter, no mobile app, no integrations. Statements must stay within
what ships: workspaces, roles, tasks, realtime, AI-assisted creation,
auto-fail on overdue, dashboards.

## 2. Domain Language (use these exact words in UI copy)

| Term | Meaning | Never call it |
|---|---|---|
| Organization (org) | One customer's isolated workspace | Company, team, tenant (user-facing) |
| Admin | Manages an org: creates tasks + members, sees everything | Manager, owner, boss |
| Employee / Member | Does assigned work in one org | User (too vague), worker |
| Task | Unit of work: title, description, category, priority, due date, status | Ticket, todo, issue |
| Status | `assigned` → `completed`, or `failed` when overdue | Open/closed/done |
| Priority | `General`, `Average`, `High` (only these three exist) | Low/Medium/Urgent |
| Category | `General`, `Design`, `Development`, `Debugging` (only these four) | Anything else |

## 3. Product Facts Your Pages May State (all verified, no filler)

- Your own isolated workspace per company — colleagues never see another
  company's work (separate organizations, enforced end to end).
- Realtime collaboration: new assignments appear instantly, completions show
  up on the admin side instantly — no refresh, either direction.
- AI-assisted task creation: descriptions written and category/priority
  suggested from just a title.
- Automatic overdue detection: past-due work marks itself failed and shows up
  in everyone's counts — nothing slips silently.
- Visual analytics: status distribution and per-employee completions, live.
- Simple secure login with cookie sessions; admins and employees each get
  the dashboard that fits their job.
- Stack (only if a "built with" note fits): React 19, Vite, Tailwind CSS v4,
  Express, PostgreSQL (Supabase), Prisma, Socket.IO.

Do NOT invent: customer counts, testimonials, uptime percentages, pricing
tiers, mobile apps, or integrations that don't exist. Prefer backend
mechanism-free wording on marketing surfaces ("isolated workspaces" is fine;
"Row-Level Security" belongs in docs, not headlines).

## 4. Pages You Own (scope)

1. **`Landing.jsx`** (new) — DESIGN, MAKE IT THE BEST! Animations Typography, Colors.
2. **`Login.jsx`** (redesign in place) — same flow, new look: email + password,
   links to `/` (back home) and `/signup` (create organization). Drop the old
   "Internal Use Only" footer line. Keep using `useAuthContext().login` —
   do not change the auth call.
3. **`Signup.jsx`** (new) — ONE page, TWO visible sections, ONE submit:
   - Section 1 "Your organization": `orgName` (trimmed, 2–60 chars, required).
   - Section 2 "Your admin account": `name` (2–100), `email` (valid format),
     `password` (min 8 chars), confirm-password (must match, client-side only,
     never sent).
   - Submit calls `signupOrg({ orgName, name, email, password })` from
     `services/authService.js`, navigates to `/dashboard` on success, renders
     the server's `message`/`issues` on failure (same error-display pattern
     as the rest of the app: red bordered box, `animate-pulse`).

## 5. File Paths & Naming (exact — the wiring agent depends on these)

```
client/src/components/Landing/Landing.jsx   (new, default export Landing)
client/src/components/Auth/Login.jsx        (replace in place, keep name + default export)
client/src/components/Auth/Signup.jsx       (new, default export Signup)
```

- Components: `PascalCase`, one component per file, default export, file name
  matches component name.
- Props/state/handlers: `camelCase` (`orgName`, `handleSubmit`, `isLoading`).
- CSS: Tailwind utilities only, no new stylesheets, no inline `<style>` tags.
- No new npm dependencies. `react-router-dom` (`Link`, `useNavigate`) MAY be
  used — the wiring phase installs it.
- Never hardcode API URLs — go through `services/` + `API_BASE_URL`.
- Keep business logic out of components: field checks live in small pure
  guard functions next to the component logic (see existing
  `services/validateTaskForm.js` as the pattern to copy).

## 6. Design Language (match the existing app, don't reinvent)

- Dark theme: near-black gradients (`gray-900 → gray-800 → black`), glass
  cards (`bg-white/5 backdrop-blur-xl border-white/10 rounded-2xl shadow-2xl`).
- Accent: `amber-400` (buttons, highlights, focus rings), hover `amber-300`.
- Status colors (reuse exactly): green = completed, blue = assigned,
  red/yellow = failed/attention.
- Typography: tight semibold headings, `gray-400` secondary text.
- Buttons: rounded-xl, semibold, `active:scale-[0.98] transition`.
- Inputs: `bg-gray-800 border-gray-600 rounded-lg px-4 py-2`, amber focus ring.
- Mobile-first responsive (`sm:`/`md:`/`lg:` breakpoints like current screens).

## 7. Backend Contracts (reference only — do not implement, do not mock away)

- `POST /api/auth/signup` → `201 { message, user: { id, name, email,
  role: "admin", orgId } }` + auto-login cookie. Errors: `400 { message,
  issues }`, `409 { message: "Email already registered" }`, `429` when
  rate-limited. Build the form to this shape; the endpoint arrives in the
  wiring phase.
- Login flow, roles (`admin` / `employee`), and task field enums (priority:
  `General|Average|High`; category: `General|Design|Development|Debugging`)
  are fixed — design selects/options to exactly these values.

## 8. Definition of Done for Your Work

- [ ] The three files exist at the exact paths above with the exact exports.
- [ ] Every page renders with zero backend running (static render, no crashes,
        no missing-data errors) — wiring must be pluggable, not entangled.
- [ ] `npm run build` passes; `npx eslint` reports no errors on touched files.
- [ ] No new dependencies in `package.json`; no hardcoded URLs; no invented
        product claims beyond Section 3.
- [ ] Mobile (`~360px`) and desktop (`~1440px`) both look intentional.
