const User = require('../models/user');
const Team = require('../models/team');
const League = require('../models/league');
const handleError = require('../util/error-handler');

exports.getProfile = async (req, res, next) => {
  // Try to map the retrieved object and include matches
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
              through: { attributes: [] }
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

    res.status(200).json({ user });

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
