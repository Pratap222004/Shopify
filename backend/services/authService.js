const prisma = require('../prisma/client');
const jwt = require('jsonwebtoken');
const { JWT_SECRET, JWT_EXPIRES } = require('../config/jwt');

async function login(email, password) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || user.password !== password) return null; // TODO: Hash password
  const token = jwt.sign({ id: user.id, email: user.email, tenantId: user.tenantId }, JWT_SECRET, { expiresIn: JWT_EXPIRES });
  return token;
}

async function register(email, password, tenantName) {
  const tenant = await prisma.tenant.create({ data: { name: tenantName } });
  const user = await prisma.user.create({ data: { email, password, tenantId: tenant.id } }); // TODO: Hash password
  const token = jwt.sign({ id: user.id, email: user.email, tenantId: tenant.id }, JWT_SECRET, { expiresIn: JWT_EXPIRES });
  return token;
}

module.exports = { login, register };


