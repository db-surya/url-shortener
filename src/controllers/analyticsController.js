const analyticsService = require('../services/analyticsService');

const getAnalyticsByAliasController = async (req, res, next) => {
  try {
    const alias = req.params.alias;
    const analyticsByAliasResult = await analyticsService.getAnalyticsByAliasService(
      alias
    );
    res.status(200).json(analyticsByAliasResult);
  } catch (error) {
    next(error); // Pass to error handling middleware
  }
}

const getAnalyticsByTopicController = async (req, res, next) => {
  try {
    const topic = req.params.topic;
    const analyticsByTopicResult = await analyticsService.getAnalyticsByTopicService(
      topic
    );
    res.status(200).json(analyticsByTopicResult);
  } catch (error) {
    next(error); // Pass to error handling middleware
  }
}

const getOverallAnalyticsController = async (req, res, next) => {
  try {
    const overallAnalyticsResult = await analyticsService.getOverallAnalyticsService();
    res.status(200).json(overallAnalyticsResult);
  } catch (error) {
    next(error); // Pass to error handling middleware
  }
}

module.exports = {
  getAnalyticsByAliasController,
  getAnalyticsByTopicController,
  getOverallAnalyticsController
}