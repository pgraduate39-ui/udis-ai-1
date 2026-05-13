const auditLog = (req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[AUDIT] ${timestamp} | User: ${req.user?.email} | Role: ${req.user?.role} | Endpoint: ${req.originalUrl}`);
  next();
};

module.exports = auditLog;