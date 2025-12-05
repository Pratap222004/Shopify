const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middlewares/authMiddleware');
const metricsController = require('../controllers/metricsController');

router.get('/summary', authMiddleware, metricsController.summary);
router.get('/orders-by-date', authMiddleware, metricsController.ordersByDate);
router.get('/revenue-by-date', authMiddleware, metricsController.revenueByDate);
router.get('/top-customers', authMiddleware, metricsController.topCustomers);
router.get('/product-performance', authMiddleware, metricsController.productPerformance);

module.exports = router;

