const { getLogsByAlias, getLogsByTopic, getOverallAnalytics } = require('../data-access/redirectLogData');
const queriesRepository = require('../queries/getPipeline');
const getAnalyticsByAliasService =  async(alias) =>{
  try {
    console.log('The alias got here <<<<',alias);
   
    const pipeline = queriesRepository.getPipelineByAlias(alias);

    const [result] = await getLogsByAlias(alias, pipeline);
    console.log('The result got here',result);
    if (!result) throw new Error('No logs found for the specified alias.');

    return result;
  } catch (error) {
    throw new Error(`Failed to retrieve analytics for alias: ${error.message}`);
  }
};


const getAnalyticsByTopicService = async(topic) =>{
  try {
    console.log('The topic got here <<<<', topic);
    const pipeline = queriesRepository.getPipelineByTopic(topic);

    const [result] = await getLogsByTopic(topic, pipeline);
    console.log('The result got here', result);
    if (!result) throw new Error('No logs found for the specified topic.');

    return result;
  } catch (error) {
    throw new Error(`Failed to retrieve analytics for topic: ${error.message}`);
  }
}

const getOverallAnalyticsService = async() =>{
  try {
  
    const pipeline = queriesRepository.getOverallPipeline();
    const [result] = await getOverallAnalytics(pipeline);
    console.log('The result got here', result);
    if (!result) throw new Error('No logs found ');

    return result;
  } catch (error) {
    throw new Error(`Failed to retrieve overall analytics ${error.message}`);
  }
};

module.exports = {
  getAnalyticsByAliasService,
  getAnalyticsByTopicService,
  getOverallAnalyticsService
}