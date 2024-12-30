const redisClient = require('../config/redis'); // Redis client

// Store data in Redis
const setRedisCache = async (key, value, ttl = 3600) => {
  await redisClient.set(key, JSON.stringify(value), {
    EX: ttl, // Expiration time in seconds
  });
};

// Get data from Redis
const getRedisCache = async (key) => {
  const data = await redisClient.get(key);
  console.log('Yayyy the data is got from redis !!!',data);
  return data ? JSON.parse(data) : null;
};

module.exports.setRedisCache = setRedisCache;
module.exports.getRedisCache = getRedisCache;