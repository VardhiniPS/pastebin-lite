const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Paste = sequelize.define('Paste', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  ttl_seconds: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  max_views: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  views: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: Sequelize.NOW,
  },
}, {
  tableName: 'pastes',
  timestamps: false,
});

module.exports = Paste;
