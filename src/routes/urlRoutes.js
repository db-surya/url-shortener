const express = require('express');
const router = express.Router();
const urlController = require('../controllers/urlController');

router.get('/',(req,res)=>{
  res.send("Welcome to express application");
})
router.post('/shorten', urlController.shortenUrl);

module.exports = router;
