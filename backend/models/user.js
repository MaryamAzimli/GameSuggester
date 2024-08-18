const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  mail: {type: String, required: true},
  otp: { type: String }, 
  otpExpiry: { type: Date }, 
  isVerified: {type: Boolean, default: false},
  favorites: { type: [String], default: [] } // Array to store favorite game IDs
});
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10); // Verify that this is consistent with all uses of bcrypt
  next();
});


const User = mongoose.model('User', UserSchema);
module.exports = User;
