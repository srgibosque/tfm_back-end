const User = require('../models/user');
const Team = require('../models/team');
const handleError = require('../util/error-handler');
const duplicateUniqueValuesError = require('../util/duplicate-unique-values_error-handler');

exports.createTeam = async (req, res, next) => {
  const { name, contactEmail, location, userTeamName, userIds } = req.body;

  try {
    const createdTeam = await Team.create({
      name: name,
      contact_email: contactEmail,
      location: location,
      userteamname: userTeamName
    });

    const users = await User.findAll({ where: { id: userIds } });
    if (!users || users.length === 0) {
      const error = new Error('No users found with the provided IDs');
      error.statusCode = 404;
      throw error;
    }

    await createdTeam.addUsers(users);

    res.status(201).json({
      message: 'Team created successfully',
      team: createdTeam
    });

  } catch (err) {
    if (duplicateUniqueValuesError(err, 'userteamname', res, 'Team name already in use, please choose a different name')) {
      return;
    }
    handleError(err, next);
  }
};

exports.getPlayerByEmail = async (req, res, next) => {
  const userEmail = req.params.email;
  try {
    const user = await User.findOne({
      where: { email: userEmail },
      attributes: { exclude: ['password'] }
    })
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({
      message: 'User retrieved successfully',
      user: user
    });
  } catch (err) {
    handleError(err, next);
  }
}

exports.updateTeam = async (req, res, next) => {
  const teamId = req.params.teamId;
  const { name, contactEmail, location, userIds } = req.body;

  try {
    const team = await Team.findByPk(teamId);
    if (!team) {
      const error = new Error('Team not found');
      error.statusCode = 404;
      throw error;
    }
    const updatedTeam = await team.update({
      name: name,
      contact_email: contactEmail,
      location: location
    });
    const teamPlayers = await User.findAll({ where: { id: userIds } });
    await updatedTeam.setUsers(teamPlayers);

    res.status(200).json({
      message: 'Team updated successfully',
      team: updatedTeam
    });
  }
  catch (err) {
    handleError(err, next);
  }
}

exports.getTeam = async (req, res, next) => {
  const teamId = req.params.teamId;
  try {
    const team = await Team.findByPk(teamId, {
      include: [
        {
          model: User,
          as: 'Users',
          attributes: { exclude: ['password'] }
        }
      ]
    });
    if(!team){
      const error = new Error('Team not found');
      error.statusCode = 404;
      throw error;
    } 
    res.status(200).json({
      message: 'Team retrieved successfully',
      team: team
    });
  } catch (err) {
    handleError(err, next);
  }
}