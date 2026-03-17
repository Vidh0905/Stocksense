const mongoose = require('mongoose');

const predictionHistorySchema = new mongoose.Schema({
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
  predictions: [{
    date: {
      type: Date,
      required: true
    },
    predictedPrice: {
      type: Number,
      required: true
    },
    confidence: {
      type: Number,
      required: true,
      min: 0,
      max: 1
    },
    trend: {
      type: String,
      enum: ['bullish', 'bearish', 'neutral'],
      required: true
    }
  }],
  technicalIndicators: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  },
  sentimentScore: {
    type: Number,
    min: -1,
    max: 1
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('PredictionHistory', predictionHistorySchema);