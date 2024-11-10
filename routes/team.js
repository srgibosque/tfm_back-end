const express = require('express');

const teamController = require('../controllers/team')
const isAuth = require('../middleware/is-auth');
const router = express.Router();


router.post('/', isAuth, teamController.createTeam);
router.get('/player/:email', isAuth, teamController.getPlayerByEmail);
router.put('/:teamId', isAuth, teamController.updateTeam);
router.get('/:teamId', isAuth, teamController.getTeam);
router.delete('/:teamId', isAuth, teamController.deleteTeam);

module.exports = router;