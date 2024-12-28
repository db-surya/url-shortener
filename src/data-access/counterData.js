const CounterModel = require('../models/counterModel');

/**
 * Get the next counter value for a given counter name.
 * If the counter does not exist, initialize it with a count of 1.
 * @param {String} counterName - The name of the counter (e.g., 'urlCounter').
 * @returns {Promise<Number>} - The updated counter value.
 */
const getNextCounterValue = async (counterName) => {
  console.log('The counter name here',counterName);
  const updatedCounter = await CounterModel.findOneAndUpdate(
    { name: counterName },
    { $inc: { count: 1 } },
    { new: true, upsert: true } // Create the counter if it doesn't exist
  );
  console.log('Update counter', updatedCounter);
  return updatedCounter.count;
};

module.exports = {
  getNextCounterValue,
};
