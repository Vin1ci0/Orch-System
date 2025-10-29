const express = require('express');
const EventController = require('../controllers/EventController');

const router = express.Router();

router.get('/', EventController.index);
router.get('/:id', EventController.show);
router.post('/', EventController.store);
router.put('/:id', EventController.update);
router.delete('/:id', EventController.destroy);

// Event attendees
router.post('/:id/attendees', EventController.addAttendee);
router.delete('/:id/attendees/:userId', EventController.removeAttendee);

module.exports = router;