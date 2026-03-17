const mongoose = require('mongoose');

const watchlistItemSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  symbol: {
    type: String,
    required: true,
    trim: true,
    uppercase: true
  },
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  change: {
    type: Number,
    required: true
  },
  changePercent: {
    type: Number,
    required: true
  },
  addedAt: {
    type: Date,
    default: Date.now
  }
});

// Prevent duplicate watchlist items for the same user and symbol
watchlistItemSchema.index({ userId: 1, symbol: 1 }, { unique: true });

module.exports = mongoose.model('WatchlistItem', watchlistItemSchema);