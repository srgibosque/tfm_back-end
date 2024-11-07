const express = require('express');

const teamController = require('../controllers/team')
const isAuth = require('../middleware/is-auth');
const router = express.Router();

//This way only authenticated users can access the routes
// router.get('routeexample', isAuth, teamController.exampleFunction);