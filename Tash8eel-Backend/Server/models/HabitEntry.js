// // models/HabitEntry.js
// const mongoose = require('mongoose');

// const habitEntrySchema = new mongoose.Schema(
//   {
//     user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true, required: true },
//     date: { type: Date, required: true }, // midnight UTC of the day

//     // IMPORTANT: names now match your app
//     waterCount: { type: Number, default: 0, min: 0 },
//     sleepHours: { type: Number, default: 0, min: 0 },
//     steps: { type: Number, default: 0, min: 0 }, // we’ll set to stepsTarget when marked done

//     completed: {
//       water: { type: Boolean, default: false },
//       sleep: { type: Boolean, default: false },
//       steps: { type: Boolean, default: false },
//     },

//     dayNumber: { type: Number, default: 1 }, // cached "Day N"
//   },
//   { timestamps: true }
// );

// habitEntrySchema.index({ user: 1, date: 1 }, { unique: true });

// module.exports = mongoose.model('HabitEntry', habitEntrySchema);
// models/HabitEntry.js
// const mongoose = require('mongoose');

// const habitEntrySchema = new mongoose.Schema(
//   {
//     user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true, required: true },
//     date: { type: Date, required: true }, // midnight UTC of the day

//     waterCount: { type: Number, default: 0, min: 0 },
//     sleepHours: { type: Number, default: 0, min: 0 },
//     steps: { type: Number, default: 0, min: 0 },

//     completed: {
//       water: { type: Boolean, default: false },
//       sleep: { type: Boolean, default: false },
//       steps: { type: Boolean, default: false },
//     },

//     dayNumber: { type: Number, default: 1 },
//   },
//   { timestamps: true }
// );

// // One entry per user per day
// habitEntrySchema.index({ user: 1, date: 1 }, { unique: true });

// module.exports = mongoose.model('HabitEntry', habitEntrySchema);
// models/HabitEntry.js
const mongoose = require('mongoose');

const habitEntrySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true, required: true },
    date: { type: Date, required: true }, // midnight UTC
    waterCount: { type: Number, default: 0, min: 0 },
    sleepHours: { type: Number, default: 0, min: 0 },
    steps: { type: Number, default: 0, min: 0 },
    completed: {
      water: { type: Boolean, default: false },
      sleep: { type: Boolean, default: false },
      steps: { type: Boolean, default: false },
    },
    dayNumber: { type: Number, default: 1 },
  },
  { timestamps: true }
);

habitEntrySchema.index({ user: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('HabitEntry', habitEntrySchema);
