const mongoose = require('mongoose');

const redirectLogSchema = new mongoose.Schema({
  alias: { type: String, required: true, index: true }, // Short URL alias
  topic: { type: String, required: true }, // Topic or category
  username: { type: String, required: true }, // Username of the user creating the short URL
  timestamp: { type: Date, default: Date.now }, // Timestamp of the redirect event
  ipAddress: { type: String, required: true }, // IP address of the user
  geoLocation: {
    country: { type: String }, // Country of the user
    region: { type: String }, // Region of the user
    city: { type: String }, // City of the user
    timezone: { type: String }, // Timezone of the user
  },
  osType: { type: String }, // Operating System type (e.g., Windows, macOS, etc.)
  deviceType: { type: String }, // Device type (e.g., mobile, desktop, etc.)
});

const RedirectLogModel = mongoose.model('RedirectLog', redirectLogSchema);

module.exports = RedirectLogModel;

