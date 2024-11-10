//IMPORTS
const http = require('http');
const express = require('express');
require('dotenv').config();
const bodyParser = require('body-parser');
const sequelize = require('./util/databse');

//MODELS
const User = require('./models/user');
const Team = require('./models/team');
const League = require('./models/league');
const Match = require('./models/match');

//ROUTES
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const teamRoutes = require('./routes/team');
const leagueRoutes = require('./routes/league');

const app = express();

// Middleware that parses JSON data from the client
app.use(bodyParser.json()); // application/json

// We need to set the following headers to allow the communication between to diferent ports
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// ROUTES middleware
app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/team', teamRoutes);
app.use('/league', leagueRoutes);

// Middleware error. Executes every time an error is thrown
app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

//DATA RELATION
User.belongsToMany(Team, { through: 'UserTeams', as: 'Teams' });
Team.belongsToMany(User, { through: 'UserTeams', as: 'Users' });

Team.belongsToMany(League, { through: 'TeamLeagues' });
League.belongsToMany(Team, { through: 'TeamLeagues' });

League.hasMany(Match, { foreignKey: 'leagueId' });
Match.belongsTo(League, { foreignKey: 'leagueId' });

// Team participates in many matches as either home or away team
Team.hasMany(Match, { foreignKey: 'homeTeamId', as: 'HomeMatches' });
Team.hasMany(Match, { foreignKey: 'awayTeamId', as: 'AwayMatches' });

// Each match has two teams (home and away), both belonging to the same league
Match.belongsTo(Team, { foreignKey: 'homeTeamId', as: 'HomeTeam' });
Match.belongsTo(Team, { foreignKey: 'awayTeamId', as: 'AwayTeam' });

//Creates tables for your models
sequelize
  .sync({ alter: true })
  .then(result => {
    console.log("Connected");
    app.listen(8080);
  })
  .catch(err => {
    console.error(err)
  });



