const prisma = require("../config/prisma");
const bcrypt = require("bcryptjs");

const SAFE_SELECT = { id: true, name: true, email: true, role: true };

// Admin creates a member in their own org. Password hashed explicitly here —
// never a model hook (seeds store pre-hashed passwords; a hook would
// double-hash them). Org is stamped from req.orgId, never the client.
const createUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      console.log("[users] rejected: email already registered");
      return res.status(409).json({ message: "Email already registered" });
    }

    const user = await prisma.user.create({
      data: {
        orgId: req.orgId,
        name,
        email,
        password: await bcrypt.hash(password, 10),
        role,
      },
      select: SAFE_SELECT,
    });

    console.log("[users] member created in org:", req.orgId);
    return res.status(201).json({ user });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Admin removes a member. Ordered guards: self → last admin → foreign/missing
// (404, anti-enumeration) → task-holder (409, FK Restrict mapped — deletes
// never cascade, so no work is ever silently destroyed).
const deleteUser = async (req, res) => {
  const { userId } = req.params;

  try {
    if (userId === req.user.id) {
      return res.status(409).json({ message: "Cannot delete your own account" });
    }

    const target = await prisma.user.findUnique({ where: { id: userId } });
    if (!target || target.orgId !== req.orgId) {
      return res.status(404).json({ message: "Member not found" });
    }

    if (target.role === "admin") {
      const adminCount = await prisma.user.count({
        where: { orgId: req.orgId, role: "admin" },
      });
      if (adminCount <= 1) {
        return res
          .status(409)
          .json({ message: "Cannot delete the last admin" });
      }
    }

    await prisma.user.delete({ where: { id: userId } });
    return res.status(200).json({ message: "Member removed" });
  } catch (error) {
    if (error?.code === "P2003" || error?.code === "P2014") {
      return res
        .status(409)
        .json({ message: "Reassign or resolve their tasks first" });
    }
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { createUser, deleteUser };
