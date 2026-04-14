const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['Admin', 'Bachatgat', 'Member', 'Customer'],
    required: true
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: false
  },
  contact_no: {
    type: String,
    required: false
  },
  address: {
    type: String,
    required: false
  },
  // Specific to Bachatgat
  president_name: { type: String },
  bank_name: { type: String },
  account_no: { type: String },
  ifsc_code: { type: String },
  // Specific to Member
  bachatgat_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  aadhar_no:   { type: String },
  dob:         { type: Date },
  age:         { type: Number },
  group_role:  { type: String, enum: ['President', 'Secretary', 'Treasurer', 'Member'], default: 'Member' },
  savings:     { type: Number, default: 0 },
}, { timestamps: true });

// Password hashing middleware
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
