// Kan-importiw express bash nsta3mlou l-router l-mzyan
const express = require('express');
const router = express.Router();
const resourceController = require('../controllers/resourceController');
const auth = require('../middleware/auth');
router.post('/', auth(['manager', 'admin']), resourceController.createResource);
router.get('/', auth(), resourceController.getResources);
router.put('/:id', auth(['manager', 'admin']), resourceController.updateResource);
router.delete('/:id', auth(['admin']), resourceController.deleteResource);
module.exports = router;