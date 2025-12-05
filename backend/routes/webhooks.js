const express = require('express');
const webhooksController = require('../controllers/webhooksController');
const router = express.Router();

router.post('/', webhooksController.handle);

module.exports = router;


