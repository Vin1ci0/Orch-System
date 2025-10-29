const { Team, TeamMember, User } = require('../models');

module.exports = {
  // List teams
  async index(req, res) {
    try {
      const teams = await Team.findAll({
        include: [{
          model: User,
          through: { attributes: ['role'] }
        }]
      });
      return res.json(teams);
    } catch (err) {
      return res.status(400).json({ error: 'Error loading teams' });
    }
  },

  // Get single team
  async show(req, res) {
    try {
      const team = await Team.findByPk(req.params.id, {
        include: [{
          model: User,
          through: { attributes: ['role'] }
        }]
      });

      if (!team) {
        return res.status(404).json({ error: 'Team not found' });
      }

      return res.json(team);
    } catch (err) {
      return res.status(400).json({ error: 'Error loading team' });
    }
  },

  // Create team
  async store(req, res) {
    try {
      const { name, description, members } = req.body;
      
      const team = await Team.create({ name, description });
      
      if (members && members.length > 0) {
        const memberPromises = members.map(member => 
          TeamMember.create({
            teamId: team.id,
            userId: member.userId,
            role: member.role || 'member'
          })
        );
        
        await Promise.all(memberPromises);
      }

      const fullTeam = await Team.findByPk(team.id, {
        include: [{
          model: User,
          through: { attributes: ['role'] }
        }]
      });

      return res.json(fullTeam);
    } catch (err) {
      return res.status(400).json({ error: 'Team creation failed' });
    }
  },

  // Update team
  async update(req, res) {
    try {
      const { name, description, members } = req.body;
      const team = await Team.findByPk(req.params.id);

      if (!team) {
        return res.status(404).json({ error: 'Team not found' });
      }

      await team.update({ name, description });

      if (members) {
        await TeamMember.destroy({ where: { teamId: team.id } });
        
        const memberPromises = members.map(member => 
          TeamMember.create({
            teamId: team.id,
            userId: member.userId,
            role: member.role || 'member'
          })
        );
        
        await Promise.all(memberPromises);
      }

      const updatedTeam = await Team.findByPk(team.id, {
        include: [{
          model: User,
          through: { attributes: ['role'] }
        }]
      });

      return res.json(updatedTeam);
    } catch (err) {
      return res.status(400).json({ error: 'Team update failed' });
    }
  },

  // Delete team
  async destroy(req, res) {
    try {
      const team = await Team.findByPk(req.params.id);

      if (!team) {
        return res.status(404).json({ error: 'Team not found' });
      }

      await team.destroy();
      return res.send();
    } catch (err) {
      return res.status(400).json({ error: 'Team deletion failed' });
    }
  },

  // Add member to team
  async addMember(req, res) {
    try {
      const { userId, role } = req.body;
      const { teamId } = req.params;

      const member = await TeamMember.create({
        teamId,
        userId,
        role: role || 'member'
      });

      return res.json(member);
    } catch (err) {
      return res.status(400).json({ error: 'Error adding team member' });
    }
  },

  // Remove member from team
  async removeMember(req, res) {
    try {
      const { teamId, userId } = req.params;

      await TeamMember.destroy({
        where: {
          teamId,
          userId
        }
      });

      return res.send();
    } catch (err) {
      return res.status(400).json({ error: 'Error removing team member' });
    }
  }
};