const prisma = require('../prisma/client');
const shopifyService = require('./shopifyService');
const metricsService = require('./metricsService');

const DEMO_MODE = process.env.DEMO_MODE === 'true';

// Helpers for demo data generation
function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomDateWithinDays(days) {
  const now = new Date();
  const past = new Date(now);
  past.setDate(now.getDate() - days);
  return new Date(randomBetween(past.getTime(), now.getTime()));
}

const FIRST_NAMES = ['Alex', 'Jordan', 'Taylor', 'Casey', 'Riley', 'Drew', 'Sam', 'Jamie', 'Morgan', 'Avery'];
const LAST_NAMES = ['Smith', 'Johnson', 'Lee', 'Patel', 'Garcia', 'Brown', 'Davis', 'Martinez', 'Clark', 'Lopez'];
const PRODUCT_NAMES = [
  'Essential Hoodie',
  'Premium Tee',
  'Everyday Backpack',
  'Running Shoes',
  'Wireless Earbuds',
  'Smartwatch',
  'Travel Mug',
  'Desk Lamp',
  'Notebook Set',
  'Bluetooth Speaker',
  'Fitness Band',
  'Sunglasses',
  'Baseball Cap',
  'Water Bottle',
  'Yoga Mat',
  'Laptop Sleeve',
  'Phone Case',
  'Wireless Charger',
  'Beanie',
  'Canvas Tote',
];

async function generateDemoData(tenantId) {
  // Clear existing data for tenant to avoid duplicates
  await prisma.order.deleteMany({ where: { tenantId } });
  await prisma.product.deleteMany({ where: { tenantId } });
  await prisma.customer.deleteMany({ where: { tenantId } });
  
  // Update lastSyncedAt timestamp
  await prisma.tenant.update({
    where: { id: tenantId },
    data: { lastSyncedAt: new Date() },
  });

  // Clear metrics cache for this tenant
  await metricsService.clearCacheForTenant(tenantId);

  // Customers
  const customerCount = randomBetween(20, 50);
  const customers = [];
  for (let i = 0; i < customerCount; i++) {
    const first = FIRST_NAMES[randomBetween(0, FIRST_NAMES.length - 1)];
    const last = LAST_NAMES[randomBetween(0, LAST_NAMES.length - 1)];
    const email = `${first.toLowerCase()}.${last.toLowerCase()}${randomBetween(100, 999)}@example.com`;
    const shopifyCustomerId = `demo-cust-${tenantId}-${Date.now()}-${i}`;
    const customer = await prisma.customer.create({
      data: {
        tenantId,
        shopifyCustomerId,
        firstName: first,
        lastName: last,
        email,
      },
    });
    customers.push(customer);
  }

  // Products
  const productCount = randomBetween(10, 20);
  const products = [];
  for (let i = 0; i < productCount; i++) {
    const title = PRODUCT_NAMES[randomBetween(0, PRODUCT_NAMES.length - 1)];
    const price = parseFloat((Math.random() * 190 + 10).toFixed(2)); // 10 - 200
    const product = await prisma.product.create({
      data: {
        tenantId,
        shopifyProductId: `demo-prod-${tenantId}-${Date.now()}-${i}`,
        title,
        price,
      },
    });
    products.push(product);
  }

  // Orders
  const orderCount = randomBetween(50, 200);
  for (let i = 0; i < orderCount; i++) {
    const customer = customers[randomBetween(0, customers.length - 1)];
    const totalPrice = parseFloat((Math.random() * 190 + 10).toFixed(2)); // 10 - 200
    const placedAt = randomDateWithinDays(60);

    await prisma.order.create({
      data: {
        tenantId,
        shopifyOrderId: `demo-order-${tenantId}-${Date.now()}-${i}`,
        customerId: customer.id,
        totalPrice,
        currency: 'USD',
        placedAt,
      },
    });
  }

  return {
    customersSynced: customerCount,
    ordersSynced: orderCount,
    productsSynced: productCount,
    message: 'Demo data generated',
  };
}

/**
 * Sync all Shopify data for a specific tenant
 * Fetches customers, orders, products from Shopify and upserts into DB
 */
