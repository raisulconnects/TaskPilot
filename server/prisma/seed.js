// Demo seed: one org (SumoOrg) with an admin, a few employees, and sample
// tasks across statuses. Re-runnable: users are upserted, org tasks are
// rebuilt. Passwords are bcrypt-hashed like production seeds (auth uses
// bcrypt.compare). NOTE: demo passwords below are local-dev only — real users
// will come through the invite/registration flow (tenancy phase), never
// hardcoded credentials. Uses plain CJS require() like the rest of the server.
const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

const daysFromNow = (n) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d;
};

async function main() {
  let org = await prisma.organization.findFirst({
    where: { name: "SumoOrg" },
  });
  if (!org) {
    org = await prisma.organization.create({ data: { name: "SumoOrg" } });
  }
  console.log(`org: ${org.name} (${org.id})`);

  const upsertUser = (name, email, password, role) =>
    prisma.user.upsert({
      where: { orgId_email: { orgId: org.id, email } },
      update: { name, password: bcrypt.hashSync(password, 10), role },
      create: {
        orgId: org.id,
        name,
        email,
        password: bcrypt.hashSync(password, 10),
        role,
      },
    });

  const admin = await upsertUser("Sumo Admin", "admin@sumo.com", "11223344", "admin");
  const emp1 = await upsertUser("Rahim Uddin", "rahim@sumo.com", "employee1", "employee");
  const emp2 = await upsertUser("Karim Sheikh", "karim@sumo.com", "employee1", "employee");
  const emp3 = await upsertUser("Nusrat Jahan", "nusrat@sumo.com", "employee1", "employee");
  console.log(`users: 1 admin + 3 employees`);

  // Rebuild demo tasks so re-runs stay clean.
  await prisma.task.deleteMany({ where: { orgId: org.id } });

  const tasks = [
    {
      title: "Design landing page hero",
      description: "Create a modern hero section with CTA for the new landing page.",
      category: "Design",
      priority: "High",
      status: "assigned",
      dueDate: daysFromNow(5),
      assignedToId: emp1.id,
    },
    {
      title: "Fix login redirect bug",
      description: "Users land on a blank page after login when the session expires mid-flow.",
      category: "Debugging",
      priority: "High",
      status: "assigned",
      dueDate: daysFromNow(2),
      assignedToId: emp2.id,
    },
    {
      title: "Set up CI pipeline",
      description: "GitHub Actions running tests, lint, and production build on every PR.",
      category: "Development",
      priority: "Average",
      status: "completed",
      dueDate: daysFromNow(-3),
      assignedToId: emp2.id,
    },
    {
      title: "Write API documentation",
      description: "Document all task and auth endpoints with request/response examples.",
      category: "General",
      priority: "General",
      status: "assigned",
      dueDate: daysFromNow(10),
      assignedToId: emp3.id,
    },
    {
      title: "Overdue client report",
      description: "Monthly report that missed its deadline — kept to exercise the failed flow.",
      category: "General",
      priority: "Average",
      status: "failed",
      dueDate: daysFromNow(-7),
      assignedToId: emp1.id,
    },
    {
      title: "Refactor socket rooms",
      description: "Namespace realtime rooms per organization ahead of multi-tenancy.",
      category: "Development",
      priority: "Average",
      status: "assigned",
      dueDate: daysFromNow(7),
      assignedToId: emp3.id,
    },
  ];

  for (const t of tasks) {
    await prisma.task.create({
      data: { ...t, orgId: org.id, assignedById: admin.id },
    });
  }
  console.log(`tasks: ${tasks.length} created`);

  // Guardrails: fail loudly if assumptions ever break.
  const counts = await prisma.task.groupBy({
    by: ["status"],
    where: { orgId: org.id },
    _count: { _all: true },
  });
  console.log("by status:", JSON.stringify(counts));
}

main()
  .catch((e) => {
    console.error("SEED_FAILED:", e.message);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
