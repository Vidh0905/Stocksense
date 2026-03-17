import axiosInstance from './axiosInstance';

export const watchlistAPI = {
  // Get user's watchlist
  getWatchlist: async () => {
    try {
      const response = await axiosInstance.get('/watchlist');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to fetch watchlist');
    }
  },

  // Add item to watchlist
  addToWatchlist: async (symbol) => {
    try {
      const response = await axiosInstance.post('/watchlist', { symbol });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to add to watchlist');
    }
  },

  // Remove item from watchlist
  removeFromWatchlist: async (id) => {
    try {
      const response = await axiosInstance.delete(`/watchlist/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to remove from watchlist');
    }
  }
};