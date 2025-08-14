const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  challenge: { type: mongoose.Schema.Types.ObjectId, ref: 'Challenge', required: true },
  steps: { type: Number, required: true },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Progress', progressSchema);
