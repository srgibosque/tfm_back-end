const Sequelize = require('sequelize');

const sequelize = require('../util/databse');

const User = sequelize.define('user', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false
  },
  gender: {
    type: Sequelize.ENUM('male', 'female'),
    allowNull: false
  },
  birthdate: {
    type: Sequelize.DATE,
    allowNull: true
  }
});

module.exports = User;