const { Event, User, Project } = require('../models');

module.exports = {
  // List events
  async index(req, res) {
    try {
      const where = {};
      
      // Filter by project if specified
      if (req.query.projectId) {
        where.projectId = req.query.projectId;
      }

      // Filter by date range if specified
      if (req.query.startDate && req.query.endDate) {
        where.startDate = {
          [Op.between]: [req.query.startDate, req.query.endDate]
        };
      }

      const events = await Event.findAll({
        where,
        include: [
          { 
            model: User,
            as: 'attendees',
            attributes: ['id', 'name', 'email']
          },
          {
            model: Project,
            attributes: ['id', 'name']
          }
        ],
        order: [['startDate', 'ASC']]
      });

      return res.json(events);
    } catch (err) {
      return res.status(400).json({ error: 'Error loading events' });
    }
  },

  // Get single event
  async show(req, res) {
    try {
      const event = await Event.findByPk(req.params.id, {
        include: [
          { 
            model: User,
            as: 'attendees',
            attributes: ['id', 'name', 'email']
          },
          {
            model: Project,
            attributes: ['id', 'name']
          }
        ]
      });

      if (!event) {
        return res.status(404).json({ error: 'Event not found' });
      }

      return res.json(event);
    } catch (err) {
      return res.status(400).json({ error: 'Error loading event' });
    }
  },

  // Create event
  async store(req, res) {
    try {
      const { attendeeIds, ...eventData } = req.body;
      
      const event = await Event.create(eventData);

      if (attendeeIds && attendeeIds.length > 0) {
        await event.setAttendees(attendeeIds);
      }

      // Reload event with attendees
      await event.reload({
        include: [
          { 
            model: User,
            as: 'attendees',
            attributes: ['id', 'name', 'email']
          }
        ]
      });

      return res.json(event);
    } catch (err) {
      return res.status(400).json({ error: 'Event creation failed' });
    }
  },

  // Update event
  async update(req, res) {
    try {
      const event = await Event.findByPk(req.params.id);

      if (!event) {
        return res.status(404).json({ error: 'Event not found' });
      }

      const { attendeeIds, ...eventData } = req.body;

      await event.update(eventData);

      if (attendeeIds) {
        await event.setAttendees(attendeeIds);
      }

      // Reload event with attendees
      await event.reload({
        include: [
          { 
            model: User,
            as: 'attendees',
            attributes: ['id', 'name', 'email']
          }
        ]
      });

      return res.json(event);
    } catch (err) {
      return res.status(400).json({ error: 'Event update failed' });
    }
  },

  // Delete event
  async destroy(req, res) {
    try {
      const event = await Event.findByPk(req.params.id);

      if (!event) {
        return res.status(404).json({ error: 'Event not found' });
      }

      await event.destroy();
      return res.send();
    } catch (err) {
      return res.status(400).json({ error: 'Event deletion failed' });
    }
  },

  // Add attendee
  async addAttendee(req, res) {
    try {
      const event = await Event.findByPk(req.params.id);
      
      if (!event) {
        return res.status(404).json({ error: 'Event not found' });
      }

      const { userId } = req.body;
      await event.addAttendee(userId);

      // Reload event with attendees
      await event.reload({
        include: [
          { 
            model: User,
            as: 'attendees',
            attributes: ['id', 'name', 'email']
          }
        ]
      });

      return res.json(event);
    } catch (err) {
      return res.status(400).json({ error: 'Failed to add attendee' });
    }
  },

  // Remove attendee
  async removeAttendee(req, res) {
    try {
      const event = await Event.findByPk(req.params.id);
      
      if (!event) {
        return res.status(404).json({ error: 'Event not found' });
      }

      const { userId } = req.params;
      await event.removeAttendee(userId);

      // Reload event with attendees
      await event.reload({
        include: [
          { 
            model: User,
            as: 'attendees',
            attributes: ['id', 'name', 'email']
          }
        ]
      });

      return res.json(event);
    } catch (err) {
      return res.status(400).json({ error: 'Failed to remove attendee' });
    }
  }
};