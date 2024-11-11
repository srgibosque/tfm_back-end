const Match = require('../models/match');
const handleError = require('../util/error-handler');
const duplicateUniqueValuesError = require('../util/duplicate-unique-values_error-handler');

exports.getMatchesByUserId = async (req, res, next) => {

};

exports.updateMatchInfo = async (req, res, next) => {
  const matchId = req.params.matchId;
  const {date, location, homeTeamGoals, awayTeamGoals} = req.body;
  try {
    const match = await Match.findByPk(matchId);
    if (!match) {
      throw new Error('Match not found');
    }

    const updatedMatch = await match.update({
      date: date,
      location: location,
      homeTeamGoals: homeTeamGoals,
      awayTeamGoals: awayTeamGoals
    });

    res.status(200).json({
      message: 'Match updated successfully',
      match: updatedMatch
    });

  } catch (err) {
    handleError(err, next);
  }
};