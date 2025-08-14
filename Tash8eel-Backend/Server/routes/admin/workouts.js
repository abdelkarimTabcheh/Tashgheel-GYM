const express = require('express');
const router = express.Router();
const adminAuth = require('../../middleware/adminAuth');
const Workout = require('../../models/Workout');

// GET all workouts
router.get('/', adminAuth, async (req, res) => {
  try {
    const workouts = await Workout.find({});
    res.json(workouts);
  } catch (err) {
    console.error('Get workouts error:', err);
    res.status(500).json({ message: 'Error fetching workouts' });
  }
});

// CREATE a workout
router.post('/', adminAuth, async (req, res) => {
  try {
    const { name, category, description, tips, targetMuscles, duration, animationUrl } = req.body;

    // Validate required fields
    if (!name || !category || !description || !animationUrl) {
      return res.status(400).json({ message: 'name, category, description, and animationUrl are required' });
    }

    const newWorkout = new Workout({
      name,
      category,
      description,
      tips: tips || '',
      targetMuscles: targetMuscles || [],
      duration: duration || '',
      animationUrl
    });

    await newWorkout.save();
    res.status(201).json(newWorkout);
  } catch (err) {
    console.error('Create workout error:', err);
    res.status(500).json({ message: 'Error creating workout' });
  }
});

// UPDATE a workout
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updatedWorkout = await Workout.findByIdAndUpdate(id, updates, { 
      new: true,
      runValidators: true 
    });
    
    if (!updatedWorkout) {
      return res.status(404).json({ message: 'Workout not found' });
    }

    res.json(updatedWorkout);
  } catch (err) {
    console.error('Update workout error:', err);
    res.status(500).json({ message: 'Error updating workout' });
  }
});

// DELETE a workout
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const { id } = req.params;

    const deletedWorkout = await Workout.findByIdAndDelete(id);
    if (!deletedWorkout) {
      return res.status(404).json({ message: 'Workout not found' });
    }

    res.json({ message: 'Workout deleted successfully' });
  } catch (err) {
    console.error('Delete workout error:', err);
    res.status(500).json({ message: 'Error deleting workout' });
  }
});

module.exports = router;