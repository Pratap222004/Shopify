const prisma = require('../prisma/client');

async function getProducts(tenantId) {
  return prisma.product.findMany({ where: { tenantId } });
}
async function createProduct(tenantId, data) {
  return prisma.product.create({ data: { ...data, tenantId } });
}

async function getOrders(tenantId) {
  return prisma.order.findMany({ where: { tenantId } });
}
async function createOrder(tenantId, data) {
  return prisma.order.create({ data: { ...data, tenantId } });
}

async function getCustomers(tenantId) {
  return prisma.customer.findMany({ where: { tenantId } });
}
async function createCustomer(tenantId, data) {
  return prisma.customer.create({ data: { ...data, tenantId } });
}

async function syncNow(tenantId) {
  // TODO: Implement Shopify sync for tenant
  return Promise.resolve();
}

module.exports = {
  getProducts,
  createProduct,
  getOrders,
  createOrder,
  getCustomers,
  createCustomer,
  syncNow,
};


