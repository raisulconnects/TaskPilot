// Socket.IO authentication: identity comes from the same httpOnly `token`
// cookie the REST API verifies (see authCheck.middleware.js), never from
// client-supplied handshake fields. Previously the server trusted
// `handshake.auth.{userId, role, orgId}`, so any client could claim
// `role: "admin"` and join its org's admin room.
const jwt = require("jsonwebtoken");

const readCookie = (header, name) => {
  if (!header) return undefined;
  for (const part of header.split(";")) {
    const eq = part.indexOf("=");
    if (eq === -1) continue;
    if (part.slice(0, eq).trim() === name) {
      return decodeURIComponent(part.slice(eq + 1).trim());
    }
  }
  return undefined;
};

/**
 * Returns { id, role, orgId } from a verified token in the Cookie header.
 * Throws if the cookie is missing, the token is invalid/expired, or the
 * payload lacks the fields rooms are built from.
 */
const identityFromCookie = (cookieHeader, secret = process.env.JWT_SECRET) => {
  const token = readCookie(cookieHeader, "token");
  if (!token) throw new Error("Not authenticated");
  const { id, role, orgId } = jwt.verify(token, secret);
  if (!id || !role || !orgId) throw new Error("Invalid token payload");
  return { id, role, orgId };
};

// io.use() middleware: rejects the connection unless the cookie verifies.
const socketAuthMiddleware = (socket, next) => {
  try {
    socket.data.user = identityFromCookie(socket.handshake.headers.cookie);
    next();
  } catch {
    next(new Error("Not authenticated"));
  }
};

module.exports = { readCookie, identityFromCookie, socketAuthMiddleware };
