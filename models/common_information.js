const sequelize = require('../db')
const { DataTypes, Deferrable } = require('sequelize')
const { People } = require('./people')

const common_information = sequelize.define('common_information', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  group: DataTypes.TEXT,
  speciality: DataTypes.TEXT,
  department: DataTypes.TEXT,
  oganization: DataTypes.TEXT,
  form_education: DataTypes.TEXT,
  zachetka: DataTypes.INTEGER,
  student_id: DataTypes.INTEGER,
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

common_information.sync({ alter: true })

module.exports.CommonInformation = common_information
