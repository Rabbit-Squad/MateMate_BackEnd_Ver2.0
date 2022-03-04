const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/login', userController.login);
router.post('/join', userController.join);
router.post('/profile/:userIdx', userController.showProfile);
module.exports = router;