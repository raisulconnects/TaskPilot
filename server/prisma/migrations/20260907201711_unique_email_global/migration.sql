-- Single-identity model: email unique globally (matches legacy Mongo behavior).
DROP INDEX IF EXISTS "User_orgId_email_key";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
