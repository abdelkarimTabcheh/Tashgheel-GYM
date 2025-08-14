// routes/admin/auth.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../../models/User');

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid email or password' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });

    if (!user.isAdmin) return res.status(403).json({ message: 'Access denied. Admins only.' });

    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin, role: user.role || 'admin' },
      process.env.SECRET_KEY,
      { expiresIn: '1h' }
    );

    return res.json({ message: 'Login successful', user, token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error during login' });
  }
});

module.exports = router;