async function syncTenantData(tenantId) {
  try {
    console.log(`Starting sync for tenant: ${tenantId}`);

    // Get tenant with credentials
    const tenant = await prisma.tenant.findUnique({ where: { id: tenantId } });
    if (!tenant) {
      throw new Error(`Tenant ${tenantId} not found`);
    }

    const shouldUseDemo =
      DEMO_MODE ||
      !tenant.shopifyAccessToken ||
      !tenant.shopDomain ||
      tenant.shopDomain.startsWith('temp-');

    if (shouldUseDemo) {
      console.log(`Running demo data sync for tenant ${tenantId}`);
      const result = await generateDemoData(tenantId);
      return result;
    }

    let customersSynced = 0;
    let ordersSynced = 0;
    let productsSynced = 0;
    let usedDemoData = false;

    // Fetch and sync customers
    const shopifyCustomers = await shopifyService.fetchCustomersFromShopify(tenant);
    
    // If no data from Shopify API, fall back to demo data
    if (shopifyCustomers.length === 0) {
      console.log(`No Shopify data found for tenant ${tenantId}, generating demo data`);
      return await generateDemoData(tenantId);
    }
    
    for (const shopifyCustomer of shopifyCustomers) {
      await prisma.customer.upsert({
        where: { shopifyCustomerId: String(shopifyCustomer.id) },
        update: {
          firstName: shopifyCustomer.first_name || '',
          lastName: shopifyCustomer.last_name || '',
          email: shopifyCustomer.email || '',
        },
        create: {
          tenantId: tenantId,
          shopifyCustomerId: String(shopifyCustomer.id),
          firstName: shopifyCustomer.first_name || '',
          lastName: shopifyCustomer.last_name || '',
          email: shopifyCustomer.email || '',
        },
      });
      customersSynced++;
    }

    // Fetch and sync products
    const shopifyProducts = await shopifyService.fetchProductsFromShopify(tenant);
    
    // If no products from Shopify API, fall back to demo data
    if (shopifyProducts.length === 0) {
      console.log(`No Shopify products found for tenant ${tenantId}, generating demo data`);
      return await generateDemoData(tenantId);
    }
    
    for (const shopifyProduct of shopifyProducts) {
      const price = parseFloat(shopifyProduct.variants?.[0]?.price || '0');
      await prisma.product.upsert({
        where: { shopifyProductId: String(shopifyProduct.id) },
        update: {
          title: shopifyProduct.title || '',
          price: price,
        },
        create: {
          tenantId: tenantId,
          shopifyProductId: String(shopifyProduct.id),
          title: shopifyProduct.title || '',
          price: price,
        },
      });
      productsSynced++;
    }

    // Fetch and sync orders (requires customers to exist first)
    const shopifyOrders = await shopifyService.fetchOrdersFromShopify(tenant);
    
    // If no orders from Shopify API, fall back to demo data
    if (shopifyOrders.length === 0) {
      console.log(`No Shopify orders found for tenant ${tenantId}, generating demo data`);
      return await generateDemoData(tenantId);
    }
    
    for (const shopifyOrder of shopifyOrders) {
      // Find or create customer for this order
      let customer = await prisma.customer.findUnique({
        where: { shopifyCustomerId: String(shopifyOrder.customer?.id || '0') },
      });

      if (!customer && shopifyOrder.customer) {
        // Create customer if order has customer but we don't have it
        customer = await prisma.customer.create({
          data: {
            tenantId: tenantId,
            shopifyCustomerId: String(shopifyOrder.customer.id),
            firstName: shopifyOrder.customer.first_name || '',
            lastName: shopifyOrder.customer.last_name || '',
            email: shopifyOrder.customer.email || '',
          },
        });
        customersSynced++;
      }

      if (customer) {
        const totalPrice = parseFloat(shopifyOrder.total_price || '0');
        const placedAt = shopifyOrder.created_at ? new Date(shopifyOrder.created_at) : new Date();

        await prisma.order.upsert({
          where: { shopifyOrderId: String(shopifyOrder.id) },
          update: {
            totalPrice: totalPrice,
            currency: shopifyOrder.currency || 'USD',
            placedAt: placedAt,
          },
          create: {
            tenantId: tenantId,
            shopifyOrderId: String(shopifyOrder.id),
            customerId: customer.id,
            totalPrice: totalPrice,
            currency: shopifyOrder.currency || 'USD',
            placedAt: placedAt,
          },
        });
        ordersSynced++;
      }
    }

    // Update lastSyncedAt timestamp
    await prisma.tenant.update({
      where: { id: tenantId },
      data: { lastSyncedAt: new Date() },
    });

    // Clear metrics cache for this tenant so fresh data is shown
    await metricsService.clearCacheForTenant(tenantId);

    console.log(`Sync completed for tenant ${tenantId}: ${customersSynced} customers, ${ordersSynced} orders, ${productsSynced} products`);

    return {
      message: 'Sync completed successfully',
      customersSynced,
      ordersSynced,
      productsSynced,
    };
  } catch (error) {
    console.error(`Sync error for tenant ${tenantId}:`, error);
    throw new Error(`Failed to sync Shopify data: ${error.message}`);
  }
}

/**
 * Sync all tenants (for cron job)
 */
async function syncAllTenants() {
  const tenants = await prisma.tenant.findMany();
  const results = [];

  for (const tenant of tenants) {
    try {
      const result = await syncTenantData(tenant.id);
      results.push({ tenantId: tenant.id, tenantName: tenant.name, ...result });
    } catch (error) {
      results.push({ tenantId: tenant.id, tenantName: tenant.name, error: error.message });
    }
  }

  return results;
}

module.exports = { syncTenantData, syncAllTenants };
