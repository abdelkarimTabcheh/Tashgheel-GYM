// routes/admin/challenges.js
const express = require('express');
const router = express.Router();
const adminAuth = require('../../middleware/adminAuth');
const Challenge = require('../../models/Challenge');
const UserChallenge = require('../../models/UserChallenge');

// GET all challenges
router.get('/', adminAuth, async (req, res) => {
  try {
    const challenges = await Challenge.find({})
      .populate('workouts.workoutId', 'name category duration')
      .sort({ createdAt: -1 });
    
    res.json(challenges);
  } catch (err) {
    console.error('Get challenges error:', err);
    res.status(500).json({ message: 'Error fetching challenges' });
  }
});

// GET challenge statistics
router.get('/stats', adminAuth, async (req, res) => {
  try {
    const totalChallenges = await Challenge.countDocuments();
    const totalParticipants = await UserChallenge.countDocuments();
    const completedChallenges = await UserChallenge.countDocuments({ isCompleted: true });
    const activeParticipants = await UserChallenge.countDocuments({ isCompleted: { $ne: true } });
    
    const completionRate = totalParticipants > 0 
      ? Math.round((completedChallenges / totalParticipants) * 100) 
      : 0;

    res.json({
      totalChallenges,
      totalParticipants,
      completedChallenges,
      activeParticipants,
      completionRate
    });
  } catch (err) {
    console.error('Get challenge stats error:', err);
    res.status(500).json({ message: 'Error fetching challenge statistics' });
  }
});

// GET challenge participants
router.get('/:id/participants', adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    
    const participants = await UserChallenge.find({ challengeId: id })
      .populate('userId', 'name email')
      .populate('challengeId', 'title durationDays')
      .sort({ startDate: -1 });

    const participantsData = participants.map(uc => ({
      _id: uc._id,
      user: uc.userId,
      challenge: uc.challengeId,
      startDate: uc.startDate,
      completedDays: uc.completedDays,
      progress: Math.round((uc.completedDays.length / uc.challengeId.durationDays) * 100),
      isCompleted: uc.isCompleted,
      completedAt: uc.completedAt,
      lastUpdated: uc.lastUpdated
    }));

    res.json(participantsData);
  } catch (err) {
    console.error('Get challenge participants error:', err);
    res.status(500).json({ message: 'Error fetching challenge participants' });
  }
});

// CREATE a challenge
router.post('/', adminAuth, async (req, res) => {
  try {
    const { title, description, durationDays, workouts } = req.body;

    // Validate required fields
    if (!title || !durationDays || !workouts || workouts.length === 0) {
      return res.status(400).json({ 
        message: 'title, durationDays, and workouts are required' 
      });
    }

    // Validate workouts array
    const invalidWorkouts = workouts.some(w => !w.day || !w.workoutId);
    if (invalidWorkouts) {
      return res.status(400).json({ 
        message: 'Each workout must have day and workoutId' 
      });
    }

    const newChallenge = new Challenge({
      title,
      description: description || '',
      durationDays: parseInt(durationDays),
      workouts: workouts.map(w => ({
        day: parseInt(w.day),
        workoutId: w.workoutId
      }))
    });

    await newChallenge.save();
    
    // Populate the workout details for response
    const populatedChallenge = await Challenge.findById(newChallenge._id)
      .populate('workouts.workoutId', 'name category duration');
    
    res.status(201).json(populatedChallenge);
  } catch (err) {
    console.error('Create challenge error:', err);
    res.status(500).json({ message: 'Error creating challenge' });
  }
});

// UPDATE a challenge
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, durationDays, workouts } = req.body;

    // Validate required fields
    if (!title || !durationDays || !workouts || workouts.length === 0) {
      return res.status(400).json({ 
        message: 'title, durationDays, and workouts are required' 
      });
    }

    // Validate workouts array
    const invalidWorkouts = workouts.some(w => !w.day || !w.workoutId);
    if (invalidWorkouts) {
      return res.status(400).json({ 
        message: 'Each workout must have day and workoutId' 
      });
    }

    const updateData = {
      title,
      description: description || '',
      durationDays: parseInt(durationDays),
      workouts: workouts.map(w => ({
        day: parseInt(w.day),
        workoutId: w.workoutId
      }))
    };

    const updatedChallenge = await Challenge.findByIdAndUpdate(
      id, 
      updateData, 
      { new: true, runValidators: true }
    ).populate('workouts.workoutId', 'name category duration');
    
    if (!updatedChallenge) {
      return res.status(404).json({ message: 'Challenge not found' });
    }

    res.json(updatedChallenge);
  } catch (err) {
    console.error('Update challenge error:', err);
    res.status(500).json({ message: 'Error updating challenge' });
  }
});

// DELETE a challenge
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const { id } = req.params;

    // Check if challenge has active participants
    const activeParticipants = await UserChallenge.countDocuments({ 
      challengeId: id,
      isCompleted: { $ne: true }
    });

    if (activeParticipants > 0) {
      return res.status(400).json({ 
        message: `Cannot delete challenge with ${activeParticipants} active participants. Please wait for them to complete or manually remove them first.` 
      });
    }

    const deletedChallenge = await Challenge.findByIdAndDelete(id);
    if (!deletedChallenge) {
      return res.status(404).json({ message: 'Challenge not found' });
    }

    // Also delete all user challenge records for this challenge
    await UserChallenge.deleteMany({ challengeId: id });

    res.json({ message: 'Challenge deleted successfully' });
  } catch (err) {
    console.error('Delete challenge error:', err);
    res.status(500).json({ message: 'Error deleting challenge' });
  }
});

module.exports = router;