// Kan-importiw express bash nsta3mlou l-router l-mzyan
const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const auth = require('../middleware/auth');
router.post('/', auth(['manager', 'admin']), taskController.createTask);
router.get('/project/:projectId', auth(), taskController.getTasksByProject);
router.put('/:id', auth(['manager', 'admin']), taskController.updateTask);
router.delete('/:id', auth(['admin']), taskController.deleteTask);
module.exports = router;