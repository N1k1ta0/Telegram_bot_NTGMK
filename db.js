const {Sequelize} = require('sequelize');

module.exports = new Sequelize(
    // 'postgres://grimksi:4QbYXDPrdy9k@ep-wispy-heart-761564.eu-central-1.aws.neon.tech/testdb?ssl=true',
    'DB_ntgmk',
    'postgres',
    '1',
    {
        host:'localhost',
        dialect: 'postgres',
    }
)
1