// Prisma stubbing helper — lives on the SAME CJS pipeline as the controllers.
//
// Why this exists (same reason as socket-test-helper.js): a test's ESM import
// of `config/prisma.js` and a controller's CJS require() of it resolve to
// DIFFERENT module instances, so vi.mock()/vi.spyOn() from tests never reach
// the object controllers query (verified empirically during the Vitest rollout).
// Mutating the shared instance from THIS file (plain CJS require, identical
// pipeline to the controllers) lands stubs exactly where they execute.
//
// Usage per test file:
//   import prismaHelper from "./helpers/prisma-test-helper.js";
//   const task = { create: vi.fn(), ... };
//   beforeEach(() => prismaHelper.stubPrisma({ task, user }));
const prisma = require("../../config/prisma.js");

// Replaces whole model delegates with stub objects. Every test file must
// (re)install its stubs in beforeEach — there is no restore step.
const stubPrisma = (stubs) => {
  for (const [model, methods] of Object.entries(stubs)) {
    prisma[model] = { ...methods };
  }
  return prisma;
};

module.exports = { prisma, stubPrisma };
