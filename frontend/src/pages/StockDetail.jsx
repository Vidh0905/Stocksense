import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { stockAPI } from '../api/stockAPI';
import StockChart from '../components/StockChart';
import TechnicalIndicators from '../components/TechnicalIndicators';
import PredictionChart from '../components/PredictionChart';
import { predictionAPI } from '../api/predictionAPI';
import { watchlistAPI } from '../api/watchlistAPI';
import NewsCard from '../components/NewsCard';
import { newsAPI } from '../api/newsAPI';

const StockDetail = () => {
  const { symbol } = useParams();
  const [stockData, setStockData] = useState(null);
  const [historicalData, setHistoricalData] = useState([]);
  const [indicators, setIndicators] = useState(null);
  const [predictionData, setPredictionData] = useState(null);
  const [news, setNews] = useState([]);
  const [activeTab, setActiveTab] = useState('analysis');
  const [loading, setLoading] = useState({
    quote: true,
    history: true,
    indicators: true,
    predictions: true,
    news: true
  });
  const [error, setError] = useState(null);
  const [inWatchlist, setInWatchlist] = useState(false);

  useEffect(() => {
    loadStockData();
    loadNews();
  }, [symbol]);

  const loadStockData = async () => {
    try {
      setLoading({
        quote: true,
        history: true,
        indicators: true,
        predictions: true,
        news: true
      });

      // Load quote data
      const quoteData = await stockAPI.getQuote(symbol);
      setStockData(quoteData);
      setLoading(prev => ({ ...prev, quote: false }));

      // Load historical data
      const historyData = await stockAPI.getHistory(symbol);
      setHistoricalData(historyData);
      setLoading(prev => ({ ...prev, history: false }));

      // Load indicators
      const indicatorsData = await stockAPI.getIndicators(symbol);
      setIndicators(indicatorsData);
      setLoading(prev => ({ ...prev, indicators: false }));

      // Load predictions
      const predictionResult = await predictionAPI.getPredictions(symbol);
      setPredictionData(predictionResult);
      setLoading(prev => ({ ...prev, predictions: false }));
    } catch (err) {
      setError('Failed to load stock data');
      setLoading({
        quote: false,
        history: false,
        indicators: false,
        predictions: false,
        news: false
      });
    }
  };

  const loadNews = async () => {
    try {
      const newsData = await newsAPI.getLatestNews();
      // Filter news related to this stock (mock implementation)
      const filteredNews = newsData.slice(0, 5);
      setNews(filteredNews);
      setLoading(prev => ({ ...prev, news: false }));
    } catch (err) {
      setError('Failed to load news');
      setLoading(prev => ({ ...prev, news: false }));
    }
  };

  const addToWatchlist = async () => {
    try {
      await watchlistAPI.addToWatchlist(symbol);
      setInWatchlist(true);
    } catch (err) {
      setError('Failed to add to watchlist');
    }
  };

  const removeFromWatchlist = async () => {
    try {
      // In a real app, you would find the watchlist item ID
      // For now, we'll just toggle the state
      setInWatchlist(false);
    } catch (err) {
      setError('Failed to remove from watchlist');
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  const formatChange = (change, changePercent) => {
    const sign = change >= 0 ? '+' : '';
    const color = change >= 0 ? 'text-green-500' : 'text-red-500';
    return (
      <span className={color}>
        {sign}{change?.toFixed(2)} ({sign}{changePercent?.toFixed(2)}%)
      </span>
    );
  };

  if (error) {
    return (
      <div className="p-6">
        <div className="rounded-md bg-red-900 p-4">
          <div className="text-sm text-red-300">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Stock Header */}
      <div className="bg-card rounded-lg p-6 mb-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center">
          <div>
            <h1 className="text-2xl font-bold">{stockData?.name || symbol}</h1>
            <p className="text-gray-400">{stockData?.symbol || symbol}</p>
          </div>
          <div className="mt-4 md:mt-0 text-right">
            <p className="text-3xl font-bold">{stockData ? formatCurrency(stockData.price) : 'Loading...'}</p>
            <p className="text-lg">
              {stockData ? formatChange(stockData.change, stockData.changePercent) : 'Loading...'}
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <button
              onClick={inWatchlist ? removeFromWatchlist : addToWatchlist}
              className={`px-4 py-2 rounded-md ${
                inWatchlist
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {inWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-700 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('analysis')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'analysis'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
            }`}
          >
            Technical Analysis
          </button>
          <button
            onClick={() => setActiveTab('prediction')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'prediction'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
            }`}
          >
            AI Prediction
          </button>
          <button
            onClick={() => setActiveTab('news')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'news'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
            }`}
          >
            News & Sentiment
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'analysis' && (
        <div>
          <div className="mb-6">
            <StockChart data={historicalData} loading={loading.history} />
          </div>
          <div>
            <TechnicalIndicators indicators={indicators} loading={loading.indicators} />
          </div>
        </div>
      )}

      {activeTab === 'prediction' && (
        <div>
          <div className="bg-card rounded-lg p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Price Predictions</h2>
            {predictionData && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-800 p-4 rounded-lg">
                  <h3 className="text-gray-400 text-sm mb-1">Current Price</h3>
                  <p className="text-2xl font-bold">${predictionData.currentPrice?.toFixed(2)}</p>
                </div>
                <div className="bg-gray-800 p-4 rounded-lg">
                  <h3 className="text-gray-400 text-sm mb-1">Trend</h3>
                  <p className={`text-2xl font-bold ${
                    predictionData.trend === 'bullish' ? 'text-green-500' :
                    predictionData.trend === 'bearish' ? 'text-red-500' : 'text-yellow-500'
                  }`}>
                    {predictionData.trend?.charAt(0).toUpperCase() + predictionData.trend?.slice(1)}
                  </p>
                </div>
                <div className="bg-gray-800 p-4 rounded-lg">
                  <h3 className="text-gray-400 text-sm mb-1">Confidence</h3>
                  <p className="text-2xl font-bold text-blue-400">{(predictionData.confidence * 100)?.toFixed(1)}%</p>
                </div>
              </div>
            )}
          </div>
          <div>
            <PredictionChart
              historicalData={historicalData}
              predictionData={predictionData?.predictions}
              loading={loading.predictions}
            />
          </div>
        </div>
      )}

      {activeTab === 'news' && (
        <div>
          <div className="mb-6">
            <h2 className="text-xl font-bold mb-4">Latest News</h2>
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
      )}
    </div>
  );
};

export default StockDetail;