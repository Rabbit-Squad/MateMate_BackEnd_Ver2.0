const express = require('express');
const router = express.Router();
const statusCode = require('../modules/status');
const messageCode = require('../modules/message');
const User = require('../models/user.js');
const Post = require('../models/post');
const bcrypt = require('bcrypt');
const jwt = require('../modules/jwt');
require('dotenv').config();
const defaultImg = process.env.DEFUALT_IMG;

module.exports = {
    getAllPosts : async (req, res) => {
        const result = await Post.getAllPosts();
        if (result) {
            return res.status(statusCode.SUCCESS).json({
                code : statusCode.SUCCESS,
                message : messageCode.LIST_SUCCESS,
                result : result[0]
            })
        } else {
            return res.status(statusCode.INTERNAL_SERVER_ERROR).send(messageCode.LIST_FAIL);
        }
    },
    getMyPosts : async (req, res) => {
        const userIdx = req.params.userIdx;
        if (!userIdx) {
            return res.status(statusCode.BAD_REQUEST).send(messageCode.MISS_DATA);
        }

        const user = await(User.getProfile(userIdx)); 
        if (!user) {
            return res.status(statusCode.NOT_FOUND).send(messageCode.INVALID_USER);
        } 
        
        const result = await Post.getMyPosts(userIdx);
        if (result) {
            return res.status(statusCode.SUCCESS).json({
                code : statusCode.SUCCESS,
                message : messageCode.LIST_SUCCESS,
                result : result[0]
            })
        } else {
            return res.status(statusCode.INTERNAL_SERVER_ERROR).send(messageCode.LIST_FAIL);
        }
    }
}