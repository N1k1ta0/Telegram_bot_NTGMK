// import { define } from './db.js'
// import { DataTypes } from 'sequelize'
const sequelize = require('./db')
const { DataTypes } = require('sequelize')

const people = sequelize.define('people', {
    id: {
        type: DataTypes.CHAR,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },

    name: {
        type: DataTypes.CHAR(200),
    },
    
    chat_id: {
        type: DataTypes.BIGINT,
    },
})

module.exports.people = people;
