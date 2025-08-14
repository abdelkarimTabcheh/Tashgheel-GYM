// const mongoose = require('mongoose');

// const challengeSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   goalSteps: { type: Number, required: true },
//   durationDays: { type: Number, required: true },
//   startDate: { type: Date, required: true },
//   isPrivate: { type: Boolean, default: false },

//   // User references
//   participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
// });

// module.exports = mongoose.model('Challenge', challengeSchema);
// models/Challenge.js

const mongoose = require('mongoose');

const ChallengeSchema = new mongoose.Schema({
  title:        { type: String, required: true },
  description:  { type: String, default: '' },
  durationDays: { type: Number, required: true },
  workouts: [{
    day:       { type: Number, required: true },
    workoutId: { type: mongoose.Schema.Types.ObjectId, ref: 'Workout', required: true }
  }],
  createdAt:    { type: Date, default: Date.now }
});

module.exports = mongoose.model('Challenge', ChallengeSchema);