-- RLS backstop for tenancy (NOT primary enforcement).
--
-- Primary enforcement stays in the app layer: every query carries
-- where: { orgId }. These policies catch anything forgotten. The runtime
-- keeps the owner connection (owners bypass RLS); the NOLOGIN role below
-- exists solely for the integration proof suite, which reaches it via
-- SET ROLE (an owner privilege — no password lives in this repo).
--
-- current_setting(..., true) returns NULL when unset, and NULL comparisons
-- match nothing: fail-closed by construction. NOTE: org ids are stored as
-- TEXT (Prisma String), so the setting is compared without a ::uuid cast.
-- A wrong-typed cast fails the whole migration (seen during development).

ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Task" ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE ROLE taskpilot_test WITH NOLOGIN;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

GRANT USAGE ON SCHEMA public TO taskpilot_test;
GRANT SELECT, INSERT, UPDATE, DELETE ON "User", "Task" TO taskpilot_test;

CREATE POLICY user_isolation ON "User"
  USING ("orgId" = current_setting('app.org_id', true))
  WITH CHECK ("orgId" = current_setting('app.org_id', true));

CREATE POLICY task_isolation ON "Task"
  USING ("orgId" = current_setting('app.org_id', true))
  WITH CHECK ("orgId" = current_setting('app.org_id', true));
