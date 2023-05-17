const sequelize = require('./db')
const {DataTypes} = require('sequelize')


const people = sequelize.define('people',
{
    name:{
        type: DataTypes.CHAR(200),
    },
    
    nomber:{
        type: DataTypes.CHAR,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },

    chat_id:{
        type: DataTypes.BIGINT,
        
    },
}
)
module.exports.people = people;

