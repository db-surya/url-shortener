const UrlModel = require('../models/urlModel'); // Assuming the URL schema is defined in urlModel.js

/**
 * Save the URL data into the database.
 * @param {Object} urlData - The URL data to save.
 * @returns {Promise<Object>} - The saved URL document.
 */
const saveUrlData = async (urlData) => {
  try {
    return await UrlModel.create(urlData);
  } catch (error) {
    throw new Error(`Error saving URL data: ${error.message}`);
  }
};

/**
 * Find a URL document by its short code.
 * @param {String} shortCode - The short code to look for.
 * @returns {Promise<Object|null>} - The found URL document or null if not found.
 */
const findByShortCode = async (shortCode) => {
  try {
    return await UrlModel.findOne({ shortUrl: shortCode });
  } catch (error) {
    throw new Error(`Error finding URL by short code: ${error.message}`);
  }
};



module.exports = {
  saveUrlData,
  findByShortCode,
};
