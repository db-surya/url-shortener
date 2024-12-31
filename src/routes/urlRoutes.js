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

/**
 * @swagger
 * /auth/google:
 *   get:
 *     summary: Initiate Google Authentication
 *     description: Redirects the user to Google for authentication using OAuth2.
 *     tags:
 *       - Authentication
 *     responses:
 *       302:
 *         description: Redirects to Google for authentication.
 *       500:
 *         description: Server error.
 */
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

/**
 * @swagger
 * /api/shorten:
 *   post:
 *     summary: Shorten a URL
 *     description: Creates a shortened alias for the given long URL.
 *     tags:
 *       - URL Shortening
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               longUrl:
 *                 type: string
 *                 description: The long URL to be shortened.
 *                 example: https://example.com
 *     responses:
 *       200:
 *         description: URL shortened successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 alias:
 *                   type: string
 *                   description: The generated alias.
 *                   example: abc123
 *       400:
 *         description: Invalid request payload.
 */
router.post(
  '/api/shorten', 
  authUtils.isLoggedIn, 
  urlController.shortenUrlController);

/**
 * @swagger
 * /api/shorten/{alias}:
 *   get:
 *     summary: Redirect to the original URL
 *     description: Fetches the original URL for the given alias and redirects.
 *     tags:
 *       - URL Shortening
 *     parameters:
 *       - in: path
 *         name: alias
 *         required: true
 *         schema:
 *           type: string
 *         description: Alias for the shortened URL.
 *     responses:
 *       302:
 *         description: Redirects to the original URL.
 *       404:
 *         description: Alias not found.
 */
router.get(
  '/api/shorten/:alias', 
  authUtils.isLoggedIn, 
  urlController.redirectShortUrlController
);

/**
 * @swagger
 * /api/analytics/overall:
 *   get:
 *     summary: Get overall analytics
 *     description: Retrieves overall click and user analytics for all shortened URLs.
 *     tags:
 *       - Analytics
 *     responses:
 *       200:
 *         description: Analytics data retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalClicks:
 *                   type: integer
 *                   description: Total number of clicks.
 *                 uniqueUsers:
 *                   type: integer
 *                   description: Number of unique users.
 *       500:
 *         description: Server error.
 */
router.get(
  '/api/analytics/overall', 
  authUtils.isLoggedIn, 
  analyticsController.getOverallAnalyticsController
);

/**
 * @swagger
 * /api/analytics/topic/{topic}:
 *   get:
 *     summary: Get analytics by topic
 *     description: Retrieves analytics data for a specific topic.
 *     tags:
 *       - Analytics
 *     parameters:
 *       - in: path
 *         name: topic
 *         required: true
 *         schema:
 *           type: string
 *         description: Topic for which analytics data is requested.
 *     responses:
 *       200:
 *         description: Analytics data retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 topic:
 *                   type: string
 *                   description: Topic name.
 *                 clicks:
 *                   type: integer
 *                   description: Number of clicks for the topic.
 *       404:
 *         description: Topic not found.
 */
router.get(
  '/api/analytics/topic/:topic', 
  authUtils.isLoggedIn, 
  analyticsController.getAnalyticsByTopicController
);

/**
 * @swagger
 * /api/analytics/{alias}:
 *   get:
 *     summary: Get analytics by alias
 *     description: Retrieves analytics data for a specific alias.
 *     tags:
 *       - Analytics
 *     parameters:
 *       - in: path
 *         name: alias
 *         required: true
 *         schema:
 *           type: string
 *         description: Alias for which analytics data is requested.
 *     responses:
 *       200:
 *         description: Analytics data retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 alias:
 *                   type: string
 *                   description: Alias name.
 *                 clicks:
 *                   type: integer
 *                   description: Number of clicks for the alias.
 *       404:
 *         description: Alias not found.
 */
router.get(
  '/api/analytics/:alias', 
  authUtils.isLoggedIn, 
  analyticsController.getAnalyticsByAliasController
);

/**
 * @swagger
 * /logout:
 *   get:
 *     summary: Logout the user
 *     description: Logs out the user and clears the session.
 *     tags:
 *       - Authentication
 *     responses:
 *       200:
 *         description: User logged out successfully and redirected to the home page.
 *       500:
 *         description: Server error while logging out.
 */
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



 
