-- Trim TaskPriority enum to the client-facing values (General, Average, High).
-- ALTER TYPE ... DROP VALUE cannot run inside a transaction block (which is how
-- Prisma applies migrations), so the enum is swapped via a replacement type.
-- Safe: no production data exists yet, and the client could only ever send the
-- three surviving values, so the USING cast cannot fail on legacy rows.
CREATE TYPE "TaskPriority_new" AS ENUM ('General', 'Average', 'High');
ALTER TABLE "Task" ALTER COLUMN "priority" DROP DEFAULT;
ALTER TABLE "Task" ALTER COLUMN "priority" TYPE "TaskPriority_new" USING ("priority"::text::"TaskPriority_new");
ALTER TYPE "TaskPriority" RENAME TO "TaskPriority_old";
ALTER TYPE "TaskPriority_new" RENAME TO "TaskPriority";
DROP TYPE "TaskPriority_old";
ALTER TABLE "Task" ALTER COLUMN "priority" SET DEFAULT 'General';
