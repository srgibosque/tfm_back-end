const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./util/databse');
const User = require('./models/user');

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

// Middleware error. Executes every time an error is thrown
app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

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



