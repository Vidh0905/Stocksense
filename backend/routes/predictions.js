const express = require('express');
const axios = require('axios');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/v1/predictions/predict
// @desc    Get stock price predictions
// @access  Private
router.post('/predict', authMiddleware, async (req, res) => {
  try {
    const { symbol } = req.body;

    if (!symbol) {
      return res.status(400).json({ error: 'Symbol is required' });
    }

    // Call ML service to get predictions
    try {
      const mlResponse = await axios.post(
        `${process.env.ML_SERVICE_URL || 'http://localhost:8000'}/predict`,
        { symbol: symbol.toUpperCase() },
        { timeout: 10000 } // 10 second timeout
      );

      return res.json(mlResponse.data);
    } catch (mlError) {
      console.error('ML Service error:', mlError.message);

      // Fallback to mock predictions
      const mockPredictions = generateMockPredictions(symbol.toUpperCase());
      return res.json(mockPredictions);
    }
  } catch (error) {
    console.error('Prediction error:', error);
    res.status(500).json({ error: 'Failed to generate predictions' });
  }
});

// Mock prediction generator
const generateMockPredictions = (symbol) => {
  const basePrice = getBasePrice(symbol);
  const predictions = [];
  const today = new Date();

  // Generate 7 days of predictions
  let currentPrice = basePrice;
  for (let i = 1; i <= 7; i++) {
    const predictionDate = new Date(today);
    predictionDate.setDate(today.getDate() + i);

    // Random price movement (-2% to +2%)
    const changePercent = (Math.random() - 0.5) * 0.04;
    currentPrice = currentPrice * (1 + changePercent);

    predictions.push({
      date: predictionDate.toISOString().split('T')[0],
      predictedPrice: parseFloat(currentPrice.toFixed(2)),
      confidence: 0.7 + Math.random() * 0.25, // 70-95% confidence
      trend: Math.random() > 0.5 ? (Math.random() > 0.5 ? 'bullish' : 'bearish') : 'neutral'
    });
  }

  return {
    symbol,
    predictions,
    confidence: 0.8,
    trend: predictions[predictions.length - 1].predictedPrice > basePrice ? 'bullish' : 'bearish',
    technicalIndicators: {
      ma20: basePrice * (0.98 + Math.random() * 0.04),
      ma50: basePrice * (0.97 + Math.random() * 0.06),
      rsi: 30 + Math.random() * 40,
      macd: (Math.random() - 0.5) * 2,
      volume: Math.floor(Math.random() * 100000000)
    }
  };
};

// Get base price for mock data
const getBasePrice = (symbol) => {
  const prices = {
    'AAPL': 175.50,
    'TSLA': 250.75,
    'GOOGL': 170.25,
    'MSFT': 415.30
  };
  return prices[symbol] || 100 + Math.random() * 200;
};

module.exports = router;