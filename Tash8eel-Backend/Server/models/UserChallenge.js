// // models/UserChallenge.js
// const mongoose = require('mongoose');

// const UserChallengeSchema = new mongoose.Schema({
//   userId:        { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//   challengeId:   { type: mongoose.Schema.Types.ObjectId, ref: 'Challenge', required: true },
//   startDate:     { type: Date, required: true },
//   completedDays: [{ type: Number }],
//   lastUpdated:   { type: Date, default: Date.now }
// });

// module.exports = mongoose.model('UserChallenge', UserChallengeSchema);

// models/UserChallenge.js
const mongoose = require('mongoose');

const UserChallengeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  challengeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Challenge', required: true },
  startDate: { type: Date, default: Date.now },
  completedDays: [{ type: Number }],
  lastUpdated: { type: Date, default: Date.now },

  // 🔥 NEW FIELDS FOR COMPLETION TRACKING
  isCompleted: { type: Boolean, default: false },
  completedAt: { type: Date },
  wasCountedForTotal: { type: Boolean, default: false }, // Prevent double counting

}, {
  timestamps: true
});

// Index for faster queries
UserChallengeSchema.index({ userId: 1, challengeId: 1 }, { unique: true });
UserChallengeSchema.index({ userId: 1, isCompleted: 1 });

module.exports = mongoose.model('UserChallenge', UserChallengeSchema);