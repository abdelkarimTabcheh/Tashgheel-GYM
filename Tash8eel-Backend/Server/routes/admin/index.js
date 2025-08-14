// routes/admin/index.js
const express = require('express');
const router = express.Router();

router.use('/auth', require('./auth'));
router.use('/users', require('./users'));
// add /workouts and /challenges admin variations if you want:
router.use('/workouts', require('./workouts'));
router.use('/challenges', require('./challenges'));

module.exports = router;
    