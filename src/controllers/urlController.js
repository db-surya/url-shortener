const urlService = require('../services/urlService');

const shortenUrl = async (req, res, next) => {
  try {
    const { longUrl, customAlias, topic } = req.body;
    const shortenUrlResult = await urlService.shortenUrl(longUrl, customAlias, topic);
    res.status(201).json(shortenUrlResult);
  } catch (error) {
    next(error); // Pass to error handling middleware
  }
};

module.exports = {
  shortenUrl,
};
