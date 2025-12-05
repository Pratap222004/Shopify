const prisma = require('../prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { JWT_SECRET, JWT_EXPIRES } = require('../config/jwt');

async function signup({ name, shopDomain, shopifyAccessToken, email, password }) {
  // Check for existing user
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) throw new Error('Email already registered');
  
  // If shopDomain provided, check for duplicate
  if (shopDomain && shopDomain.trim()) {
    const existingTenant = await prisma.tenant.findUnique({ where: { shopDomain: shopDomain.trim() } });
    if (existingTenant) throw new Error('Shop domain already registered');
  }
  
  const passwordHash = await bcrypt.hash(password, 10);
  
  // Create tenant - use a unique placeholder for shopDomain if not provided
  // (to satisfy unique constraint; can be updated later via settings)
  const finalShopDomain = (shopDomain && shopDomain.trim()) 
    ? shopDomain.trim() 
    : `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  const tenant = await prisma.tenant.create({
    data: { 
      name, 
      shopDomain: finalShopDomain, 
      shopifyAccessToken: shopifyAccessToken || '' 
    },
  });
  
  const user = await prisma.user.create({
    data: { tenantId: tenant.id, email, passwordHash },
  });
  
  const token = jwt.sign({ id: user.id, tenantId: tenant.id }, JWT_SECRET, { expiresIn: JWT_EXPIRES });
  return token;
}

async function login(email, password) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return null;
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return null;
  const token = jwt.sign({ id: user.id, tenantId: user.tenantId }, JWT_SECRET, { expiresIn: JWT_EXPIRES });
  return token;
}

module.exports = { signup, login };

