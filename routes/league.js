const express = require('express');

const leagueController = require('../controllers/league')
const isAuth = require('../middleware/is-auth');
const router = express.Router();

router.get('/:leagueId', isAuth, leagueController.getLeague);

module.exports = router;