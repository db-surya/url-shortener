const urlService = require('../services/urlService');

const shortenUrlController = async (req, res, next) => {
  try {
    const { longUrl, customAlias, topic } = req.body;
    const shortenUrlResult = await urlService.shortenUrlService(longUrl, customAlias, topic);
    res.status(201).json(shortenUrlResult);
  } catch (error) {
    next(error); // Pass to error handling middleware
  }
};

const redirectShortUrlController = async (req, res, next) => {
  try {
    const customAlias = req.params.alias; // Get custom alias from the URL parameter
    const userAgent = req.headers['user-agent'];  //Getting the user agent
    const username = "virat";
    console.log('The ip request came here ?????',req.ip);
    const ipAddress = req.ip === '::1' ? '8.8.8.8' : req.ip;
    // Call the service to get the long URL for the short code
    const longUrl = await urlService.redirectShortUrlService(customAlias, userAgent,username,ipAddress);
    // Redirect the user to the long URL
    res.redirect(longUrl);  // Performs the actual redirection
  } catch (error) {
    if (error.message === 'URL not found') {
      // If URL not found, return a 404 Not Found status
      res.status(404).json({ message: error.message });
    } else {
      // Handle other unexpected errors (500 Internal Server Error)
      next(error);
    }
  }
};



module.exports = {
  shortenUrlController,
  redirectShortUrlController,
};
