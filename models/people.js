const sequelize = require('../db')
const { DataTypes } = require('sequelize')
const { CommonInformation } = require('./common_information')
const { Schedule } = require('./schedules')
const { Rating } = require('./rating')
const { Orders } = require('./orders')
const { Contracts } = require('./contracts')
const { Informations } = require('./informations')

const people = sequelize.define('people', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
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
}, {
  timestamps: true,
})

people.hasOne(CommonInformation)
people.hasMany(Schedule)
people.hasMany(Rating)
people.hasMany(Orders)
people.hasOne(Contracts)
people.hasMany(Informations)

people.sync({ alter: true })

module.exports.People = people
