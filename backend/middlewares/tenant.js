function tenantMiddleware(req, res, next) {
  // x-tenant-id or from authenticated user
  const tenantId = req.headers['x-tenant-id'] || (req.user && req.user.tenantId);
  if (!tenantId) {
    return res.status(400).json({ error: 'Missing tenantId' });
  }
  req.tenantId = parseInt(tenantId, 10);
  next();
}

module.exports = { tenantMiddleware };


