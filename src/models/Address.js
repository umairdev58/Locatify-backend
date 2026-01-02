const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  fullTextAddress: { type: String, required: true },
  cardName: { type: String, default: 'My card' },
  location: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true }
  },
  houseImages: { type: [String], default: [] },
  publicCode: { type: String, required: true, unique: true }
}, { timestamps: true });

module.exports = mongoose.model('Address', addressSchema);
