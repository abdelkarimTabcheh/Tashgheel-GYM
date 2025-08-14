const User = require('../models/User');

exports.updateUserProfile = async (req, res) => {
    try {
        console.log('Received PUT /profile request');
        console.log('req.body:', req.body);
        console.log('req.file:', req.file);

        if (!req.body) {
            return res.status(400).json({ message: 'Invalid form data' });
        }

        const updateData = {
            name: req.body.name || '',
            age: req.body.age || '',
            bio: req.body.bio || '',
            height: req.body.height || '',
            weight: req.body.weight || '',
            goal: req.body.goal || '',
            activityLevel: req.body.activityLevel || '',
        };

        if (req.file) {
            updateData.avatarUrl = `/uploads/${req.file.filename}`;
        }

        const user = await User.findByIdAndUpdate(req.user.id, updateData, {
            new: true,
        }).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.json({ message: 'Profile updated successfully', user });
    } catch (err) {
        console.error('Update profile error:', err);
        return res.status(500).json({ message: 'Server error updating profile' });
    }
};


exports.getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');

        const profileComplete = !!(
            user.height &&
            user.weight &&
            user.goal &&
            user.activityLevel
        );

        res.json({ ...user._doc, profileComplete });
    } catch (err) {
        console.error('Get profile error:', err);
        res.status(500).json({ message: 'Server error loading profile' });
    }
};
