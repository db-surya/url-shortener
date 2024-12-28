const urlRepository = require('../data-access/urlData');
const counterRepository = require('../data-access/counterData');
const { generateShortUrl } = require('../utils/helpers');
const config = require('../config/config');

const shortenUrl = async (longUrl, customAlias, topic) => {
  if (!longUrl) {
    throw new Error('Long URL is required.');
  }

  let shortCode;

  if (customAlias) {
    const existingUrl = await urlRepository.findByShortCode(customAlias);
    if (existingUrl) {
      throw new Error('Custom alias already in use.');
    }
    shortCode = customAlias;
  } else {
    // Get the next counter value and generate a short code using Base62 encoding
    const counterValue = await counterRepository.getNextCounterValue('urlCounter');
    shortCode = generateShortUrl(counterValue);
  }
  console.log('The short code generated here <<<<<',shortCode);
  const newUrlData = {
    longUrl,
    shortUrl: shortCode,
    topic: topic || 'general',
    createdAt: new Date(),
  };

  const savedUrl = await urlRepository.saveUrlData(newUrlData);

  return {
    longUrl: savedUrl.longUrl,
    shortUrl: `${config.baseUrl}/api/shorten/${savedUrl.shortUrl}`,
    topic: savedUrl.topic,
  };
};

module.exports = {
  shortenUrl,
};
