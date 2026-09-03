const formatIssues = (zodError) =>
  zodError.issues.map((issue) => ({
    path: issue.path.join("."),
    message: issue.message,
  }));

const validateBody = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      message: "Validation failed",
      issues: formatIssues(result.error),
    });
  }
  req.body = result.data;
  next();
};

const validateParams = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.params);
  if (!result.success) {
    return res.status(400).json({
      message: "Validation failed",
      issues: formatIssues(result.error),
    });
  }
  req.params = result.data;
  next();
};

module.exports = { validateBody, validateParams };
