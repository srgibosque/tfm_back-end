const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const handleError = require('../util/error-handler');
const duplicateUniqueValuesError = require('../util/duplicate-unique-values_error-handler');

exports.signup = (req, res, next) => {
  const email = req.body.email;
  const name = req.body.name;
  const gender = req.body.gender;
  const birthdate = req.body.birthdate;
  const password = req.body.password;
  bcrypt.hash(password, 12)
    .then((hashedPassword) => {
      return User.create({
        email: email,
        name: name,
        gender: gender,
        birthdate: birthdate,
        password: hashedPassword
      });
    })
    .then((result) => {
      res.status(201).json({
        message: 'User created successfully'
      })
    })
    .catch((err) => {
      if (duplicateUniqueValuesError(err, 'email', res, 'Email already in use, please use a different email')) {
        return;
      }
      handleError(err, next);
    });
};

exports.signin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  let loadedUser;

  User.findOne({ where: { email: email } })
    .then((user) => {
      // Check if the user exists in the DB
      if (!user) {
        const error = new Error('A user with this email could not be found.');
        error.status = 401;
        throw error;
      }
      loadedUser = user;
      //Compare the password extracted from the body with the hashed password
      return bcrypt.compare(password, user.password)
    })
    .then((isMatch) => {
      // Check if the password matches
      if (!isMatch) {
        const error = new Error('Incorrect password');
        error.status = 401;
        throw error;
      }
      //Generate JWT
      const token = jwt.sign({
        userId: loadedUser.id,
        email: loadedUser.email
      },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
      );
      // Return the token to the client
      res.status(200).json({
        token: token,
        userId: loadedUser.id,
      })
    })
    .catch((err) => handleError(err, next));
};