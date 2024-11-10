const Team = require('../models/team');
const League = require('../models/league');
const Match = require('../models/match');
const handleError = require('../util/error-handler');
const duplicateUniqueValuesError = require('../util/duplicate-unique-values_error-handler');

exports.createLeague = async (req, res, next) => {

};

exports.getTeamByTeamname = async (req, res, next) => {
  const teamName = req.params.teamName;
  try {
    const team = await Team.findOne({ where: { userteamname: teamName } });
    if (!team) {
      const error = new Error('Team not found');
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({ 
      message: 'Team successfully loaded to league',
      team: team
    });
  } catch (err) {
    handleError(err, next);
  }
};

exports.updateLeague = async (req, res, next) => {

};

exports.getLeague = async (req, res, next) => {

};

exports.deleteLeague = async (req, res, next) => {
  const leagueId = req.params.leagueId;
  try {
    const league = await League.findByPk(leagueId);

    if (!league) {
      const error = new Error('League not found');
      error.statusCode = 404;
      throw error;
    }

    await league.destroy();

    res.status(200).json({
      message: 'League deleted successfully'
    });
  } catch (err) {
    handleError(err, next);
  }
};