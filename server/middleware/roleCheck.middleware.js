const roleCheck = function (...allowedRoles) {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: "You are not allowed to do this!" });
    }
    console.log("Passed roleCheck Middleware Successfully!");
    next();
  };
};

module.exports = roleCheck;
