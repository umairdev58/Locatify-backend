const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  accountType: {
    type: String,
    enum: ['user', 'delivery'],
    default: 'user',
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
