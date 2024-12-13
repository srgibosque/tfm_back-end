const Match = require('../models/match');
const handleError = require('../util/error-handler');

exports.getMatch = async (req, res, next) => {
  const matchId = req.params.matchId;

  try {
    const match = await Match.findByPk(matchId, {
      attributes: { exclude: ['createdAt', 'updatedAt'] }
    });
    
    res.status(200).json({
      message: 'Match retrieved successfully',
      match: match
    });

    if (!match) {
      const error = new Error('Match not found');
      error.statusCode = 404;
      throw error;
    }

  } catch (err) {
    handleError(err, next);
  }
};

exports.updateMatchInfo = async (req, res, next) => {
  const matchId = req.params.matchId;
  const { date, location, homeTeamGoals, awayTeamGoals } = req.body;
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