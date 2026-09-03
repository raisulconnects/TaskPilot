/**
 * @deprecated Phase 1 cleanup (chore/phase-1-cleanup) — NOT MOUNTED.
 * server/index.js never mounts this router. Admin auth uses /api/auth/login.
 * Kept for reference only; scheduled for removal after multi-tenant decision.
 */
const express = require("express");
const router = express.Router();
const { adminLogin } = require("../controllers/adminController");

// POST /api/admins/login — DEPRECATED, unmounted.
router.post("/login", adminLogin);

module.exports = router;
