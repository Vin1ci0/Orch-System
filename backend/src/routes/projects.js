const express = require('express');
const ProjectController = require('../controllers/ProjectController');

const router = express.Router();

router.get('/', ProjectController.index);
router.get('/:id', ProjectController.show);
router.post('/', ProjectController.store);
router.put('/:id', ProjectController.update);
router.delete('/:id', ProjectController.destroy);

// Project members
router.get('/:id/members', ProjectController.listMembers);
router.post('/:id/members', ProjectController.addMember);
router.delete('/:id/members/:userId', ProjectController.removeMember);

// Project stats
router.get('/:id/stats', ProjectController.getStats);

module.exports = router;