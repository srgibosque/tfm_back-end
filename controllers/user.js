const User = require('../models/user');
const Team = require('../models/team');
const League = require('../models/league');
const Match = require('../models/match');
const handleError = require('../util/error-handler');
const Sequelize = require('sequelize');
const { Op } = require('sequelize');

exports.getProfile = async (req, res, next) => {
  const userId = req.userId;
  try {
    const user = await User.findByPk(userId, {
      attributes: { exclude: ['password'] },
      include: [
        {
          model: Team,
          as: 'Teams',
          through: { attributes: [] },
          include: [
            {
              model: League,
              as: 'Leagues',
              through: { attributes: [] },
              include: [
                {
                  model: Match,
                  as: 'Matches',
                  where: {
                    [Op.or]: [
                      { homeTeamId: Sequelize.col('Teams.id') },
                      { awayTeamId: Sequelize.col('Teams.id') }
                    ]
                  },
                  required: false,
                }
              ]
            }
          ]
        }
      ]
    });

    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }

    const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
      gender: user.gender,
      birthdate: user.birthdate,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }
    let teams = [];
    let leagues = [];
    const leagueIds = new Set();
    let matches = [];

    user.Teams.forEach(team => {
      teams.push({
        id: team.id,
        name: team.name,
        contactEmail: team.contact_email,
        location: team.location,
        userteamname: team.userteamname,
      });

      team.Leagues.forEach(league => {
        if (leagueIds.has(league.id)) {
          return;
        }
        leagueIds.add(league.id);
        leagues.push({
          id: league.id,
          name: league.name,
          location: league.location,
          createdAt: league.createdAt,
          updatedAt: league.updatedAt
        });

        league.Matches.forEach(match => {
          matches.push({
            id: match.id,
            date: match.date,
            location: match.location,
            homeTeamGoals: match.homeTeamGoals,
            awayTeamGoals: match.awayTeamGoals,
            homeTeamId: match.homeTeamId,
            awayTeamId: match.awayTeamId,
            leagueId: match.leagueId,
            createdAt: match.createdAt,
            updatedAt: match.updatedAt
          });
        });
      });
    });

    const transformedUser = {
      userData: userData,
      teams: teams,
      leagues: leagues,
      matches: matches
    };

    res.status(200).json({ user: transformedUser });

  } catch (err) {
    handleError(err, next);
  }
};

exports.updateProfile = async (req, res, next) => {
  const userId = req.userId;
  const { name, email, gender, birthdate } = req.body;

  try {
    const user = await User.findByPk(userId, {
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }

    const updatedUser = await user.update({
      name: name,
      email: email,
      gender: gender,
      birthdate: birthdate
    });

    res.status(200).json({
      message: 'User updated successfully',
      user: updatedUser
    });

  } catch (err) {
    handleError(err, next);
  }
};
