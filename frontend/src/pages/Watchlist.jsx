import React, { useState, useEffect } from 'react';
import { watchlistAPI } from '../api/watchlistAPI';
import WatchlistTable from '../components/WatchlistTable';

const Watchlist = () => {
  const [watchlist, setWatchlist] = useState([]);
  const [newSymbol, setNewSymbol] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadWatchlist();
  }, []);

  const loadWatchlist = async () => {
    try {
      setLoading(true);
      const data = await watchlistAPI.getWatchlist();
      setWatchlist(data);
    } catch (err) {
      setError('Failed to load watchlist');
    } finally {
      setLoading(false);
    }
  };

  const addToWatchlist = async () => {
    if (!newSymbol.trim()) return;

    try {
      const newItem = await watchlistAPI.addToWatchlist(newSymbol.trim().toUpperCase());
      setWatchlist([...watchlist, newItem]);
      setNewSymbol('');
    } catch (err) {
      setError('Failed to add to watchlist: ' + (err.message || 'Unknown error'));
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

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Watchlist</h1>

      {error && (
        <div className="mb-6 rounded-md bg-red-900 p-4">
          <div className="text-sm text-red-300">{error}</div>
        </div>
      )}

      {/* Add to Watchlist Form */}
      <div className="bg-card rounded-lg p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">Add Stock to Watchlist</h2>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-grow">
            <input
              type="text"
              value={newSymbol}
              onChange={(e) => setNewSymbol(e.target.value)}
              placeholder="Enter stock symbol (e.g. AAPL)"
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={addToWatchlist}
            disabled={!newSymbol.trim()}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md disabled:opacity-50"
          >
            Add to Watchlist
          </button>
        </div>
      </div>

      {/* Watchlist Table */}
      <div>
        <WatchlistTable
          watchlist={watchlist}
          loading={loading}
          onRemove={removeFromWatchlist}
        />
      </div>
    </div>
  );
};

export default Watchlist;