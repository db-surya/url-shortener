const ALPHABET = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
const BASE = ALPHABET.length;

/**
 * Convert a counter value into a Base62-encoded string.
 * @param {Number} counterValue - The numeric counter value.
 * @returns {String} - A 7-character Base62-encoded string.
 */
const generateShortUrl = (counterValue) => {
  let encoded = '';
  while (counterValue > 0) {
    encoded = ALPHABET[counterValue % BASE] + encoded;
    counterValue = Math.floor(counterValue / BASE);
  }

  // Ensure the short URL is exactly 7 characters long
  return encoded.padStart(7, 'a');
};

module.exports = { generateShortUrl };
