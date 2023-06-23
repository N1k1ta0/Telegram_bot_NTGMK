const sequelize = require('../db')
const { DataTypes, Deferrable } = require('sequelize')
const { People } = require('./people')

const schedules = sequelize.define('schedules', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  lesson_number: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  lesson: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  teacher: DataTypes.TEXT,
  room_number: DataTypes.INTEGER,
  personId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: People,
      key: 'id',
      deferrable: Deferrable.INITIALLY_IMMEDIATE
    }
  }
}, {
  timestamps: true,
})

// schedules.sync({ alter: true })

module.exports.Schedule = schedules
