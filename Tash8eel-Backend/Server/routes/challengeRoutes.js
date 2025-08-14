// routes/challengeRoutes.js
const express = require('express');
const router = express.Router();
const Challenge = require('../models/Challenge');
const UserChallenge = require('../models/UserChallenge');
const User = require('../models/User'); // Add this import for streak functionality
const auth = require('../middleware/auth'); // Add this import for authentication

// List all challenges
router.get('/', async (req, res) => {
  try {
    const list = await Challenge.find().select('title description durationDays');
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: 'Failed to list challenges' });
  }
});

// Get challenge + user progress
router.get('/:id', async (req, res) => {
  try {
    const { userId } = req.query;
    const challenge = await Challenge.findById(req.params.id)
      .populate('workouts.workoutId');
    const progress = userId
      ? await UserChallenge.findOne({ userId, challengeId: challenge._id })
      : null;
    res.json({ challenge, progress });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch challenge' });
  }
});

// Start a challenge
router.post('/:id/start', async (req, res) => {
  try {
    const { userId } = req.body;
    const exists = await UserChallenge.findOne({ userId, challengeId: req.params.id });
    if (exists) return res.status(400).json({ error: 'Already started' });

    const uc = new UserChallenge({
      userId,
      challengeId: req.params.id,
      startDate: new Date(),
      completedDays: []
    });
    await uc.save();
    res.json(uc);
  } catch (err) {
    res.status(500).json({ error: 'Failed to start challenge' });
  }
});

// 🔥 UPDATED: Mark a day complete with streak integration
router.put('/:id/complete-day', auth, async (req, res) => {
  try {
    const { day } = req.body;
    const challengeId = req.params.id;
    const userId = req.user.id; // Get from auth middleware

    // Find user challenge progress
    const uc = await UserChallenge.findOne({ userId, challengeId });
    if (!uc) {
      return res.status(404).json({
        error: 'Challenge not started. Please start the challenge first.'
      });
    }

    // Check if day already completed
    if (uc.completedDays.includes(day)) {
      return res.status(400).json({
        error: 'Day already completed'
      });
    }

    // Add completed day
    uc.completedDays.push(day);
    uc.completedDays.sort((a, b) => a - b); // Keep days sorted
    uc.lastUpdated = new Date();

    // Get challenge to check if fully completed
    const challenge = await Challenge.findById(challengeId);
    if (!challenge) {
      return res.status(404).json({ error: 'Challenge not found' });
    }

    // Check if challenge is fully completed
    const isFullyCompleted = uc.completedDays.length >= challenge.durationDays;

    if (isFullyCompleted && !uc.isCompleted) {
      uc.isCompleted = true;
      uc.completedAt = new Date();
    }

    await uc.save();

    // 🔥 UPDATE USER STREAK
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const previousStreak = user.currentStreak;
    const previousLongest = user.longestStreak;
    const newStreak = user.updateStreak();

    // If challenge is fully completed, increment total challenges
    if (isFullyCompleted && !uc.wasCountedForTotal) {
      user.totalChallengesCompleted += 1;
      uc.wasCountedForTotal = true; // Add this field to prevent double counting
      await uc.save();
    }

    await user.save();

    // Determine if this is a new record
    const isNewRecord = user.longestStreak > previousLongest;

    // Return success response with streak info
    res.json({
      message: 'Day completed successfully',
      progress: uc,
      challengeCompleted: isFullyCompleted,
      streak: {
        current: user.currentStreak,
        longest: user.longestStreak,
        isNewRecord: isNewRecord,
        totalChallenges: user.totalChallengesCompleted
      }
    });

  } catch (error) {
    console.error('Error completing day:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 🔥 NEW: Get user's challenge statistics
router.get('/user/:userId/stats', async (req, res) => {
  try {
    const { userId } = req.params;

    // Get user's challenge statistics
    const totalStarted = await UserChallenge.countDocuments({ userId });
    const totalCompleted = await UserChallenge.countDocuments({
      userId,
      isCompleted: true
    });

    // Get current active challenges
    const activeChallenges = await UserChallenge.find({
      userId,
      isCompleted: { $ne: true }
    }).populate('challengeId', 'title durationDays');

    // Calculate completion rate
    const completionRate = totalStarted > 0 ? (totalCompleted / totalStarted * 100).toFixed(1) : 0;

    // Get user streak info
    const user = await User.findById(userId).select(
      'currentStreak longestStreak totalChallengesCompleted lastCompletionDate'
    );

    res.json({
      totalStarted,
      totalCompleted,
      completionRate: parseFloat(completionRate),
      activeChallenges: activeChallenges.map(ac => ({
        challengeId: ac.challengeId._id,
        challengeTitle: ac.challengeId.title,
        durationDays: ac.challengeId.durationDays,
        completedDays: ac.completedDays.length,
        progress: (ac.completedDays.length / ac.challengeId.durationDays * 100).toFixed(1),
        startDate: ac.startDate
      })),
      streak: {
        current: user?.currentStreak || 0,
        longest: user?.longestStreak || 0,
        lastActivity: user?.lastCompletionDate
      }
    });

  } catch (error) {
    console.error('Error fetching user stats:', error);
    res.status(500).json({ error: 'Failed to fetch user statistics' });
  }
});

// Keep the old endpoint for backward compatibility (but deprecated)
router.post('/:id/complete', async (req, res) => {
  try {
    const { userId, day } = req.body;
    const uc = await UserChallenge.findOne({ userId, challengeId: req.params.id });
    if (!uc) return res.status(404).json({ error: 'Not started' });

    if (!uc.completedDays.includes(day)) {
      uc.completedDays.push(day);
      uc.lastUpdated = new Date();
      await uc.save();
    }
    res.json(uc);
  } catch (err) {
    res.status(500).json({ error: 'Failed to complete day' });
  }
});

module.exports = router;
