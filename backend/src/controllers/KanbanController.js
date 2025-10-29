const { Board, Card } = require('../models');

module.exports = {
  // List boards
  async index(req, res) {
    try {
      const where = {};
      if (req.query.projectId) {
        where.projectId = req.query.projectId;
      }

      const boards = await Board.findAll({
        where,
        include: [{ model: Card }]
      });

      return res.json(boards);
    } catch (err) {
      return res.status(400).json({ error: 'Error loading boards' });
    }
  },

  // Get single board
  async show(req, res) {
    try {
      const board = await Board.findByPk(req.params.id, {
        include: [{ 
          model: Card,
          order: [['position', 'ASC']]
        }]
      });

      if (!board) {
        return res.status(404).json({ error: 'Board not found' });
      }

      return res.json(board);
    } catch (err) {
      return res.status(400).json({ error: 'Error loading board' });
    }
  },

  // Create board
  async store(req, res) {
    try {
      const board = await Board.create(req.body);
      return res.json(board);
    } catch (err) {
      return res.status(400).json({ error: 'Board creation failed' });
    }
  },

  // Add card
  async addCard(req, res) {
    try {
      const board = await Board.findByPk(req.params.boardId);

      if (!board) {
        return res.status(404).json({ error: 'Board not found' });
      }

      // Get max position
      const maxPosition = await Card.max('position', {
        where: { boardId: board.id }
      }) || 0;

      const card = await Card.create({
        ...req.body,
        boardId: board.id,
        position: maxPosition + 1
      });

      return res.json(card);
    } catch (err) {
      return res.status(400).json({ error: 'Card creation failed' });
    }
  },

  // Update card
  async updateCard(req, res) {
    try {
      const card = await Card.findByPk(req.params.cardId);

      if (!card) {
        return res.status(404).json({ error: 'Card not found' });
      }

      await card.update(req.body);
      return res.json(card);
    } catch (err) {
      return res.status(400).json({ error: 'Card update failed' });
    }
  },

  // Move card
  async moveCard(req, res) {
    try {
      const { cardId } = req.params;
      const { listName, position } = req.body;

      const card = await Card.findByPk(cardId);
      if (!card) {
        return res.status(404).json({ error: 'Card not found' });
      }

      // Update positions of other cards
      if (position !== undefined) {
        await Card.increment('position', {
          where: {
            boardId: card.boardId,
            position: { [Op.gte]: position },
            id: { [Op.ne]: cardId }
          }
        });
      }

      await card.update({
        listName,
        position: position || card.position
      });

      return res.json(card);
    } catch (err) {
      return res.status(400).json({ error: 'Failed to move card' });
    }
  },

  // Delete card
  async deleteCard(req, res) {
    try {
      const card = await Card.findByPk(req.params.cardId);

      if (!card) {
        return res.status(404).json({ error: 'Card not found' });
      }

      await card.destroy();
      return res.send();
    } catch (err) {
      return res.status(400).json({ error: 'Card deletion failed' });
    }
  }
};