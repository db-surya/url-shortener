const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema({
  longUrl: { type: String, required: true }, // Original long URL
  shortUrl: { type: String, required: true, unique: true }, // Generated short URL (or custom alias)
  topic: { type: String, default: 'general' }, // Topic or category
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Reference to the Users collection (if applicable)
  createdAt: { type: Date, default: Date.now }, // Creation timestamp
});


const UrlModel = mongoose.model('Url', urlSchema);

module.exports = UrlModel;
