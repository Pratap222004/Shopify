const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/jwt');
const prisma = require('../prisma/client');

async function authMiddleware(req, res, next) {
  const header = req.headers['authorization'];
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid Authorization header' });
  }
  const token = header.slice(7);
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const user = await prisma.user.findUnique({ where: { id: payload.id } });
    if (!user) return res.status(403).json({ error: 'User not found' });
    const tenant = await prisma.tenant.findUnique({ where: { id: user.tenantId } });
    if (!tenant) return res.status(403).json({ error: 'Tenant not found' });
    req.user = user;
    req.tenantId = user.tenantId;
    req.tenant = tenant;
    next();
  } catch (e) {
    console.log('Auth error:', e);
    res.status(401).json({ error: 'Invalid or expired token' });
  }
}

module.exports = { authMiddleware };


