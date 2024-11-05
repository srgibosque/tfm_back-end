const Sequelize = require('sequelize');
const sequelize = require('../util/databse');

const Match = sequelize.define('match', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  date: {
    type: Sequelize.DATE,
    allowNull: false
  },
  location: {
    type: Sequelize.STRING,
    allowNull: false
  },
  homeTeamGoals: {
    type: Sequelize.INTEGER,
    allowNull: true
  },
  awayTeamGoals: {
    type: Sequelize.INTEGER,
    allowNull: true
  },
  homeTeamId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'teams',
      key: 'id'
    }
  },
  awayTeamId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'teams',
      key: 'id'
    }
  },
  leagueId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'leagues',
      key: 'id'
    }
  }
});

module.exports = Match;
