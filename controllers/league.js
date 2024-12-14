const Team = require('../models/team');
const League = require('../models/league');
const Match = require('../models/match');
const handleError = require('../util/error-handler');

exports.createLeague = async (req, res, next) => {
  const { name, location, teamIds } = req.body;
  try {
    const createdLeague = await League.create({
      name: name,
      location: location,
    });

    const teams = await Team.findAll({ where: { id: teamIds } });

    if (teams.length < 2) {
      const error = new Error('League should have at least two teams');
      error.statusCode = 400;
      throw error;
    }

    await createdLeague.addTeams(teams);

    const matches = [];
    for (let i = 0; i < teams.length; i++) {
      for (let j = i + 1; j < teams.length; j++) {
        const team1 = teams[i];
        const team2 = teams[j];

        // Create both a home and an away match for each team pair
        matches.push({
          homeTeamId: team1.id,
          awayTeamId: team2.id,
          leagueId: createdLeague.id,
          date: null,
          location: null,
          homeTeamGoals: null,
          awayTeamGoals: null
        });
        matches.push({
          homeTeamId: team2.id,
          awayTeamId: team1.id,
          leagueId: createdLeague.id,
          date: null,
          location: null,
          homeTeamGoals: null,
          awayTeamGoals: null
        });
      }
    }

    await Match.bulkCreate(matches);

    res.status(201).json({
      message: 'League created successfully',
      league: createdLeague,
      matches: matches
    });
  } catch (err) {
    handleError(err, next);
  }
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

exports.getLeague = async (req, res, next) => {
  const leagueId = req.params.leagueId;

  try {
    const league = await League.findByPk(leagueId, {
      include: [
        {
          model: Match,
          as: 'Matches',
          include: [
            { model: Team, as: 'HomeTeam', attributes: ['id', 'name'] },
            { model: Team, as: 'AwayTeam', attributes: ['id', 'name'] }
          ]
        },
        {
          model: Team,
          as: 'Teams',
          attributes: ['id', 'name', 'contact_email', 'location'],
          through: { attributes: [] }
        }
      ]
    });

    if (!league) {
      const error = new Error('League not found');
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({
      message: 'League retrieved successfully',
      league: league
    });

  } catch (err) {
    handleError(err, next);
  }
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

exports.getTable = async (req, res, next) => {
  const leagueId = req.params.leagueId;

  try {
    const matches = await Match.findAll({ where: { leagueId } });

    const pointsTable = {};

    matches.forEach(match => {
      const { homeTeamId, awayTeamId, homeTeamGoals, awayTeamGoals } = match;

      if (homeTeamGoals === null || awayTeamGoals === null) return;

      if (!pointsTable[homeTeamId]) pointsTable[homeTeamId] = 0;
      if (!pointsTable[awayTeamId]) pointsTable[awayTeamId] = 0;

      if (homeTeamGoals > awayTeamGoals) {
        pointsTable[homeTeamId] += 3; 
      } else if (homeTeamGoals < awayTeamGoals) {
        pointsTable[awayTeamId] += 3; 
      } else {
        pointsTable[homeTeamId] += 1;
        pointsTable[awayTeamId] += 1; 
      }
    });

    const leagueTable = Object.entries(pointsTable).map(([teamId, points]) => ({
      teamId: parseInt(teamId),
      points
    }));

    leagueTable.sort((a, b) => b.points - a.points);

    res.status(200).json({ table: leagueTable });

  } catch (err) {
    handleError(err, next);
  }
};