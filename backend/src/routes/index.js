const express = require('express');
const router = express.Router();

router.use('/auth', require('./auth'));
router.use('/sync', require('./sync'));
router.use('/metrics', require('./metrics'));
router.use('/webhooks', require('./webhooks'));
router.use('/tenant', require('./tenant'));

module.exports = router;

