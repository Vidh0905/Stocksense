const express = require('express');
const axios = require('axios');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Mock news data for fallback
const mockNews = [
  {
    id: 1,
    title: "Tech Stocks Rally Amid Positive Earnings Reports",
    description: "Major technology companies reported strong quarterly earnings, driving market optimism.",
    source: "Financial Times",
    publishedAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    url: "https://example.com/news/1",
    sentiment: 0.75
  },
  {
    id: 2,
    title: "Federal Reserve Holds Interest Rates Steady",
    description: "The central bank decided to maintain current interest rates amid economic uncertainty.",
    source: "Wall Street Journal",
    publishedAt: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
    url: "https://example.com/news/2",
    sentiment: 0.2
  },
  {
    id: 3,
    title: "Oil Prices Surge Following Supply Chain Disruptions",
    description: "Global oil markets react to supply concerns affecting energy stocks.",
    source: "Reuters",
    publishedAt: new Date(Date.now() - 10800000).toISOString(), // 3 hours ago
    url: "https://example.com/news/3",
    sentiment: -0.4
  },
  {
    id: 4,
    title: "Cryptocurrency Market Shows Signs of Recovery",
    description: "Digital assets gain momentum as regulatory clarity improves.",
    source: "Bloomberg",
    publishedAt: new Date(Date.now() - 14400000).toISOString(), // 4 hours ago
    url: "https://example.com/news/4",
    sentiment: 0.6
  },
  {
    id: 5,
    title: "Retail Sales Exceed Expectations in Latest Quarter",
    description: "Consumer spending data beats economist forecasts, signaling economic strength.",
    source: "CNBC",
    publishedAt: new Date(Date.now() - 18000000).toISOString(), // 5 hours ago
    url: "https://example.com/news/5",
    sentiment: 0.85
  }
];

// @route   GET /api/v1/news/latest
// @desc    Get latest financial news
// @access  Private
router.get('/latest', authMiddleware, async (req, res) => {
  try {
    // Try to fetch from NewsAPI (fallback to mock if not available)
    try {
      if (process.env.NEWS_API_KEY && process.env.NEWS_API_KEY !== 'demo') {
        const response = await axios.get('https://newsapi.org/v2/everything', {
          params: {
            q: 'stock market OR finance OR economy',
            sortBy: 'publishedAt',
            pageSize: 20,
            language: 'en',
            apiKey: process.env.NEWS_API_KEY
          }
        });

        if (response.data.status === 'ok' && response.data.articles.length > 0) {
          const articles = response.data.articles.slice(0, 10).map((article, index) => ({
            id: index + 1,
            title: article.title,
            description: article.description,
            source: article.source.name,
            publishedAt: article.publishedAt,
            url: article.url,
            sentiment: Math.random() * 2 - 1 // Random sentiment between -1 and 1
          }));

          return res.json({ articles });
        }
      }
    } catch (error) {
      console.log('NewsAPI error, using mock data');
    }

    // Fallback to mock data
    res.json({ articles: mockNews });
  } catch (error) {
    console.error('News fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch news' });
  }
});

// @route   GET /api/v1/news/sentiment
// @desc    Get aggregated sentiment score
// @access  Private
router.get('/sentiment', authMiddleware, async (req, res) => {
  try {
    // Try to fetch from NewsAPI (fallback to mock if not available)
    try {
      if (process.env.NEWS_API_KEY && process.env.NEWS_API_KEY !== 'demo') {
        const response = await axios.get('https://newsapi.org/v2/everything', {
          params: {
            q: 'stock market OR finance OR economy',
            sortBy: 'publishedAt',
            pageSize: 10,
            language: 'en',
            apiKey: process.env.NEWS_API_KEY
          }
        });

        if (response.data.status === 'ok' && response.data.articles.length > 0) {
          // In a real app, you would run sentiment analysis on the articles
          // For now, we'll generate a mock sentiment score
          const sentimentScore = Math.random() * 2 - 1; // Random between -1 and 1

          return res.json({
            sentiment: sentimentScore,
            confidence: 0.7 + Math.random() * 0.3 // 70-100% confidence
          });
        }
      }
    } catch (error) {
      console.log('NewsAPI error, using mock sentiment');
    }

    // Fallback to mock sentiment
    res.json({
      sentiment: Math.random() * 2 - 1, // Random between -1 and 1
      confidence: 0.8
    });
  } catch (error) {
    console.error('Sentiment analysis error:', error);
    res.status(500).json({ error: 'Failed to analyze sentiment' });
  }
});

module.exports = router;