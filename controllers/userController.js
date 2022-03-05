const express = require('express');
const router = express.Router();
const statusCode = require('../modules/status');
const messageCode = require('../modules/message');
const User = require('../models/user.js');
const bcrypt = require('bcrypt');
const jwt = require('../modules/jwt');
require('dotenv').config();
const defaultImg = process.env.DEFUALT_IMG;

module.exports = {
    login : async (req, res) => {
        const {
            email, 
            pw
        } = req.body;

        if (!email || !pw) {
            return res.status(statusCode.BAD_REQUEST).send(messageCode.MISS_DATA)
        } 
        
        const user = await User.login(email);
        if (user.length === 0) { // 없는 사용자
            return res.status(statusCode.MATCH_ERR).send(messageCode.INVALID_USER);
        } else {
            const match = bcrypt.compare(pw, user[0].pw); 
            if (!match) {
                return res.status(statusCode.MATCH_ERR).send(messageCode.INVALID_PW); // 비밀번호 오류
            }
        }

        const token = await jwt.signToken(email);
        return res.status(statusCode.SUCCESS).json({
            code: statusCode.SUCCESS,
            message: messageCode.SIGN_IN_SUCCESS,
            userIdx : user[0].id,
            accessToken : token
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
        } // 필요한 데이터 누락

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
       
    },

    showProfile : async (req, res) => {
        const userIdx = req.params.userIdx;
        const {
            token
        } = req.body;

        if (!userIdx || !token) {
            return res.status(statusCode.BAD_REQUEST).send(messageCode.MISS_DATA);
        }

        const result = await User.getProfile(userIdx);
       
        if (result[0].email !== await jwt.verifyToken(token)) {
            return res.status(statusCode.TOKEN_EXPIRED).send(messageCode.UNAUTHORIZED);
        }

        if (result === false) {
            return res.status(statusCode.NOT_FOUND).send(messageCode.INVALID_USER);
        } 
        else {
            if (result[0].profileImg === null) {
                result[0].profileImg = defaultImg;
            } // 프로필 이미지가 없는 경우 defaultImg 자동으로 넣음

            return res.status(statusCode.SUCCESS).json({
                code : statusCode.SUCCESS,
                result : result[0]
            })
        }
    }, 

    updateProfile : async (req, res) => {
        const userIdx = req.params.userIdx;
        const user = await(User.getProfile(userIdx));
        const {
            token,
            email,
            nickname,
            profileImg
        } = req.body;

        if (!userIdx || !token || !email || !nickname) {
            return res.status(statusCode.BAD_REQUEST).send(messageCode.MISS_DATA);
        } 

        if (!await User.checkEmail(email) || !await User.checkNickname(nickname)) {
            return res.status(statusCode.ALREADY_EXIST).send(messageCode.ALREADY_EXIST);
        } 

        if (!await User.getProfile(userIdx)) {
            return res.status(statusCode.NOT_FOUND).send(messageCode.INVALID_USER);
        } 
       
        if (user[0].email !== await jwt.verifyToken(token)) {
            return res.status(statusCode.TOKEN_EXPIRED).send(messageCode.UNAUTHORIZED);
        }

        const result = await User.updateProfile(userIdx, nickname, email, profileImg);
        if (result) {
            return res.status(statusCode.SUCCESS).send(messageCode.PROFILE_UPDATE_SUCCESS);
        } else {
            return res.status(statusCode.NOT_FOUND).send(messageCode.PROFILE_UPDATE_FAIL);
        }
    },

    deleteProfile : async (req, res) => {
        const userIdx = req.params.userIdx;
        const {
            token
        } = req.body;

        if (!userIdx || !token) {
            return res.status(statusCode.BAD_REQUEST).send(messageCode.MISS_DATA);
        } 

        const user = await User.getProfile(userIdx); // 있는 사용자인지 확인
        if (!user) {
            return res.status(statusCode.BAD_REQUEST).send(messageCode.INVALID_USER); // 없는 사용자인 경우
        } 
        else {
            if (user.email !== await jwt.verifyToken(token)) {
                return res.status(statusCode.TOKEN_EXPIRED).send(messageCode.UNAUTHORIZED); // 토큰이 잘못된 경우
            }
        }

        const result = await User.deleteProfile(userIdx); // 삭제 요청
        if (result) {
            return res.status(statusCode.SUCCESS).send(messageCode.DELETE_USER_SUCCESS);
        } else {
            return res.status(statusCode.NOT_FOUND).send(messageCode.DELETE_USER_FAIL);
        }
    }
}