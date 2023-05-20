const sequelize = require('../db')
const { DataTypes } = require('sequelize')

const people = sequelize.define('people', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  telegram_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  name: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  chat_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  phone: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  // createdAt: {
  //   type: DataTypes.DATE
  // },
  // updatedAt: {
  //   type: DataTypes.DATE
  // },
}, {
  timestamps: true,
})

people.sync()
// people.sync({ alter: true })

module.exports.People = people
