const mongoose = require('mongoose');
const dotenv   = require('dotenv');
const bcrypt   = require('bcryptjs');
dotenv.config();

const User = require('./models/User');

mongoose.connect(process.env.MONGO_URI).then(async () => {
  // Get last 5 non-admin users
  const users = await User.find({ role: { $ne: 'Admin' } }).sort({ createdAt: -1 }).limit(5);

  console.log('\n=== PASSWORD HASH TEST ===');
  for (const u of users) {
    // Test common passwords
    const tests = ['member123', '11111', 'test123', 'password123', '123456'];
    let matched = 'NONE';
    for (const p of tests) {
      const ok = await bcrypt.compare(p, u.password);
      if (ok) { matched = p; break; }
    }
    console.log(`User: ${u.username} | email: ${u.email || '(none)'} | role: ${u.role} | password_match: ${matched}`);
  }

  await mongoose.disconnect();
  process.exit(0);
}).catch(e => { console.error(e); process.exit(1); });
