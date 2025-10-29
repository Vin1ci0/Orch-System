const { Task, User, Project } = require('../models');

module.exports = {
  // List tasks
  async index(req, res) {
    try {
      const where = {};
      if (req.query.projectId) {
        where.projectId = req.query.projectId;
      }

      const tasks = await Task.findAll({
        where,
        include: [
          { model: User, as: 'assignee' },
          { model: Project }
        ]
      });

      return res.json(tasks);
    } catch (err) {
      return res.status(400).json({ error: 'Error loading tasks' });
    }
  },

  // Get single task
  async show(req, res) {
    try {
      const task = await Task.findByPk(req.params.id, {
        include: [
          { model: User, as: 'assignee' },
          { model: Project }
        ]
      });

      if (!task) {
        return res.status(404).json({ error: 'Task not found' });
      }

      return res.json(task);
    } catch (err) {
      return res.status(400).json({ error: 'Error loading task' });
    }
  },

  // Create task
  async store(req, res) {
    try {
      const task = await Task.create(req.body);
      return res.json(task);
    } catch (err) {
      return res.status(400).json({ error: 'Task creation failed' });
    }
  },

  // Update task
  async update(req, res) {
    try {
      const task = await Task.findByPk(req.params.id);

      if (!task) {
        return res.status(404).json({ error: 'Task not found' });
      }

      await task.update(req.body);
      return res.json(task);
    } catch (err) {
      return res.status(400).json({ error: 'Task update failed' });
    }
  },

  // Delete task
  async destroy(req, res) {
    try {
      const task = await Task.findByPk(req.params.id);

      if (!task) {
        return res.status(404).json({ error: 'Task not found' });
      }

      await task.destroy();
      return res.send();
    } catch (err) {
      return res.status(400).json({ error: 'Task deletion failed' });
    }
  }
};