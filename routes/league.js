const express = require('express');

const leagueController = require('../controllers/league')
const isAuth = require('../middleware/is-auth');
const router = express.Router();

router.post('/', isAuth, leagueController.createLeague);
router.get('/team/:teamName', isAuth, leagueController.getTeamByTeamname);
router.get('/:leagueId', isAuth, leagueController.getLeague);
router.delete('/:leagueId', isAuth, leagueController.deleteLeague);
router.get('/:leagueId/table',isAuth, leagueController.getTable);

module.exports = router;