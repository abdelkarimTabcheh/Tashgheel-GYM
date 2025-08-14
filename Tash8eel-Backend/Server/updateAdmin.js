require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

const MONGO_URI = process.env.MONGO_URI;

async function updateAdmin() {
  try {
    await mongoose.connect(MONGO_URI);

    const hashedPassword = await bcrypt.hash('AdminPass', 10);

    const result = await User.findOneAndUpdate(
      { email: 'admin@example.com' },
      { password: hashedPassword, role: 'admin', isAdmin: true},
      { new: true }
    );

    if (result) {
      console.log('✅ Admin account updated:', result);
    } else {
      console.log('❌ No account found with that email.');
    }

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

updateAdmin();
