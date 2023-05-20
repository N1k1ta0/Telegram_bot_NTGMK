const { Sequelize } = require('sequelize')
require('dotenv').config()

module.exports = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER ?? 'postgres',
  process.env.DB_PASSWORD ?? '',
  {
    host: process.env.DB_HOST ?? 'localhost',
    port: process.env.DB_PORT ?? 5432,
    dialect: 'postgres',
    pool: {
      min: 0,
      max: 100,
      idle: 200000,
      acquire: 1000000,
    },
  }
)