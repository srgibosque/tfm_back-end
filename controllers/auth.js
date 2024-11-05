const User = require('../models/user');
const bcrypt = require('bcryptjs');
const { ValidationError } = require('sequelize');

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
      if (err instanceof ValidationError) {
        if (err.errors.some(error => error.path === 'email')) {
          return res.status(409).json({
            message: 'Email already in use. Please use a different email.'
          });
        }
      }
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};