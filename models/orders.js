const sequelize = require('../db')
const { DataTypes, Deferrable } = require('sequelize')
const { People } = require('./people')

const orders = sequelize.define('orders', {
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
  status: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  group: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  user_status: {
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

orders.sync({ alter: true })

module.exports.Orders = orders
