const prisma = require("../config/prisma");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config({ config: "../.env", quiet: true });

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Email is globally unique (single-identity model), so findUnique applies.
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user)
      return res.status(401).json({ message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid email or password" });

    const token = jwt.sign(
      {
        name: user.name,
        email: user.email,
        role: user.role,
        id: user.id,
        orgId: user.orgId,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      maxAge: 3600000,
    });

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        orgId: user.orgId,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Public org signup: creates an organization AND its first admin atomically,
// then auto-logs in. Password is hashed explicitly here — never a model hook
// (seeds store pre-hashed passwords; a hook would double-hash them).
// TODO(rate-limit): add express-rate-limit before public launch. Open signup
// + intentionally-expensive bcrypt hashing is a CPU-burn target. Until then,
// attempts are logged below so abuse is visible in production logs.
const signup = async (req, res) => {
  const { orgName, name, email, password } = req.body;

  try {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      console.log("[signup] rejected: email already registered");
      return res.status(409).json({ message: "Email already registered" });
    }

    const hashed = await bcrypt.hash(password, 10);
    const { org, user } = await prisma.$transaction(async (tx) => {
      const org = await tx.organization.create({ data: { name: orgName } });
      const user = await tx.user.create({
        data: {
          orgId: org.id,
          name,
          email,
          password: hashed,
          role: "admin",
        },
      });
      return { org, user };
    });

    console.log("[signup] org created:", org.id);

    const token = jwt.sign(
      {
        name: user.name,
        email: user.email,
        role: user.role,
        id: user.id,
        orgId: user.orgId,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      maxAge: 3600000,
    });

    res.status(201).json({
      message: "Organization created",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        orgId: user.orgId,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });

    res.status(200).json({
      message: "Logout successful",
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const authCheck = (req, res) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    return res.status(200).json({
      name: decoded.name,
      email: decoded.email,
      role: decoded.role,
      id: decoded.id,
      orgId: decoded.orgId,
    });
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = { login, logout, authCheck, signup };
