const express = require('express');
const dotenv = require('dotenv');
const errorHandler = require('./src/middlewares/errorHandler');
const urlRoutes = require('./src/routes/urlRoutes');
const connectDB = require('./src/config/db');

//Load environment variables
dotenv.config();

//Initialise express app
const app =  express();

//Connect to the database
connectDB();

//Enable trust proxy to get the true client ip
app.set('trust proxy', true);

// Middlewares
app.use(express.json());

// Routes
app.use('/api', urlRoutes);

// Error handling middleware
app.use(errorHandler);

module.exports = app;
