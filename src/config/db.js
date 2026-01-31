const{ Sequelize } = require ('sequelize');
require('dotenv').config();
let sequelize = null;

function getSequelize() {
  if (!sequelize) {
    sequelize = new Sequelize(
      process.env.DB_NAME,
      process.env.DB_USER,
      process.env.DB_PASS,
      {
        host: process.env.DB_HOST,
        dialect: 'mysql',
        logging: false,
      }
    );
  }
  return sequelize;
}

module.exports = getSequelize;