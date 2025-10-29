const { User } = require('../models');
const jwt = require('jsonwebtoken');

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'default_secret_change_this', {
    expiresIn: '1d'
  });
};

module.exports = {
  // Register new user
  async register(req, res) {
    try {
      const { email } = req.body;

      if (await User.findOne({ where: { email } })) {
        return res.status(400).json({ error: 'User already exists' });
      }

      const user = await User.create(req.body);
      user.password = undefined;

      return res.json({
        user,
        token: generateToken(user.id)
      });
    } catch (err) {
      return res.status(400).json({ error: 'Registration failed' });
    }
  },

  // Login user
  async login(req, res) {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ where: { email } });

      if (!user) {
        return res.status(400).json({ error: 'User not found' });
      }

      if (!await user.checkPassword(password)) {
        return res.status(400).json({ error: 'Invalid password' });
      }

      user.password = undefined;

      return res.json({
        user,
        token: generateToken(user.id)
      });
    } catch (err) {
      return res.status(400).json({ error: 'Login failed' });
    }
  },

  // Get authenticated user
  async getMe(req, res) {
    try {
      const user = await User.findByPk(req.userId, {
        attributes: { exclude: ['password'] }
      });

      return res.json(user);
    } catch (err) {
      return res.status(400).json({ error: 'Error getting user data' });
    }
  }
};