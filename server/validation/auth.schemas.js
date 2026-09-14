const { z } = require("zod");

const loginSchema = z
  .object({
    email: z.string().trim().toLowerCase().email().max(254),
    password: z.string().min(1).max(256),
  })
  .strict();

const signupSchema = z
  .object({
    orgName: z.string().trim().min(2).max(60),
    name: z.string().trim().min(2).max(100),
    email: z.string().trim().toLowerCase().email().max(254),
    password: z.string().min(8).max(256),
  })
  .strict();

module.exports = { loginSchema, signupSchema };
