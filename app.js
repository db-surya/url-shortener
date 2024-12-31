const express = require('express');
const session = require('express-session');
const dotenv = require('dotenv');
const errorHandler = require('./src/middlewares/errorHandler');
const urlRoutes = require('./src/routes/urlRoutes');
const connectDB = require('./src/config/db');
const passport = require('passport');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./public/swagger/swaggerDefinition');

//Load environment variables
dotenv.config();

//require auth
require('./src/config/auth');

//Initialise express app
const app =  express();

//Connect to the database
connectDB();

//Enable trust proxy to get the true client ip
app.set('trust proxy', true);

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));


//Initialise the sessions
app.use(session({ secret: process.env.SESSION_SECRET }))
app.use(passport.initialize());
app.use(passport.session());

// Middleware to check authentication and pass it to the views
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated ? req.isAuthenticated() : false;
  next();
});

//Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use('/', urlRoutes);

// Error handling middleware
app.use(errorHandler);

module.exports = app;
