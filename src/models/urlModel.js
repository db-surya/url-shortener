const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema({
  longUrl: { type: String, required: true }, // Original long URL
  shortUrl: { type: String, required: true, unique: true }, // Generated short URL (or custom alias)
  topic: { type: String, default: 'general' }, // Topic or category
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Reference to the Users collection (if applicable)
  createdAt: { type: Date, default: Date.now }, // Creation timestamp
  analytics: {
    totalClicks: { type: Number, default: 0 }, // Total number of clicks
    uniqueClicks: { type: Number, default: 0 }, // Total unique clicks
    clicksByDate: [
      {
        date: { type: Date },
        clickCount: { type: Number, default: 0 },
      },
    ], // Daily click analytics
    osType: [
      {
        osName: { type: String },
        uniqueClicks: { type: Number, default: 0 },
        uniqueUsers: { type: Number, default: 0 },
      },
    ], // OS-based analytics
    deviceType: [
      {
        deviceName: { type: String },
        uniqueClicks: { type: Number, default: 0 },
        uniqueUsers: { type: Number, default: 0 },
      },
    ], // Device-based analytics
  },
});


const UrlModel = mongoose.model('Url', urlSchema);

module.exports = UrlModel;
