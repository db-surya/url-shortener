const express = require('express');
const router = express.Router();
const urlController = require('../controllers/urlController');

//Health check api to check connection
router.get('/',(req,res)=>{
  res.send("Welcome to express application");
})

//Api to shorten url
router.post('/shorten', urlController.shortenUrl);

//API to get the shortened url
router.get('/shorten/:alias', urlController.redirectShortUrl);

module.exports = router;
