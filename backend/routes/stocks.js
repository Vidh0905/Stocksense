const express = require('express');
const axios = require('axios');
const { client } = require('../config/redis');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Mock stock data for fallback
const mockStockData = {
  'AAPL': {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    price: 175.50,
    change: 2.35,
    changePercent: 1.36,
    open: 173.15,
    high: 176.80,
    low: 172.90,
    volume: 45238765,
    marketCap: 2750000000000,
    peRatio: 28.5
  },
  'TSLA': {
    symbol: 'TSLA',
    name: 'Tesla Inc.',
    price: 250.75,
    change: -5.25,
    changePercent: -2.05,
    open: 256.00,
    high: 258.30,
    low: 249.50,
    volume: 87654321,
    marketCap: 800000000000,
    peRatio: 65.2
  },
  'GOOGL': {
    symbol: 'GOOGL',
    name: 'Alphabet Inc.',
    price: 170.25,
    change: 1.80,
    changePercent: 1.07,
    open: 168.45,
    high: 171.90,
    low: 167.80,
    volume: 23456789,
    marketCap: 2150000000000,
    peRatio: 24.8
  },
  'MSFT': {
    symbol: 'MSFT',
    name: 'Microsoft Corp.',
    price: 415.30,
    change: 3.45,
    changePercent: 0.84,
    open: 411.85,
    high: 417.50,
    low: 410.20,
    volume: 34567890,
    marketCap: 3100000000000,
    peRatio: 32.1
  }
};

// Mock historical data generator
const generateMockHistoricalData = (symbol, days = 30) => {
  const basePrice = mockStockData[symbol]?.price || 100;
  const data = [];
  let currentPrice = basePrice * 0.95; // Start slightly lower

  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);

    // Random price movement
    const changePercent = (Math.random() - 0.5) * 0.04; // +/- 2%
    currentPrice = currentPrice * (1 + changePercent);

    data.push({
      date: date.toISOString().split('T')[0],
      open: currentPrice * (1 - Math.random() * 0.01),
      high: currentPrice * (1 + Math.random() * 0.02),
      low: currentPrice * (1 - Math.random() * 0.02),
      close: currentPrice,
      volume: Math.floor(Math.random() * 100000000)
    });
  }

  return data;
};

// Mock technical indicators
const generateMockIndicators = (symbol) => {
  const basePrice = mockStockData[symbol]?.price || 100;
  return {
    ma20: basePrice * (0.98 + Math.random() * 0.04),
    ma50: basePrice * (0.97 + Math.random() * 0.06),
    rsi: 30 + Math.random() * 40,
    macd: (Math.random() - 0.5) * 2,
    macdSignal: (Math.random() - 0.5) * 1.5,
    upperBand: basePrice * 1.05,
    lowerBand: basePrice * 0.95,
    volume: Math.floor(Math.random() * 100000000)
  };
};

// @route   GET /api/v1/stocks/quote/:symbol
// @desc    Get stock quote
// @access  Public
router.get('/quote/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;
    const upperSymbol = symbol.toUpperCase();

    // Check Redis cache first
    const cachedQuote = await client.get(`quote:${upperSymbol}`);
    if (cachedQuote) {
      return res.json(JSON.parse(cachedQuote));
    }

    // Try to fetch from Alpha Vantage (fallback to mock if not available)
    let stockData;
    try {
      if (process.env.ALPHA_VANTAGE_KEY && process.env.ALPHA_VANTAGE_KEY !== 'demo') {
        const response = await axios.get(`https://www.alphavantage.co/query`, {
          params: {
            function: 'GLOBAL_QUOTE',
            symbol: upperSymbol,
            apikey: process.env.ALPHA_VANTAGE_KEY
          }
        });

        const quote = response.data['Global Quote'];
        if (quote && Object.keys(quote).length > 0) {
          stockData = {
            symbol: quote['01. symbol'],
            price: parseFloat(quote['05. price']),
            change: parseFloat(quote['09. change']),
            changePercent: parseFloat(quote['10. change percent'].replace('%', '')),
            open: parseFloat(quote['02. open']),
            high: parseFloat(quote['03. high']),
            low: parseFloat(quote['04. low']),
            volume: parseInt(quote['06. volume'])
          };
        }
      }
    } catch (error) {
      console.log('Alpha Vantage API error, using mock data');
    }

    // Fallback to mock data
    if (!stockData) {
      stockData = mockStockData[upperSymbol] || {
        symbol: upperSymbol,
        name: `${upperSymbol} Corp`,
        price: 100 + Math.random() * 200,
        change: (Math.random() - 0.5) * 10,
        changePercent: (Math.random() - 0.5) * 5,
        open: 100 + Math.random() * 200,
        high: 100 + Math.random() * 200,
        low: 100 + Math.random() * 200,
        volume: Math.floor(Math.random() * 100000000)
      };
    }

    // Cache for 60 seconds
    await client.setEx(`quote:${upperSymbol}`, 60, JSON.stringify(stockData));

    res.json(stockData);
  } catch (error) {
    console.error('Stock quote error:', error);
    res.status(500).json({ error: 'Failed to fetch stock data' });
  }
});

