const express = require('express');
const cors = require('cors');
const fs = require('fs');
const mongoose = require('mongoose');
const app = express();
const PORT = 3000;
const bodyParser = require('body-parser');
require('dotenv').config();
const path = require('path');

const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Mongo connected'))
    .catch((err) => console.error(err));


app.use(express.json());
app.use(express.urlencoded({ extended: true })); // to parse application/x-www-form-urlencoded

app.use(cors());

const userRoutes = require('./routes/userRoutes'); 
app.use('/users', userRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// for Admin Dashboard
const adminRoutes = require('./routes/admin');
app.use('/admin', adminRoutes);
    // Admin users
const adminUserRoutes = require('./routes/admin/users');
app.use('/admin/users', adminUserRoutes);

    // Admin workouts
const adminWorkoutRoutes = require('./routes/admin/workouts');
app.use('/admin/workouts', adminWorkoutRoutes);
    // Admin challenges
const adminChallengeRoutes = require('./routes/admin/challenges');
app.use('/admin/challenges', adminChallengeRoutes);

//
// app.use('/animations', express.static(path.join(__dirname, 'uploads/animations')));
//
app.use(bodyParser.json());

const workoutRoutes = require('./routes/workoutRoutes');
app.use('/api/workouts', workoutRoutes);

const challengeRoutes = require('./routes/challengeRoutes');
app.use('/api/challenges', challengeRoutes);


app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
