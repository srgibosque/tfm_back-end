const express = require('express');

const userController = require('../controllers/user.js')
const isAuth = require('../middleware/is-auth');
const router = express.Router();

router.get('/profile', isAuth, userController.getProfile);
router.put('/profile', isAuth, userController.updateProfile);

module.exports = router;