// @route   GET /api/v1/stocks/history/:symbol
// @desc    Get stock historical data
// @access  Public
router.get('/history/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;
    const upperSymbol = symbol.toUpperCase();

    // Check Redis cache first
    const cachedHistory = await client.get(`history:${upperSymbol}`);
    if (cachedHistory) {
      return res.json(JSON.parse(cachedHistory));
    }

    // Try to fetch from Alpha Vantage (fallback to mock if not available)
    let historicalData;
    try {
      if (process.env.ALPHA_VANTAGE_KEY && process.env.ALPHA_VANTAGE_KEY !== 'demo') {
        const response = await axios.get(`https://www.alphavantage.co/query`, {
          params: {
            function: 'TIME_SERIES_DAILY',
            symbol: upperSymbol,
            apikey: process.env.ALPHA_VANTAGE_KEY,
            outputsize: 'compact'
          }
        });

        const timeSeries = response.data['Time Series (Daily)'];
        if (timeSeries) {
          historicalData = Object.entries(timeSeries)
            .slice(0, 30) // Last 30 days
            .map(([date, data]) => ({
              date,
              open: parseFloat(data['1. open']),
              high: parseFloat(data['2. high']),
              low: parseFloat(data['3. low']),
              close: parseFloat(data['4. close']),
              volume: parseInt(data['5. volume'])
            }))
            .reverse(); // Oldest first
        }
      }
    } catch (error) {
      console.log('Alpha Vantage API error, using mock data');
    }

    // Fallback to mock data
    if (!historicalData) {
      historicalData = generateMockHistoricalData(upperSymbol);
    }

    // Cache for 5 minutes
    await client.setEx(`history:${upperSymbol}`, 300, JSON.stringify(historicalData));

    res.json(historicalData);
  } catch (error) {
    console.error('Historical data error:', error);
    res.status(500).json({ error: 'Failed to fetch historical data' });
  }
});

// @route   GET /api/v1/stocks/indicators/:symbol
// @desc    Get stock technical indicators
// @access  Public
router.get('/indicators/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;
    const upperSymbol = symbol.toUpperCase();

    // Check Redis cache first
    const cachedIndicators = await client.get(`indicators:${upperSymbol}`);
    if (cachedIndicators) {
      return res.json(JSON.parse(cachedIndicators));
    }

    // Generate mock indicators (in a real app, you'd calculate these)
    const indicators = generateMockIndicators(upperSymbol);

    // Cache for 5 minutes
    await client.setEx(`indicators:${upperSymbol}`, 300, JSON.stringify(indicators));

    res.json(indicators);
  } catch (error) {
    console.error('Indicators error:', error);
    res.status(500).json({ error: 'Failed to fetch technical indicators' });
  }
});

// @route   GET /api/v1/stocks/search/:query
// @desc    Search for stocks
// @access  Public
router.get('/search/:query', async (req, res) => {
  try {
    const { query } = req.params;

    // Mock search results
    const mockResults = Object.values(mockStockData).filter(stock =>
      stock.symbol.includes(query.toUpperCase()) ||
      stock.name.toLowerCase().includes(query.toLowerCase())
    );

    res.json(mockResults);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Failed to search stocks' });
  }
});

module.exports = router;