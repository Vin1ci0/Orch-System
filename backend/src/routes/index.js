const express = require('express');
const authMiddleware = require('../middleware/auth');

// Import route modules
const authRoutes = require('./auth');
const projectRoutes = require('./projects');
const taskRoutes = require('./tasks');
const teamRoutes = require('./teams');
const eventRoutes = require('./events');
const kanbanRoutes = require('./kanban');
const fileRoutes = require('./files');
const budgetRoutes = require('./budgets');

const router = express.Router();

// Public routes
router.use('/auth', authRoutes);

// Protected routes
router.use(authMiddleware);
router.use('/projects', projectRoutes);
router.use('/tasks', taskRoutes);
router.use('/teams', teamRoutes);
router.use('/events', eventRoutes);
router.use('/kanban', kanbanRoutes);
router.use('/files', fileRoutes);
router.use('/budgets', budgetRoutes);

module.exports = router;