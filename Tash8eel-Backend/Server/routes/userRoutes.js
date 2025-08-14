// routes/users.js
const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Assuming you have a User model defined in models/User.js
const bcrypt = require('bcryptjs');
const auth = require('../middleware/auth'); // middleware to check token
const multer = require('multer');
const jwt = require('jsonwebtoken');
const upload = require('../middleware/uploadMiddleware');
const {
    updateUserProfile,
    getUserProfile,
} = require('../controllers/userController');

router.post('/signup', async (req, res) => {
    const { email, password } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser)
            return res.status(400).json({ message: 'User already exists' });

        const hashed = await bcrypt.hash(password, 10);
        const newUser = new User({ email, password: hashed });
        const savedUser = await newUser.save();

        // ✅ Generate token
        const token = jwt.sign({ id: savedUser._id }, process.env.SECRET_KEY, {
            expiresIn: '1h',
        });

        // ✅ Send it back
        return res.status(201).json({
            message: 'User created',
            user: savedUser,
            token, // ✅ include token here
        });
    } catch (error) {
        console.error('Signup error:', error);
        return res.status(500).json({ message: 'Server error during signup' });
    }
});

// Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Optional: password check
        // const isMatch = await bcrypt.compare(password, user.password);
        // if (!isMatch) {
        //     return res.status(400).json({ message: 'Invalid email or password' });
        // }

        const token = jwt.sign({ id: user._id,/* for Admin Dashboard */ isAdmin: user.isAdmin, role: user.role || (user.isAdmin ? 'admin' : 'user') }, process.env.SECRET_KEY, { expiresIn: '1h' });

        return res.status(200).json({ message: 'Login successful', user, token });
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ message: 'Server error during login' });
    }
});

// Get all users
router.get('/', async (req, res) => {
    try {
        const users = await User.find({});
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching users' });
    }
});

// Delete user by email
router.delete('/:email', async (req, res) => {
    try {
        const deleted = await User.findOneAndDelete({ email: req.params.email });

        if (!deleted)
            return res.status(404).json({ message: 'User not found' });

        res.json({ message: 'User deleted', deleted });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting user' });
    }
});

// Existing routes
router.get('/profile', auth, getUserProfile);
router.put('/profile', auth, upload.single('profileImage'), updateUserProfile);

// 🔥 NEW STREAK ROUTES 🔥

// PUT /users/streak - Update user streak when challenge day completed
router.put('/streak', auth, async (req, res) => {
    try {
        const { challengeCompleted = false } = req.body;
        const userId = req.user.id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update streak using the model method
        const newStreak = user.updateStreak();

        // If a full challenge was completed, increment total challenges
        if (challengeCompleted) {
            user.totalChallengesCompleted += 1;
        }

        await user.save();

        res.json({
            message: 'Streak updated successfully',
            user: {
                _id: user._id,
                currentStreak: user.currentStreak,
                longestStreak: user.longestStreak,
                totalChallengesCompleted: user.totalChallengesCompleted,
                lastCompletionDate: user.lastCompletionDate
            }
        });
    } catch (error) {
        console.error('Error updating streak:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// GET /users/streak - Get user streak information
router.get('/streak', auth, async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select('currentStreak longestStreak totalChallengesCompleted lastCompletionDate');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if streak should be reset due to inactivity
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (user.lastCompletionDate) {
            const lastCompletion = new Date(user.lastCompletionDate);
            lastCompletion.setHours(0, 0, 0, 0);
            const daysDiff = Math.floor((today - lastCompletion) / (1000 * 60 * 60 * 24));

            // Reset streak if more than 1 day has passed
            if (daysDiff > 1) {
                user.currentStreak = 0;
                await user.save();
            }
        }

        res.json({
            currentStreak: user.currentStreak,
            longestStreak: user.longestStreak,
            totalChallengesCompleted: user.totalChallengesCompleted,
            lastCompletionDate: user.lastCompletionDate
        });
    } catch (error) {
        console.error('Error fetching streak:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// POST /users/streak/reset - Reset user streak (for testing or admin purposes)
router.post('/streak/reset', auth, async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.currentStreak = 0;
        user.lastCompletionDate = null;
        await user.save();

        res.json({
            message: 'Streak reset successfully',
            user: {
                currentStreak: user.currentStreak,
                longestStreak: user.longestStreak,
                lastCompletionDate: user.lastCompletionDate
            }
        });
    } catch (error) {
        console.error('Error resetting streak:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// GET /users/leaderboard - Get streak leaderboard (optional feature)
router.get('/leaderboard', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;

        const topUsers = await User.find({})
            .select('name avatarUrl currentStreak longestStreak totalChallengesCompleted')
            .sort({ currentStreak: -1, longestStreak: -1 })
            .limit(limit);

        res.json({
            message: 'Leaderboard fetched successfully',
            leaderboard: topUsers
        });
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;