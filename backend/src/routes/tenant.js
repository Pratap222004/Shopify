const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middlewares/authMiddleware');
const tenantController = require('../controllers/tenantController');

router.get('/settings', authMiddleware, tenantController.getSettings);
router.put('/settings', authMiddleware, tenantController.updateSettings);

module.exports = router;


