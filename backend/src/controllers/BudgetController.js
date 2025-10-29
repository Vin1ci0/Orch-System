const { Budget, Transaction, Project } = require('../models');

module.exports = {
  // List budgets
  async index(req, res) {
    try {
      const where = {};
      if (req.query.projectId) {
        where.projectId = req.query.projectId;
      }

      const budgets = await Budget.findAll({
        where,
        include: [
          { model: Transaction },
          { model: Project }
        ]
      });

      return res.json(budgets);
    } catch (err) {
      return res.status(400).json({ error: 'Error loading budgets' });
    }
  },

  // Get single budget
  async show(req, res) {
    try {
      const budget = await Budget.findByPk(req.params.id, {
        include: [
          { model: Transaction },
          { model: Project }
        ]
      });

      if (!budget) {
        return res.status(404).json({ error: 'Budget not found' });
      }

      return res.json(budget);
    } catch (err) {
      return res.status(400).json({ error: 'Error loading budget' });
    }
  },

  // Create budget
  async store(req, res) {
    try {
      const budget = await Budget.create(req.body);
      return res.json(budget);
    } catch (err) {
      return res.status(400).json({ error: 'Budget creation failed' });
    }
  },

  // Update budget
  async update(req, res) {
    try {
      const budget = await Budget.findByPk(req.params.id);

      if (!budget) {
        return res.status(404).json({ error: 'Budget not found' });
      }

      await budget.update(req.body);
      return res.json(budget);
    } catch (err) {
      return res.status(400).json({ error: 'Budget update failed' });
    }
  },

  // Add transaction
  async addTransaction(req, res) {
    try {
      const budget = await Budget.findByPk(req.params.budgetId);

      if (!budget) {
        return res.status(404).json({ error: 'Budget not found' });
      }

      const transaction = await Transaction.create({
        ...req.body,
        budgetId: budget.id
      });

      // Update spent amount
      const amount = req.body.type === 'expense' ? req.body.amount : -req.body.amount;
      await budget.update({
        spentAmount: parseFloat(budget.spentAmount) + parseFloat(amount)
      });

      return res.json(transaction);
    } catch (err) {
      return res.status(400).json({ error: 'Transaction creation failed' });
    }
  },

  // Get budget report
  async getReport(req, res) {
    try {
      const budget = await Budget.findByPk(req.params.id, {
        include: [{ model: Transaction }]
      });

      if (!budget) {
        return res.status(404).json({ error: 'Budget not found' });
      }

      const totalExpenses = budget.Transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);

      const totalIncome = budget.Transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);

      const report = {
        totalBudget: parseFloat(budget.totalAmount),
        totalExpenses,
        totalIncome,
        remaining: parseFloat(budget.totalAmount) - totalExpenses + totalIncome,
        transactions: budget.Transactions
      };

      return res.json(report);
    } catch (err) {
      return res.status(400).json({ error: 'Error generating budget report' });
    }
  }
};