const mysql = require('mysql2/promise');
const config = require('../config/config.json');

const database = {
    host: config.development.host,
    user: config.development.username,
    database: config.development.database,
    password: config.development.password,
    multipleStatements: true,
}

module.exports = mysql.createPool(database);