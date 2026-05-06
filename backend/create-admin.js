const mongoose = require('mongoose');
const dotenv   = require('dotenv');
dotenv.config();

const User = require('./models/User');

mongoose.connect(process.env.MONGO_URI).then(async () => {
  console.log('MongoDB connected...');

  // Remove any existing admin(s)
  await User.deleteMany({ role: 'Admin' });

  // Pass PLAIN TEXT password — Mongoose pre('save') will hash it ONCE correctly
  await User.create({
    username: 'harshita',
    password: '11111',          // ← plain text, middleware hashes it once
    role:     'Admin',
    name:     'Harshita (Admin)',
    email:    'harshita@admin.com',
  });

  console.log('✅ Admin user created successfully!');
  console.log('   Username : harshita');
  console.log('   Password : 11111');
  console.log('   Role     : Admin');

  await mongoose.disconnect();
  process.exit(0);
}).catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
