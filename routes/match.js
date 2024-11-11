const express = require('express');

const matchController = require('../controllers/match')
const isAuth = require('../middleware/is-auth');
const router = express.Router();

router.get('/', isAuth, matchController.getMatchesByUserId);
router.put('/', isAuth, matchController.updateMatchInfo);

module.exports = router;