const express = require('express');
const router = express.Router();
const urlController = require('../controllers/urlController');
const analyticsController = require('../controllers/analyticsController')
const passport = require('passport');
const authUtils = require('../utils/authUtils');


//Health check api to check connection
router.get('/',(req,res)=>{
  res.send('<a href="/auth/google">Authenticate with Google</a>');
})

//Authenticate on clicking sign in with google
router.get('/auth/google',
  passport.authenticate('google',{scope:['email','profile']})
);

//Success and failure redirects
router.get('/auth/google/callback',
  passport.authenticate('google',{
    successRedirect:'/index',
    failureRedirect:'/auth/failure'
  })
);

//Success redirect home page
router.get('/index', (req,res)=>{
  console.log('The user displayed here',req.user);
  res.send('Welcome to home page');
});

//Failure login
router.get('/auth/failure',(req,res)=>{
  res.send('Something went wrong');
})

//Api to shorten url
router.post(
  '/shorten', 
  authUtils.isLoggedIn,
  urlController.shortenUrlController
);

//API to get the shortened url
router.get(
  '/shorten/:alias', 
  authUtils.isLoggedIn,
  urlController.redirectShortUrlController
);

//API to get overall analytics
router.get(
  '/analytics/overall',
  authUtils.isLoggedIn,
  analyticsController.getOverallAnalyticsController
);


//API to get analytics by topic
router.get(
  '/analytics/topic/:topic',
  authUtils.isLoggedIn,
  analyticsController.getAnalyticsByTopicController
);


//API to get analytics by alias
router.get(
  '/analytics/:alias', 
  authUtils.isLoggedIn,
  analyticsController.getAnalyticsByAliasController
);

//Logout route
router.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err); // Pass the error to the next middleware for handling
    }
    req.session.destroy((err) => {
      if (err) {
        return next(err); // Handle session destruction error
      }
      res.send('Good bye!');
    });
  });
});


module.exports = router;
