const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/login', userController.login);
router.post('/join', userController.join);
router.post('/profile/:userIdx', userController.showProfile);
router.put('/profile/update/:userIdx', userController.updateProfile);
router.delete('/profile/delete/:userIdx', userController.deleteProfile);
module.exports = router;