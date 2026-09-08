import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { Client } from "pg";
import { randomUUID } from "node:crypto";

// RLS PROOF SUITE — runs against a REAL Postgres (Docker locally, service
// container in CI), gated on TEST_DATABASE_URL so plain `npm test` stays
// keyless and instant. This is the only suite that can prove RLS: it issues
// deliberately UNSCOPED queries as the restricted role and asserts the
// database itself enforces tenant boundaries. Probe rows are namespaced so
// the suite is safe to run on a dev DB holding demo data.
const DB_URL = process.env.TEST_DATABASE_URL;
const describeWithDb = DB_URL ? describe : describe.skip;

const PREFIX = `rls-probe-${Date.now()}`;
let owner;
const orgA = { id: null, userId: null };
const orgB = { id: null, userId: null };

const asRole = async (orgId, fn) => {
  const c = new Client({ connectionString: DB_URL });
  await c.connect();
  // Everything runs inside ONE transaction: SET LOCAL only takes effect
  // within a transaction (outside one it warns and silently does nothing —
  // which is exactly the pooling caveat this suite guards). ROLLBACK also
  // guarantees probe writes never persist.
  await c.query("BEGIN");
  try {
    await c.query("SET ROLE taskpilot_test");
    if (orgId) await c.query(`SET LOCAL app.org_id = '${orgId}'`);
    const out = await fn(c);
    await c.query("ROLLBACK");
    return out;
  } catch (e) {
    await c.query("ROLLBACK");
    throw e;
  } finally {
    await c.end();
  }
};

describeWithDb("RLS tenant isolation (live Postgres)", () => {
  beforeAll(async () => {
    owner = new Client({ connectionString: DB_URL });
    await owner.connect();
    for (const slot of [orgA, orgB]) {
      const id = randomUUID();
      await owner.query(
        `INSERT INTO "Organization"(id, name, "createdAt") VALUES ($1, $2, now())`,
        [id, `${PREFIX}`]
      );
      slot.id = id;
      const u = await owner.query(
        `INSERT INTO "User"(id, "orgId", name, email, password, role, "createdAt")
         VALUES ($1, $2, 'probe', $3, 'x', 'employee', now()) RETURNING id`,
        [randomUUID(), id, `${PREFIX}-${id}@x.com`]
      );
      slot.userId = u.rows[0].id;
      await owner.query(
        `INSERT INTO "Task"(id, "orgId", title, description, category, priority, status, "dueDate", "assignedToId", "assignedById", "createdAt", "updatedAt")
         VALUES ($1, $2, $3, 'probe', 'General', 'General', 'assigned', now(), $4, $4, now(), now())`,
        [randomUUID(), id, `${PREFIX}-task`, slot.userId]
      );
    }
  }, 30000);

  afterAll(async () => {
    await owner.query(`DELETE FROM "Task" WHERE title LIKE '${PREFIX}%'`);
    await owner.query(`DELETE FROM "User" WHERE name = 'probe' AND email LIKE '${PREFIX}%'`);
    await owner.query(`DELETE FROM "Organization" WHERE name LIKE '${PREFIX}%'`);
    await owner.end();
  });

  it("an unscoped query sees only the caller's org rows", async () => {
    const rows = await asRole(orgA.id, (c) =>
      c.query(`SELECT DISTINCT "orgId" FROM "Task" WHERE title LIKE '${PREFIX}%'`)
    );
    expect(rows.rows.map((r) => r.orgId)).toEqual([orgA.id]);
    const count = await asRole(orgA.id, (c) =>
      c.query(`SELECT count(*)::int c FROM "Task" WHERE title LIKE '${PREFIX}%' AND "orgId" = '${orgA.id}'`)
    );
    expect(count.rows[0].c).toBe(1);
  });

  it("an unknown org sees nothing (fail-closed)", async () => {
    const r = await asRole("00000000-0000-0000-0000-000000000000", (c) =>
      c.query(`SELECT count(*)::int c FROM "Task" WHERE title LIKE '${PREFIX}%'`)
    );
    expect(r.rows[0].c).toBe(0);
  });

  it("no setting at all sees nothing", async () => {
    const r = await asRole(null, (c) =>
      c.query(`SELECT count(*)::int c FROM "User" WHERE email LIKE '${PREFIX}%'`)
    );
    expect(r.rows[0].c).toBe(0);
  });

  it("WITH CHECK blocks writes into another org", async () => {
    await expect(
      asRole(orgA.id, (c) =>
        c.query(
          `INSERT INTO "Task"(id, "orgId", title, description, category, priority, status, "dueDate", "assignedToId", "assignedById")
           VALUES ($1, $2, '${PREFIX}-sneaky', 'sneaky', 'General', 'General', 'assigned', now(), $3, $3)`,
          [randomUUID(), orgB.id, orgA.userId]
        )
      )
    ).rejects.toMatchObject({ code: "42501" });
  });

  it("concurrent cross-tenant requests never cross-contaminate (pooling proof)", async () => {
    const workers = Array.from({ length: 10 }, (_, i) => {
      const want = i % 2 === 0 ? orgA.id : orgB.id;
      return asRole(want, async (c) => {
        const r = await c.query(
          `SELECT DISTINCT "orgId" FROM "Task" WHERE title LIKE '${PREFIX}%'`
        );
        return { want, got: r.rows.map((x) => x.orgId) };
      });
    });
    const results = await Promise.all(workers);
    for (const { want, got } of results) {
      expect(got).toEqual([want]);
    }
  }, 30000);
});
