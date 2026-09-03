const { z } = require("zod");

const aiTitleSchema = z
  .object({
    title: z.string().trim().min(3).max(200),
  })
  .strict();

module.exports = { aiTitleSchema };
