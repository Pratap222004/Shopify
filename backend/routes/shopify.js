const express = require('express');
const shopifyController = require('../controllers/shopifyController');
const router = express.Router();

// Products
router.get('/products', shopifyController.getProducts);
router.post('/products', shopifyController.createProduct);
// Orders
router.get('/orders', shopifyController.getOrders);
router.post('/orders', shopifyController.createOrder);
// Customers
router.get('/customers', shopifyController.getCustomers);
router.post('/customers', shopifyController.createCustomer);
// Explicit sync trigger
router.post('/sync', shopifyController.syncNow);

module.exports = router;


