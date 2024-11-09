const User = require('../models/user');
const Team = require('../models/team');
const handleError = require('../util/error-handler');
const duplicateUniqueValuesError = require('../util/duplicate-unique-values_error-handler');

exports.createTeam = (req, res, next) => {
  const { name, contactEmail, location, userTeamName, userIds } = req.body;
  let createdTeam;

  Team.create({
    name: name,
    contact_email: contactEmail,
    location: location,
    userteamname: userTeamName
  })
    .then((team) => {
      createdTeam = team;
      return User.findAll({ where: { id: userIds } });
    })
    .then((users) => {
      if (!users || users.length === 0) {
        const error = new Error('No users found with the provided IDs');
        error.statusCode = 404;
        throw error;
      }
      return createdTeam.addUsers(users);
    })
    .then(() => {
      res.status(201).json({
        message: 'Team created successfully',
        team: createdTeam
      });
    })
    .catch((err) => {
      if (duplicateUniqueValuesError(err, 'userteamname', res, 'Team name already in use, please choose a different name')) {
        return;
      }
      handleError(err, next)
    });
}

exports.getPlayerByEmail = (req, res, next) => {

}

exports.updateTeam = (req, res, next) => {

}

exports.getTeam = (req, res, next) => {

}