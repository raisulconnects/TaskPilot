# TaskPilot — Resume Impact Roadmap

- **Date:** 2026-09-04 (UTC)
- **Lens:** Full-stack SWE · 2–4 weeks · engineering depth first
- **Status:** Planned (not started)

Hiring managers skim *claims*; engineers reviewing the repo judge *proof*.
Every item below pairs the **business problem** (the resume bullet) with the
**engineering proof** (what a reviewer finds in the repo).

## Where the app stands today

TaskPilot is a clean, working task manager with realtime updates, AI-assisted
creation, and server-side validation. That is a good *foundation* — but on a
resume it currently reads as "built a todo app," because it has **no tests,
no CI, no story about a real problem being solved, and no hard engineering
decision** a reviewer can sink their teeth into. The cleanup phases
(deprecation discipline, Zod, `doc/` trail) already demonstrate process
maturity most student projects lack. This roadmap builds on that.

## Tier 1 — Do these (highest signal per week)

### 1. Multi-tenancy (Organizations) — the single biggest resume lever
- *Problem solved:* today one shared task pool means any company's data is
  visible to every other — the app is undeployable as a real SaaS product.
  Scoping users/tasks/sockets by `organizationId` turns a demo into a sellable
  product and forces real data-modeling decisions (isolation strategy, index
  design, socket room namespacing, JWT carrying `orgId`).
- *Proof:* migration + scoped queries + tests proving cross-org leakage is
  impossible. "Designed multi-tenant isolation" is a senior-flavored bullet.
- *Effort:* ~1 week. The unified `Employee` model and Zod layer make this the
  natural next step.

### 2. Test suite + CI pipeline — the engineering-depth multiplier
- *Problem solved:* zero tests, zero CI. Nothing proves the auth rules, role
  gates, or validation actually hold. A GitHub Actions pipeline running server
  tests + client build + lint on every PR turns every other feature from
  "claimed" into "proven."
- *Proof:* Vitest/Jest coverage of validation middleware, auth/role gates, and
  the auto-fail logic; workflow badge in README. Reviewers *see* green checks.
- *Effort:* ~3–4 days, and it compounds the value of everything after it.

### 3. Overdue escalation + notifications (business logic with teeth)
- *Problem solved:* today overdue tasks silently flip to `failed` — nobody is
  told, nobody acts. That's not a workflow, it's a label. Deadline reminders
  (due in 24h), overdue escalation to admin, and an in-app notification inbox
  (reusing our Socket.IO rooms) model how real ops tools prevent SLA breaches.
- *Proof:* scheduled job + socket events + notification persistence. Demoable
  *and* architecturally interesting.
- *Effort:* ~4–5 days.

## Tier 2 — Strong if time remains

### 4. Audit trail / activity feed
*Who changed what, when.* Compliance-flavored, trivial to implement on top of
existing task mutations (a middleware that logs actor + diff), and it answers
the interview question "how would you debug a disputed task change?"

### 5. Task comments + file attachments
Turns assignment into *collaboration*; justifies Cloudinary/S3 integration and
access-control checks on uploads.

### 6. Search, filter, pagination
The current `GET /tasks` returns *everything*. Server-side query
(status/priority/assignee/text) with pagination is unglamorous but exactly the
kind of "scale thinking" reviewers look for, and it's cheap (~2 days).

### 7. Role expansion (manager role) + ownership enforcement
Today any employee can complete any task and any admin can edit anything.
Scoping actions to assignee/owner is a real authorization story.

## Tier 3 — Skip for now (low signal per effort)

Public marketing pages, dark/light toggle, more chart types, email/password
reset via SMTP — all fine products, but none prove engineering judgment, and
reviewers won't click them.

## Proposed 2–4 week roadmap

| Week | Focus | Ships |
|---|---|---|
| 1 | Tests + CI | Suite covering validation/auth/roles/auto-fail; Actions pipeline; README badges |
| 2 | Multi-tenancy | `Organization` model, org-scoped queries/sockets/JWT, leakage tests, `doc/` design note |
| 3 | Escalation + notifications | Scheduler, notification model + inbox UI, socket delivery |
| 4 (buffer) | Audit trail + pagination | Activity feed, paginated/filtered task API |

Each week ends with a merged PR and a `doc/` note — continuing the trail
habit, which itself is a differentiator.

## How this reads on a resume (draft bullets)

- *"Migrated single-tenant task manager to multi-tenant SaaS architecture with
  org-scoped data isolation, JWT org claims, and leakage-prevention tests."*
- *"Built CI-gated test suite covering auth, RBAC, and input validation; every
  PR runs tests + lint + production build."*
- *"Designed SLA workflow: deadline reminders, overdue escalation, and realtime
  notification inbox over Socket.IO rooms."*

## Suggested start order

**Tests + CI first** (it de-risks everything after), then multi-tenancy.
