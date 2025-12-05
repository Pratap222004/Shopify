const prisma = require('../prisma/client');

async function syncAllTenants() {
  const tenants = await prisma.tenant.findMany();
  for (const tenant of tenants) {
    // TODO: Run Shopify data sync per tenant (API pull)
    // e.g. await shopifyApiSync(tenant)
    console.log(`Syncing data for tenant: ${tenant.name}`);
  }
}

module.exports = { syncAllTenants };


