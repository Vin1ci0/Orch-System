const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Board = sequelize.define('Board', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  }
});

const Card = sequelize.define('Card', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  position: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  listName: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'Todo'
  },
  dueDate: {
    type: DataTypes.DATE,
    allowNull: true
  }
});

module.exports = { Board, Card };