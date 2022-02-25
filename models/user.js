const pool = require('../modules/connectionPool');
const bcrypt = require('bcrypt');

module.exports = {
    login : async (email) => {
        const sql = `SELECT * FROM User WHERE email="${email}"`;
        try {
            const result = pool.queryParam(sql);
            return result;
        } catch (err) {
            throw err;
        }
    }
}