const shopifyService = require('../services/shopifyService');
const { asyncHandler } = require('../utils/helpers');

const getProducts = asyncHandler(async (req, res) => {
  const products = await shopifyService.getProducts(req.tenantId);
  res.json(products);
});

const createProduct = asyncHandler(async (req, res) => {
  const product = await shopifyService.createProduct(req.tenantId, req.body);
  res.status(201).json(product);
});

const getOrders = asyncHandler(async (req, res) => {
  const orders = await shopifyService.getOrders(req.tenantId);
  res.json(orders);
});

const createOrder = asyncHandler(async (req, res) => {
  const order = await shopifyService.createOrder(req.tenantId, req.body);
  res.status(201).json(order);
});

const getCustomers = asyncHandler(async (req, res) => {
  const customers = await shopifyService.getCustomers(req.tenantId);
  res.json(customers);
});

const createCustomer = asyncHandler(async (req, res) => {
  const customer = await shopifyService.createCustomer(req.tenantId, req.body);
  res.status(201).json(customer);
});

const syncNow = asyncHandler(async (req, res) => {
  await shopifyService.syncNow(req.tenantId);
  res.json({ message: 'Sync started' });
});

module.exports = {
  getProducts,
  createProduct,
  getOrders,
  createOrder,
  getCustomers,
  createCustomer,
  syncNow,
};


