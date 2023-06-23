const sequelize = require('../db')
const { DataTypes, Deferrable } = require('sequelize')
const { People } = require('./people')

const contracts = sequelize.define('contracts', {
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
  speciality: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  start_date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  finish_date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  period: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  price: {
    type: DataTypes.TEXT,
    allowNull: false
  },
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

// contracts.sync({ alter: true })

module.exports.Contracts = contracts
