const RedirectLog = require('../models/redirectLogModel'); // Assuming the schema is saved as redirectLogModel.js

/**
 * Save a redirect log entry to the database.
 * @param {Object} logData - The log data to save.
 * @returns {Promise<Object>} - The saved log document.
 */
const saveRedirectLog = async (logData) => {
  try {
    return await RedirectLog.create(logData);
  } catch (error) {
    throw new Error(`Error saving redirect log: ${error.message}`);
  }
};


module.exports = {
  saveRedirectLog,
};
