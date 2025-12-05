const prisma = require('../prisma/client');

async function getTenantById(tenantId) {
  return prisma.tenant.findUnique({
    where: { id: tenantId },
    select: {
      id: true,
      name: true,
      shopDomain: true,
      shopifyAccessToken: true,
      lastSyncedAt: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

async function updateTenant(tenantId, data) {
  // Only update provided fields
  const updateData = {};
  if (data.name !== undefined) updateData.name = data.name;
  if (data.shopDomain !== undefined) updateData.shopDomain = data.shopDomain;
  if (data.shopifyAccessToken !== undefined) updateData.shopifyAccessToken = data.shopifyAccessToken;

  return prisma.tenant.update({
    where: { id: tenantId },
    data: updateData,
  });
}

module.exports = { getTenantById, updateTenant };

