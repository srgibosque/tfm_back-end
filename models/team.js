const Sequelize = require('sequelize');
const sequelize = require('../util/databse');

const Team = sequelize.define('team', {
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
  contact_email: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  location: {
    type: Sequelize.STRING,
    allowNull: false
  },
  userteamname: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  }
});

module.exports = Team;