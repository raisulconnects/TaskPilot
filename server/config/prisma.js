const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");

// Shared Prisma client singleton. One instance per process avoids exhausting
// the connection pool (each PrismaClient opens its own pool). Controllers,
// seed scripts, and jobs must import this module instead of constructing
// their own client. Requires DATABASE_URL at first import.
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

module.exports = prisma;
