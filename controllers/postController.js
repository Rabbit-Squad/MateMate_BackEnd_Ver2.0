const express = require('express');
const router = express.Router();
const statusCode = require('../modules/status');
const messageCode = require('../modules/message');
const User = require('../models/user.js');
const Post = require('../models/post');
require('dotenv').config();

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
    },
    writePost : async (req, res) => {
        const {
            userIdx,
            deadline, 
            location, 
            min_num, 
            title, 
            content
        } = req.body;

        if (!userIdx || !deadline || !location || !min_num || !title || !content) {
            return res.status(statusCode.BAD_REQUEST).send(messageCode.MISS_DATA);
        }

        if (!await User.getProfile(userIdx)) {
            return res.status(statusCode.NOT_FOUND).send(messageCode.INVALID_USER);
        }

        const currentDate = new Date();
        const deadlineDate = new Date(deadline);
        const between = Math.floor((deadlineDate.getTime() - currentDate.getTime()) / 1000 / 60);

        if (between < 5 || between > 60) {
            return res.status(statusCode.BAD_REQUEST).send(messageCode.INVALID_DATE);
        } // 글 작성 시점보다 5분 이내거나 60분 넘어가는 시간은 무효화. 

        const result = await Post.writePost(userIdx, deadline, location, min_num, title, content);
        if (result) {
            return res.status(statusCode.SUCCESS).send(messageCode.POST_SUCCESS)
        } else {
            return res.status(statusCode.INTERNAL_SERVER_ERROR).send(messageCode.POST_FAIL);
        }
    }
}