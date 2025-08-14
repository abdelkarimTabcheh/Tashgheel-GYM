const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, default: '' },
  age: { type: Number, default: null },
  bio: { type: String, default: '' },
  avatarUrl: { type: String, default: '' },
  height: { type: Number, default: null },
  weight: { type: Number, default: null },
  goal: { type: String, default: '' },
  activityLevel: { type: String, default: '' },
  isAdmin: { type: Boolean, default: false }, // for Admin Dashboard
  // NEW STREAK FIELDS
  currentStreak: { type: Number, default: 0 },
  longestStreak: { type: Number, default: 0 },
  lastCompletionDate: { type: Date, default: null },
  totalChallengesCompleted: { type: Number, default: 0 },
  streakFreezeUsed: { type: Boolean, default: false }, // Optional: streak freeze feature

  createdAt: { type: Date, default: Date.now },
});

// Method to calculate streak
UserSchema.methods.updateStreak = function () {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Start of today

  if (!this.lastCompletionDate) {
    // First completion ever
    this.currentStreak = 1;
    this.longestStreak = Math.max(this.longestStreak, 1);
    this.lastCompletionDate = today;
    return this.currentStreak;
  }

  const lastCompletion = new Date(this.lastCompletionDate);
  lastCompletion.setHours(0, 0, 0, 0);

  const daysDiff = Math.floor((today - lastCompletion) / (1000 * 60 * 60 * 24));

  if (daysDiff === 0) {
    // Same day completion, no change
    return this.currentStreak;
  } else if (daysDiff === 1) {
    // Consecutive day, increment streak
    this.currentStreak += 1;
    this.longestStreak = Math.max(this.longestStreak, this.currentStreak);
    this.lastCompletionDate = today;
    return this.currentStreak;
  } else {
    // Missed days, reset streak
    this.currentStreak = 1;
    this.lastCompletionDate = today;
    return this.currentStreak;
  }
};

module.exports = mongoose.model('User', UserSchema);