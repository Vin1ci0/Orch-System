const { Project, User, Budget } = require('../models');

module.exports = {
  // List all projects
  async index(req, res) {
    try {
      const projects = await Project.findAll({
        include: [
          { 
            model: User,
            through: { attributes: [] }
          },
          { 
            model: Budget
          }
        ]
      });
      return res.json(projects);
    } catch (err) {
      return res.status(400).json({ error: 'Error loading projects' });
    }
  },

  // Get single project
  async show(req, res) {
    try {
      const project = await Project.findByPk(req.params.id, {
        include: [
          { 
            model: User,
            through: { attributes: [] }
          },
          { 
            model: Budget
          }
        ]
      });

      if (!project) {
        return res.status(404).json({ error: 'Project not found' });
      }

      return res.json(project);
    } catch (err) {
      return res.status(400).json({ error: 'Error loading project' });
    }
  },

  // Create project
  async store(req, res) {
    try {
      const project = await Project.create(req.body);
      
      if (req.body.userIds) {
        await project.setUsers(req.body.userIds);
      }

      return res.json(project);
    } catch (err) {
      return res.status(400).json({ error: 'Project creation failed' });
    }
  },

  // Update project
  async update(req, res) {
    try {
      const project = await Project.findByPk(req.params.id);

      if (!project) {
        return res.status(404).json({ error: 'Project not found' });
      }

      await project.update(req.body);
      
      if (req.body.userIds) {
        await project.setUsers(req.body.userIds);
      }

      return res.json(project);
    } catch (err) {
      return res.status(400).json({ error: 'Project update failed' });
    }
  },

  // Delete project
  async destroy(req, res) {
    try {
      const project = await Project.findByPk(req.params.id);

      if (!project) {
        return res.status(404).json({ error: 'Project not found' });
      }

      await project.destroy();

      return res.send();
    } catch (err) {
      return res.status(400).json({ error: 'Project deletion failed' });
    }
  }
};