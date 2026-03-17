import React, { useState, useEffect } from 'react';
import { stockAPI } from '../api/stockAPI';
import MarketOverview from '../components/MarketOverview';
import WatchlistTable from '../components/WatchlistTable';
import { watchlistAPI } from '../api/watchlistAPI';

const Dashboard = () => {
  const [metrics, setMetrics] = useState({
    portfolioValue: 0,
    dailyChange: 0,
    dailyChangePercent: 0,
    totalGain: 0
  });
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState({
    metrics: true,
    watchlist: true
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading({ metrics: true, watchlist: true });

      // Load watchlist
      const watchlistData = await watchlistAPI.getWatchlist();
      setWatchlist(watchlistData);

      // Calculate portfolio metrics
      let totalValue = 0;
      let totalChange = 0;

      watchlistData.forEach(item => {
        totalValue += item.price || 0;
        totalChange += item.change || 0;
      });

      setMetrics({
        portfolioValue: totalValue,
        dailyChange: totalChange,
        dailyChangePercent: totalValue > 0 ? (totalChange / (totalValue - totalChange)) * 100 : 0,
        totalGain: totalValue * 0.05 // Mock gain
      });

      setLoading({ metrics: false, watchlist: false });
    } catch (err) {
      setError('Failed to load dashboard data');
      setLoading({ metrics: false, watchlist: false });
    }
  };

  const removeFromWatchlist = async (id) => {
    try {
      await watchlistAPI.removeFromWatchlist(id);
      setWatchlist(watchlist.filter(item => item._id !== id));
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

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      {error && (
        <div className="mb-6 rounded-md bg-red-900 p-4">
          <div className="text-sm text-red-300">{error}</div>
        </div>
      )}

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-card rounded-lg p-6 shadow">
          <h3 className="text-gray-400 text-sm font-medium mb-1">Portfolio Value</h3>
          <p className="text-2xl font-bold">
            {loading.metrics ? 'Loading...' : formatCurrency(metrics.portfolioValue)}
          </p>
        </div>

        <div className="bg-card rounded-lg p-6 shadow">
          <h3 className="text-gray-400 text-sm font-medium mb-1">Daily Change</h3>
          <p className="text-2xl font-bold">
            {loading.metrics ? 'Loading...' : formatChange(metrics.dailyChange, metrics.dailyChangePercent)}
          </p>
        </div>

        <div className="bg-card rounded-lg p-6 shadow">
          <h3 className="text-gray-400 text-sm font-medium mb-1">Total Gain</h3>
          <p className="text-2xl font-bold text-green-500">
            {loading.metrics ? 'Loading...' : formatCurrency(metrics.totalGain)}
          </p>
        </div>

        <div className="bg-card rounded-lg p-6 shadow">
          <h3 className="text-gray-400 text-sm font-medium mb-1">Active Positions</h3>
          <p className="text-2xl font-bold">
            {loading.watchlist ? 'Loading...' : watchlist.length}
          </p>
        </div>
      </div>

      {/* Market Overview */}
      <div className="mb-6">
        <MarketOverview loading={loading.watchlist} />
      </div>

      {/* Watchlist */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Your Watchlist</h2>
        </div>
        <WatchlistTable
          watchlist={watchlist}
          loading={loading.watchlist}
          onRemove={removeFromWatchlist}
        />
      </div>
    </div>
  );
};

export default Dashboard;