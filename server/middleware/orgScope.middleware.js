/**
 * Stamps req.orgId from the verified JWT (set by authCheckMiddleware).
 * Must run AFTER authCheckMiddleware. Single enforcement point for tenancy:
 * controllers read req.orgId instead of resolving the org themselves.
 *
 * Tokens issued before org claims existed carry no orgId — those sessions get
 * a 401 asking for re-login rather than silent cross-tenant access.
 */
const orgScopeMiddleware = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  if (!req.user.orgId) {
    return res
      .status(401)
      .json({ message: "Session expired. Please log in again." });
  }
  req.orgId = req.user.orgId;
  next();
};

module.exports = orgScopeMiddleware;
