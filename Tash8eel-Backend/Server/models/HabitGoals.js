// // // models/HabitGoals.js
// // const mongoose = require('mongoose');

// // const habitGoalsSchema = new mongoose.Schema(
// //   {
// //     user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true, unique: true },
// //     startDate: { type: Date, default: () => new Date() }, // day 1 for the 90-day view
// //     waterGoal: { type: Number, default: 10, min: 0 },      // glasses / day
// //     sleepGoalHours: { type: Number, default: 8, min: 0 },
// //     stepsGoal: { type: Number, default: 10000, min: 0 },
// //   },
// //   { timestamps: true }
// // );

// // module.exports = mongoose.model('HabitGoals', habitGoalsSchema);













// // models/HabitGoals.js
// const mongoose = require('mongoose');

// const habitGoalsSchema = new mongoose.Schema(
//   {
//     user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true, unique: true },
//     startDate: { type: Date, default: () => new Date() },
//     waterGoal: { type: Number, default: 10, min: 0 },
//     sleepGoalHours: { type: Number, default: 8, min: 0 },
//     stepsGoal: { type: Number, default: 10000, min: 0 },
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model('HabitGoals', habitGoalsSchema);
// // models/HabitGoals.js
// const mongoose = require('mongoose');

// const habitGoalsSchema = new mongoose.Schema(
//   {
//     user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true, unique: true },
//     startDate: { type: Date, default: () => new Date() },

    
//     waterTarget: { type: Number, default: 10, min: 0 },
//     sleepTarget: { type: Number, default: 8, min: 0 },
//     stepsTarget: { type: Number, default: 10000, min: 0 },

//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model('HabitGoals', habitGoalsSchema);

// models/HabitGoals.js
const mongoose = require('mongoose');

const habitGoalsSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true, unique: true, required: true },
    startDate: { type: Date, default: () => new Date() },
    waterTarget: { type: Number, default: 10, min: 0 },
    sleepTarget: { type: Number, default: 8, min: 0 },
    stepsTarget: { type: Number, default: 10000, min: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('HabitGoals', habitGoalsSchema);

