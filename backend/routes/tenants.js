const express = require('express');
const tenantsController = require('../controllers/tenantsController');
const router = express.Router();

router.get('/', tenantsController.getAll);
router.post('/', tenantsController.create);
router.get('/:id', tenantsController.getById);
router.patch('/:id', tenantsController.update);
router.delete('/:id', tenantsController.remove);

module.exports = router;


