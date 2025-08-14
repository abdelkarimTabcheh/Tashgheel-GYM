// seedAdmin.js
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  const email = process.env.ADMIN_EMAIL || 'admin@example.com';
  const password = process.env.ADMIN_PASSWORD || 'Admin123!';
  const exist = await User.findOne({ email });
  if (exist) {
    console.log('Admin already exists:', email);
    process.exit(0);
  }
  const hashed = await bcrypt.hash(password, 10);
  const admin = new User({ email, password: hashed, isAdmin: true, name: 'Admin' });
  await admin.save();
  console.log('Admin created:', email);
  process.exit(0);
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
