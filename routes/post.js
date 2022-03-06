const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');

router.get('/list', postController.getAllPosts);
router.get('/list/:userIdx', postController.getMyPosts);
module.exports = router;