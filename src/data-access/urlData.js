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

/**
 * Update analytics for a URL document.
 * @param {String} shortCode - The short code for the URL.
 * @param {Object} updateData - The analytics data to update.
 * @returns {Promise<Object>} - The updated URL document.
 */
const updateAnalytics = async (shortCode, updateData) => {
  try {
    return await UrlModel.findOneAndUpdate(
      { shortUrl: shortCode },
      { $set: updateData },
      { new: true, upsert: false }
    );
  } catch (error) {
    throw new Error(`Error updating analytics: ${error.message}`);
  }
};

/**
 * Find a URL document by its long URL.
 * @param {String} longUrl - The long URL to look for.
 * @returns {Promise<Object|null>} - The found URL document or null if not found.
 */
const findByLongUrl = async (longUrl) => {
  try {
    return await UrlModel.findOne({ longUrl });
  } catch (error) {
    throw new Error(`Error finding URL by long URL: ${error.message}`);
  }
};

module.exports = {
  saveUrlData,
  findByShortCode,
  updateAnalytics,
  findByLongUrl,
};
