const express = require('express');
const BudgetController = require('../controllers/BudgetController');

const router = express.Router();

router.get('/', BudgetController.index);
router.get('/:id', BudgetController.show);
router.post('/', BudgetController.store);
router.put('/:id', BudgetController.update);
router.delete('/:id', BudgetController.destroy);

// Budget operations
router.get('/summary', BudgetController.summary);
router.post('/:id/expenses', BudgetController.recordExpense);

module.exports = router;