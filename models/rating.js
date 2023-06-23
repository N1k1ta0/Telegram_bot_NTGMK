const sequelize = require('../db')
const { DataTypes, Deferrable } = require('sequelize')
const { People } = require('./people')

const rating = sequelize.define('ratings', {
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
  name: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  type: DataTypes.TEXT,
  status: {
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

// rating.sync({ alter: true })

module.exports.Rating = rating
