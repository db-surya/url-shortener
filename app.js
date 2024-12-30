const express = require('express');
const session = require('express-session');
const dotenv = require('dotenv');
const errorHandler = require('./src/middlewares/errorHandler');
const urlRoutes = require('./src/routes/urlRoutes');
const connectDB = require('./src/config/db');
const passport = require('passport');

//Load environment variables
dotenv.config();

//require auth
require('./src/config/auth');

//Initialise express app
const app =  express();

//Initialise the sessions
app.use(session({ secret: process.env.SESSION_SECRET }))
app.use(passport.initialize());
app.use(passport.session());

//Connect to the database
connectDB();

//Enable trust proxy to get the true client ip
app.set('trust proxy', true);

// Middlewares
app.use(express.json());

// Routes
app.use('/', urlRoutes);

// Error handling middleware
app.use(errorHandler);

module.exports = app;
