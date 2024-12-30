const urlRepository = require('../data-access/urlData');
const counterRepository = require('../data-access/counterData');
const redirectLogRepository = require('../data-access/redirectLogData');
const { generateShortUrl, getuserAgentDetails } = require('../utils/helpers');
const config = require('../config/config');
const redisUtils = require('../utils/redisUtils');

const shortenUrlService = async (longUrl, customAlias, topic) => {
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
    const counterValue = await counterRepository.getNextCounterValue('urlCounter');
    shortCode = generateShortUrl(counterValue);
  }
  console.log('The short code generated here <<<<<', shortCode);

  const newUrlData = {
    longUrl,
    shortUrl: shortCode,
    topic: topic || 'general',
    createdAt: new Date(),
  };

  const savedUrl = await urlRepository.saveUrlData(newUrlData);

  // Save to Redis
  const redisKey = `shortUrl:${shortCode}`;
  await redisUtils.setRedisCache(redisKey, { longUrl, topic });

  return {
    createdAt: savedUrl.createdAt,
    shortUrl: `${config.baseUrl}/api/shorten/${savedUrl.shortUrl}`,
  };
};

const redirectShortUrlService = async (customAlias, userAgent, username, ipAddress) => {
  const redisKey = `shortUrl:${customAlias}`;
  let existingUrl = await redisUtils.getRedisCache(redisKey);

  if (!existingUrl) {
    // Not in Redis, fetch from DB
    existingUrl = await urlRepository.findByShortCode(customAlias);
    if (!existingUrl) {
      throw new Error('URL not found');
    }
    // Store in Redis
    await redisUtils.setRedisCache(redisKey, {
      longUrl: existingUrl.longUrl,
      topic: existingUrl.topic,
    });
  }

  const { osType, deviceType, geoLocation } = getuserAgentDetails(userAgent, ipAddress);
  console.log('The os type', osType);
  console.log('The device type', deviceType);

  const alias = existingUrl.shortUrl || customAlias;
  const topic = existingUrl.topic;

  const logData = {
    alias,
    topic,
    username,
    ipAddress,
    geoLocation,
    osType,
    deviceType,
  };

  await redirectLogRepository.saveRedirectLog(logData);

  return existingUrl.longUrl;
};

module.exports = {
  shortenUrlService,
  redirectShortUrlService
};
