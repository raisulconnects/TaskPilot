const { z } = require("zod");

const userIdParamSchema = z
  .object({
    userId: z.string().uuid("Invalid id"),
  })
  .strict();

const createUserSchema = z
  .object({
    name: z.string().trim().min(2).max(100),
    email: z.string().trim().toLowerCase().email().max(254),
    password: z.string().min(8).max(256),
    role: z.enum(["employee", "admin"]).optional().default("employee"),
  })
  .strict();

module.exports = { userIdParamSchema, createUserSchema };
