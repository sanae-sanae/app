// Kan-importiw express bash nsta3mlou l-router
const express = require('express');
const router = express.Router();
const supplierController = require('../controllers/supplierController');
const auth = require('../middleware/auth');
router.post('/', auth(['admin']), supplierController.createSupplier);
router.get('/', auth(), supplierController.getSuppliers);
router.put('/:id', auth(['admin']), supplierController.updateSupplier);
router.delete('/:id', auth(['admin']), supplierController.deleteSupplier);
module.exports = router;