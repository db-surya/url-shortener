const mongoose = require('mongoose');

const counterSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, // Identifier for the counter
  count: { type: Number, required: true, default: 0 }, // Counter value
});

const CounterModel = mongoose.model('Counter', counterSchema);

module.exports = CounterModel;
