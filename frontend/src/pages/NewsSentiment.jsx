import React, { useState, useEffect } from 'react';
import { newsAPI } from '../api/newsAPI';
import NewsCard from '../components/NewsCard';
import SentimentGauge from '../components/SentimentGauge';

const NewsSentiment = () => {
  const [news, setNews] = useState([]);
  const [sentiment, setSentiment] = useState(null);
  const [loading, setLoading] = useState({
    news: true,
    sentiment: true
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    loadNews();
    loadSentiment();
  }, []);

  const loadNews = async () => {
    try {
      setLoading(prev => ({ ...prev, news: true }));
      const newsData = await newsAPI.getLatestNews();
      setNews(newsData);
      setLoading(prev => ({ ...prev, news: false }));
    } catch (err) {
      setError('Failed to load news');
      setLoading(prev => ({ ...prev, news: false }));
    }
  };

  const loadSentiment = async () => {
    try {
      setLoading(prev => ({ ...prev, sentiment: true }));
      const sentimentData = await newsAPI.getSentiment();
      setSentiment(sentimentData);
      setLoading(prev => ({ ...prev, sentiment: false }));
    } catch (err) {
      setError('Failed to load sentiment');
      setLoading(prev => ({ ...prev, sentiment: false }));
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">News & Sentiment</h1>

      {error && (
        <div className="mb-6 rounded-md bg-red-900 p-4">
          <div className="text-sm text-red-300">{error}</div>
        </div>
      )}

      {/* Sentiment Gauge */}
      <div className="mb-6">
        <SentimentGauge
          sentiment={sentiment?.sentiment || 0}
          confidence={sentiment?.confidence || 0}
          loading={loading.sentiment}
        />
      </div>

      {/* News Feed */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Latest Financial News</h2>
        </div>
        {loading.news ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : news.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {news.map((article, index) => (
              <NewsCard key={index} article={article} />
            ))}
          </div>
        ) : (
          <div className="bg-card rounded-lg p-8 text-center">
            <p className="text-gray-400">No news available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsSentiment;