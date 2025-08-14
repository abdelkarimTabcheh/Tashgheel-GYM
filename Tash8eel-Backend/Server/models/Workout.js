// const mongoose = require('mongoose');

// const workoutSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   category: { type: String, required: true },
//   description: { type: String, required: true },
//   tips: { type: String },
//   targetMuscles: [{ type: String }],
//   duration: { type: String },
//   animationFile: { type: String, required: true }, // e.g., "jumping-jacks.json"
//   createdAt: { type: Date, default: Date.now },
// });

// module.exports = mongoose.model('Workout', workoutSchema);
const mongoose = require('mongoose')

const workoutSchema = new mongoose.Schema({
  name:         { type: String, required: true },
  category:     { type: String, required: true },
  description:  { type: String, required: true },
  tips:         { type: String },
  targetMuscles:[{ type: String }],
  duration:     { type: String },
  animationUrl: { type: String, required: true },  // only URL now
  createdAt:    { type: Date, default: Date.now },
})

module.exports = mongoose.model('Workout', workoutSchema)
