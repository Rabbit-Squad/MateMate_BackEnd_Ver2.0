const express = require('express');
const router = express.Router();
const statusCode = require('../modules/status');
const messageCode = require('../modules/message');
const User = require('../models/user.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

module.exports = {
    login : async (req, res) => {
        const {
            email, 
            pw
        } = req.body;

        if (!email || !pw) {
            return res.status(statusCode.BAD_REQUEST).send(messageCode.MISS_DATA)
        } // 필요한 데이터 누락
        
        const user = await User.login(email);
        if (user.length === 0) { // email 에러
            return res.status(statusCode.MATCH_ERR).send(messageCode.INVALID_USER);
        } else {
            const match = bcrypt.compare(pw, user[0][0].pw);
            if (!match) {
                return res.status(statusCode.MATCH_ERR).send(messageCode.INVALID_PW);
            }
        }

        return res.status(statusCode.SUCCESS).json({
            code: statusCode.SUCCESS,
            message: messageCode.SIGN_IN_SUCCESS,
            userIdx : user[0][0].id
        });  
    }
}