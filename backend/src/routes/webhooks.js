const express = require('express');
const router = express.Router();
const webhooksController = require('../controllers/webhooksController');

router.post('/orders/create', webhooksController.orderCreate);
router.post('/customers/create', webhooksController.customerCreate);

module.exports = router;


