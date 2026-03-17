const express = require('express');
const axios = require('axios');
const WatchlistItem = require('../models/WatchlistItem');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/v1/watchlist
// @desc    Get user's watchlist
// @access  Private
router.get('/', authMiddleware, async (req, res) => {
  try {
    const watchlistItems = await WatchlistItem.find({ userId: req.user.userId })
      .sort({ addedAt: -1 });

    res.json(watchlistItems);
  } catch (error) {
    console.error('Watchlist fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch watchlist' });
  }
});

// @route   POST /api/v1/watchlist
// @desc    Add item to watchlist
// @access  Private
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { symbol } = req.body;

    if (!symbol) {
      return res.status(400).json({ error: 'Symbol is required' });
    }

    const upperSymbol = symbol.toUpperCase();

    // Check if item already exists in watchlist
    const existingItem = await WatchlistItem.findOne({
      userId: req.user.userId,
      symbol: upperSymbol
    });

    if (existingItem) {
      return res.status(400).json({ error: 'Item already in watchlist' });
    }

    // Fetch current stock data
    let stockData;
    try {
      const quoteResponse = await axios.get(`${process.env.VITE_API_URL || 'http://localhost:5000/api/v1'}/stocks/quote/${upperSymbol}`);
      stockData = quoteResponse.data;
    } catch (error) {
      // Fallback to mock data
      const mockStockData = {
        'AAPL': { price: 175.50, change: 2.35, changePercent: 1.36, name: 'Apple Inc.' },
        'TSLA': { price: 250.75, change: -5.25, changePercent: -2.05, name: 'Tesla Inc.' },
        'GOOGL': { price: 170.25, change: 1.80, changePercent: 1.07, name: 'Alphabet Inc.' },
        'MSFT': { price: 415.30, change: 3.45, changePercent: 0.84, name: 'Microsoft Corp.' }
      };

      stockData = mockStockData[upperSymbol] || {
        price: 100 + Math.random() * 200,
        change: (Math.random() - 0.5) * 10,
        changePercent: (Math.random() - 0.5) * 5,
        name: `${upperSymbol} Corp`
      };
    }

    // Create watchlist item
    const watchlistItem = new WatchlistItem({
      userId: req.user.userId,
      symbol: upperSymbol,
      name: stockData.name || upperSymbol,
      price: stockData.price,
      change: stockData.change,
      changePercent: stockData.changePercent
    });

    await watchlistItem.save();

    res.status(201).json(watchlistItem);
  } catch (error) {
    console.error('Watchlist add error:', error);
    res.status(500).json({ error: 'Failed to add to watchlist' });
  }
});

// @route   DELETE /api/v1/watchlist/:id
// @desc    Remove item from watchlist
// @access  Private
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const watchlistItem = await WatchlistItem.findOneAndDelete({
      _id: id,
      userId: req.user.userId
    });

    if (!watchlistItem) {
      return res.status(404).json({ error: 'Watchlist item not found' });
    }

    res.json({ message: 'Item removed from watchlist' });
  } catch (error) {
    console.error('Watchlist delete error:', error);
    res.status(500).json({ error: 'Failed to remove from watchlist' });
  }
});

module.exports = router;