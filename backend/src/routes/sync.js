const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middlewares/authMiddleware');
const { run } = require('../controllers/syncController');
router.post('/run', authMiddleware, run);
module.exports = router;


