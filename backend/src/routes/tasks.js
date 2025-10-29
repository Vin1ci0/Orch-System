const express = require('express');
const TaskController = require('../controllers/TaskController');

const router = express.Router();

router.get('/', TaskController.index);
router.get('/:id', TaskController.show);
router.post('/', TaskController.store);
router.put('/:id', TaskController.update);
router.delete('/:id', TaskController.destroy);

// Task assignees
router.post('/:id/assignees', TaskController.addAssignee);
router.delete('/:id/assignees/:userId', TaskController.removeAssignee);

// Task status
router.put('/:id/status', TaskController.updateStatus);

module.exports = router;