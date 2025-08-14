// routes/workouts.js
const express = require('express');
const router = express.Router();
const Workout = require('../models/Workout');

// GET all workouts
router.get('/', async (req, res) => {
  try {
    const workouts = await Workout.find();
    res.json(workouts);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch workouts' });
  }
});

// GET workouts by category
router.get('/category/:category', async (req, res) => {
  try {
    const workouts = await Workout.find({ category: req.params.category });
    res.json(workouts);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch workouts by category' });
  }
});

// POST new workout
router.post('/', async (req, res) => {
  try {
    const {
      name,
      category,
      description,
      tips,
      targetMuscles,
      duration,
      animationUrl,    // expect client to send full URL here
    } = req.body;

    const newWorkout = new Workout({
      name,
      category,
      description,
      tips,
      targetMuscles,
      duration,
      animationUrl,
    });

    const savedWorkout = await newWorkout.save();
    res.status(201).json(savedWorkout);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create workout', details: error.message });
  }
});

module.exports = router;