const RedirectLogModel = require('../models/redirectLogModel'); // Assuming the schema is saved as redirectLogModel.js

/**
 * Save a redirect log entry to the database.
 * @param {Object} logData - The log data to save.
 * @returns {Promise<Object>} - The saved log document.
 */
const saveRedirectLog = async (logData) => {
  try {
    return await RedirectLogModel.create(logData);
  } catch (error) {
    throw new Error(`Error saving redirect log: ${error.message}`);
  }
};

/**
 * Run aggregation pipeline for alias analytics.
 * @param {String} alias - The alias to filter.
 * @param {Array} pipeline - Aggregation pipeline.
 * @returns {Promise<Array>} - Aggregated results.
 */
const getLogsByAlias = async (alias, pipeline) => {
  try {
    return await RedirectLogModel.aggregate(pipeline);
  } catch (error) {
    throw new Error(`Error aggregating logs for alias: ${error.message}`);
  }
};

/**
 * Run aggregation pipeline for topic analytics.
 * @param {String} topic - The topic to filter.
 * @param {Array} pipeline - Aggregation pipeline.
 * @returns {Promise<Array>} - Aggregated results.
 */
const getLogsByTopic = async (topic, pipeline) => {
  try {
    return await RedirectLogModel.aggregate(pipeline);
  } catch (error) {
    throw new Error(`Error aggregating logs for topic: ${error.message}`);
  }
};

const getOverallAnalytics = async(pipeline) =>{
  try {
    return await RedirectLogModel.aggregate(pipeline);
  } catch (error) {
    throw new Error(`Error aggregating logs for topic: ${error.message}`);
  }
}


module.exports = {
  saveRedirectLog,
  getLogsByAlias,
  getLogsByTopic,
  getOverallAnalytics
};
