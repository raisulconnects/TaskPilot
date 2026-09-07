# Why Postgres for TaskPilot

- **Date:** 2026-09-06 (UTC)
- **Status:** Decision record — migration approved, implementation plan in `doc/plan-postgres-migration.md`
- **Context:** Other projects on this resume use MongoDB. TaskPilot moves to Postgres (via Prisma) so each database is *chosen for fit and used natively* — not collected as logos.

## 1. RLS — tenant isolation as database law, not convention

This is the headline benefit and the reason Postgres pairs with our chosen
pooled-tenancy approach (Approach 1: shared tables + `organizationId`).

Pooled tenancy's one structural weakness is that the wall between tenants is
*convention*: every query must remember to filter by org, and one forgotten
filter leaks data. Row-Level Security fixes that at the storage layer.
Mechanically: each request sets its org (`SET LOCAL app.org_id = '...'` inside
a transaction), and policies such as
`USING (org_id = current_setting('app.org_id')::uuid)` silently scope **every**
query on the table — including ones a future developer writes without knowing
about tenancy.

The leakage tests then prove a negative no Mongo-based design can prove:
*even a deliberately unscoped query returns nothing cross-tenant.*

(Caveat recorded for implementation: the per-request setting must run inside a
transaction, otherwise it can leak across reused pooled connections. See the
migration plan.)

## 2. Foreign keys — kills a real bug class we have today

Today `assignedTo` is a free-form ObjectId; nothing stops creating a task
assigned to a user that doesn't exist, and deleting a user orphans their tasks
silently. Postgres foreign keys (`task.assigned_to_id REFERENCES users(id)`)
make both impossible at the storage layer, with explicit `ON DELETE` behavior
we choose (restrict vs. set-null vs. cascade) instead of whatever happens to
happen. The "assign to nonexistent user → rejected" test becomes a one-liner
against a real constraint.

## 3. The schema becomes self-documenting and strict

Native enum types for `status`/`priority`/`category` end the drift we already
hit once (model allowed 5 priorities, AI returned 3, client showed 3) — one
source of truth enforced by the database. `NOT NULL` where it matters, `CHECK`
constraints (e.g. valid `due_date`), `updated_at` triggers. Validation becomes
defense-in-depth (Zod for friendly 400s, constraints as the backstop) instead
of Zod-or-nothing.

## 4. Transactions for the phases after this one

"Create task + write audit row", "complete task + insert notification" — today
each would be sequential prayers; the second write can fail and leave
half-state. Postgres transactions (via Prisma `$transaction`) make them
atomic. This doesn't pay off this week, but it is the foundation the
notifications + audit-trail phases will stand on — which is why the schema is
designed for it now rather than retrofitted later.

## 5. Dashboards become real queries

Status distribution and per-employee completions are currently "fetch ALL tasks
and count in JavaScript" — fine at 50 tasks, embarrassing at 50,000 and
unshowable as engineering. In Postgres they are single `GROUP BY` queries,
scoped by RLS automatically. Same pixels, real backend story.

## 6. Migrations as reviewable history + a stronger test seam

Prisma Migrate turns schema evolution into versioned SQL files
(`001_init` → `002_organizations` → `003_rls_policies`) — reviewers literally
read the project's growth. And for tests, `pg-mem` runs genuine
Postgres-compatible SQL in-memory with no server, which is a *stronger* seam
than our current Mongoose spies: queries execute for real, only the transport
is fake.

## 7. Resume arithmetic (the actual motive — stated honestly)

MongoDB elsewhere + Postgres here = range, but the value isn't the logo. It's
that each was *chosen for fit* and *used natively* (FKs, RLS, transactions,
GROUP BY). A 1:1 port treating Postgres like "Mongo with tables" would add
weeks for zero signal — which is why the migration plan explicitly requires
the relational features, not just the database.

## 8. Honest counterweight

What we give up: schema flexibility (a new field means a migration, not just
new JSON — a feature for rigor, a tax on speed), Mongoose `populate`
ergonomics (Prisma `include` is equivalent, rewritten ~10 times), and our
Atlas/test-seam familiarity (replaced by Neon/Supabase + new mocking
patterns). Nothing here is a blocker; all of it is priced into the 1–2 week
estimate.
