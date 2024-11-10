const Team = require('../models/team');
const League = require('../models/league');
const Match = require('../models/match');
const handleError = require('../util/error-handler');
const duplicateUniqueValuesError = require('../util/duplicate-unique-values_error-handler');

exports.createLeague = async (req, res, next) => {

};

exports.getTeamByTeamname = async (req, res, next) => {

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