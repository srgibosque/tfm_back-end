const User = require('../models/user');
const handleError = require('../util/error-handler');

exports.getProfile = (req, res, next) => {
  const userId = req.userId;
  User.findByPk(userId)
    .then((user) => {
      if (!user) {
        const error = new Error('User not found');
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json({ user });
    })
    .catch((err) => handleError(err, next));
};

exports.updateProfile = (req, res, next) => {
  const userId = req.userId;
  const name = req.body.name;
  const email = req.body.email;
  const gender = req.body.gender;
  const birthdate = req.body.birthdate;

  User.findByPk(userId)
    .then((user) => {
      if (!user) {
        const error = new Error('User not found');
        error.statusCode = 404;
        throw error;
      }
      return user.update({
        name: name,
        email: email,
        gender: gender,
        birthdate: birthdate
      });
    })
    .then((updatedUser) => {
      res.status(200).json({
        message: 'User updated successfully',
        user: updatedUser
      });
    })
    .catch((err) => handleError(err, next));
};
