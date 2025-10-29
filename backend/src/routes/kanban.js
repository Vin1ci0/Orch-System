const express = require('express');
const KanbanController = require('../controllers/KanbanController');

const router = express.Router();

// Board routes
router.get('/boards', KanbanController.index);
router.get('/boards/:id', KanbanController.show);
router.post('/boards', KanbanController.store);

// Card routes
router.post('/boards/:boardId/cards', KanbanController.addCard);
router.put('/cards/:cardId', KanbanController.updateCard);
router.put('/cards/:cardId/move', KanbanController.moveCard);
router.delete('/cards/:cardId', KanbanController.deleteCard);

module.exports = router;