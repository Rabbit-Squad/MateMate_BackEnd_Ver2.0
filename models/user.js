const pool = require('../modules/connectionPool');
const bcrypt = require('bcrypt');

module.exports = {
    login : async (email) => {
        const sql = `SELECT * FROM User WHERE email="${email}"`;
        try {
            const result = await pool.queryParam(sql);
            return result;
        } catch (err) {
            throw err;
        }
    },
    checkNickname : async(nickname) => {
        const sql = `SELECT * From User WHERE User.nickname="${nickname}"`;
        try {
            const result = await pool.queryParam(sql);
            if (result[0].length === 0) {
                return true; // 중복 X
            } else {
                return false;
            }
        } catch (err) {
            throw err;
        }
    },
    checkEmail : async(email) => {
        const sql = `SELECT * From User WHERE email="${email}"`;
        try {
            const result = await pool.queryParam(sql);
            if (result[0].length === 0) {
                return true; // 사용가능한 이메일(중복 X)
            } 
            else {
                return false;
            }
        } catch (err) {
            throw err;
        }
    },
    join : async (nickname, email, pw) => {
        const sql = `INSERT INTO User (nickname, email, pw) VALUES ('${nickname}', '${email}','${pw}')`;
        try {
            const result = await pool.queryParam(sql);
            console.log(result);
            return true;
        } catch (err) {
            throw err;
        }
    },
    getProfile : async (userIdx) => {
        const sql = `SELECT email, profileImg, nickname FROM User WHERE User.id = ${userIdx}`;
        try {
            const result = await pool.queryParam(sql);
            if (result[0].length === 0) {
                return false;
            } 
            else {
                return result[0];
            }
        } catch (err) {
            throw err;
        }
    }, 
}