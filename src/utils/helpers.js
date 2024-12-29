const deviceDetector = require('node-device-detector');
const geoip = require('geoip-lite');
const utils = require('../utils/utils');
/**
 * Convert a counter value into a Base62-encoded string.
 * @param {Number} counterValue - The numeric counter value.
 * @returns {String} - A 7-character Base62-encoded string.
 */
const generateShortUrl = (counterValue) => {
  const ALPHABET = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const BASE = ALPHABET.length;
  let encoded = '';
  while (counterValue > 0) {
    encoded = ALPHABET[counterValue % BASE] + encoded;
    counterValue = Math.floor(counterValue / BASE);
  }

  // Ensure the short URL is exactly 7 characters long
  return encoded.padStart(7, 'a');
};

const getuserAgentDetails = (userAgent,ipAddress) =>{
  const detector = new deviceDetector();
  const deviceInfo = detector.detect(userAgent);
  console.log('The device info',deviceInfo);
  const osType = deviceInfo.os.name;
  const deviceType = deviceInfo.device.type;
  //Extracting the geo location
  const geo = geoip.lookup(ipAddress);
  console.log('The geo here',geo);
  const geoLocation = utils.pick(geo,['country','region','city','timezone']);
  console.log('The geo location after pick',geoLocation);
  return {osType, deviceType, geoLocation};
}

module.exports = { generateShortUrl, getuserAgentDetails };
