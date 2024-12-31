const express = require('express');
const router = express.Router();
const urlController = require('../controllers/urlController');
const analyticsController = require('../controllers/analyticsController');
const passport = require('passport');
const authUtils = require('../utils/authUtils');
const path = require('path');

// Serve index.html with authentication status
router.get('/', (req, res) => {
  res.render('index', { isAuthenticated: req.isAuthenticated ? req.isAuthenticated() : false });
});

// Authenticate on clicking "Sign in with Google"
router.get(
  '/auth/google',
  passport.authenticate('google', { scope: ['email', 'profile'] })
);

// Success and failure redirects
router.get(
  '/auth/google/callback',
  passport.authenticate('google', {
    successRedirect: '/index',
    failureRedirect: '/auth/failure',
  })
);

// Success redirect to the home page
router.get('/index', authUtils.isLoggedIn, (req, res) => {
  res.sendFile(path.join(__dirname, '../../views/index.html'));
});

// Failure login
router.get('/auth/failure', (req, res) => {
  res.sendFile(path.join(__dirname, '../../views/home.html'));
});

// Route to serve the Shorten URL page
router.get('/shorten', authUtils.isLoggedIn, (req, res) => {
  res.sendFile(path.join(__dirname, '../../views/shorten.html'));
});


// Page for analytics
router.get('/analytics', authUtils.isLoggedIn, (req, res) => {
  res.sendFile(path.join(__dirname, '../../views/analytics.html'));
});

// API to shorten URL
router.post(
  '/api/shorten',
  authUtils.isLoggedIn,
  urlController.shortenUrlController
);

// API to get the shortened URL
router.get(
  '/api/shorten/:alias',
  authUtils.isLoggedIn,
  urlController.redirectShortUrlController
);

// API to get overall analytics
router.get(
  '/api/analytics/overall',
  authUtils.isLoggedIn,
  analyticsController.getOverallAnalyticsController
);

// API to get analytics by topic
router.get(
  '/api/analytics/topic/:topic',
  authUtils.isLoggedIn,
  analyticsController.getAnalyticsByTopicController
);

// API to get analytics by alias
router.get(
  '/api/analytics/:alias',
  authUtils.isLoggedIn,
  analyticsController.getAnalyticsByAliasController
);

// Logout route
router.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err); // Pass the error to the next middleware for handling
    }
    req.session.destroy((err) => {
      if (err) {
        return next(err); // Handle session destruction error
      }
      res.sendFile(path.join(__dirname, '../../views/home.html'));
    });
  });
});

module.exports = router;
