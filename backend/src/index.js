require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { sequelize } = require('./models');

const authRoutes = require('./routes/auth');
const projectsRoutes = require('./routes/projects');
const tasksRoutes = require('./routes/tasks');
const teamsRoutes = require('./routes/teams');
const eventsRoutes = require('./routes/events');
const kanbanRoutes = require('./routes/kanban');
const filesRoutes = require('./routes/files');
const budgetsRoutes = require('./routes/budgets');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// static uploads
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectsRoutes);
app.use('/api/tasks', tasksRoutes);
app.use('/api/teams', teamsRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/kanban', kanbanRoutes);
app.use('/api/files', filesRoutes);
app.use('/api/budgets', budgetsRoutes);

const PORT = process.env.PORT || 4000;

async function start() {
  try {
    await sequelize.sync({ alter: true });
    console.log('Database synced');
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
  } catch (err) {
    console.error('Failed to start server', err);
  }
}

start();
