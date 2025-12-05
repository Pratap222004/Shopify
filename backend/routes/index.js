const express = require('express');
const authRoutes = require('./auth');
const tenantsRoutes = require('./tenants');
const shopifyRoutes = require('./shopify');
const webhooksRoutes = require('./webhooks');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/tenants', tenantsRoutes);
router.use('/shopify', shopifyRoutes);
router.use('/webhooks', webhooksRoutes);

module.exports = router;


