const express = require('express');
const router = express.Router();
const urlController = require('../controllers/urlController');
const analyticsController = require('../controllers/analyticsController')

//Health check api to check connection
router.get('/',(req,res)=>{
  res.send("Welcome to express application");
})

//Api to shorten url
router.post(
  '/shorten', 
  urlController.shortenUrlController
);

//API to get the shortened url
router.get(
  '/shorten/:alias', 
  urlController.redirectShortUrlController
);

//API to get overall analytics
router.get(
  '/analytics/overall',
  analyticsController.getOverallAnalyticsController
);


//API to get analytics by topic
router.get(
  '/analytics/topic/:topic',
  analyticsController.getAnalyticsByTopicController
);


//API to get analytics by alias
router.get(
  '/analytics/:alias', 
  analyticsController.getAnalyticsByAliasController
);


module.exports = router;
