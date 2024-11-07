const express = require('express');

const authController = require('../controllers/auth')
const router = express.Router();

router.put('/signup', authController.signup);
router.post('/signin', authController.signin);

module.exports = router;