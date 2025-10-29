const express = require('express');
const TeamController = require('../controllers/TeamController');

const router = express.Router();

router.get('/', TeamController.index);
router.get('/:id', TeamController.show);
router.post('/', TeamController.store);
router.put('/:id', TeamController.update);
router.delete('/:id', TeamController.destroy);

// Team members
router.get('/:id/members', TeamController.listMembers);
router.post('/:id/members', TeamController.addMember);
router.delete('/:id/members/:userId', TeamController.removeMember);

module.exports = router;