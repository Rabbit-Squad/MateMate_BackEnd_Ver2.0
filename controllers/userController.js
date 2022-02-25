const express = require('express');
const router = express.Router();
const statusCode = require('../modules/status');
const messageCode = require('../modules/message');
const User = require('../models/user.js');
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
    },

    join : async (req, res) => {
        const {
            nickname,
            email, 
            pw
        } = req.body;
        
        if (!nickname || !email || !pw) {
            return res.status(statusCode.BAD_REQUEST).send(messageCode.MISS_DATA);
        } // 정보 누락

        if (!await User.checkEmail(email) || !await User.checkNickname(nickname)) {
            return res.status(statusCode.ALREADY_EXIST).send(messageCode.ALREADY_EXIST);
        } // 이미 존재하는 닉네임이나 이메일인 경우
        
        const hashedPw = await bcrypt.hash(pw, 12);
        const user = await User.join(nickname, email, hashedPw);
        if (user) {
            return res.status(statusCode.SUCCESS).json({
                code: statusCode.SUCCESS,
                message: messageCode.SIGN_UP_SUCCESS,
            }); 
        } else {
            return res.status(statusCode.INTERNAL_SERVER_ERROR).send(messageCode.INTERNAL_SERVER_ERROR);
        }
       
    }
}