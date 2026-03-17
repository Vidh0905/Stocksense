import axiosInstance from './axiosInstance';

export const stockAPI = {
  // Get stock quote
  getQuote: async (symbol) => {
    try {
      const response = await axiosInstance.get(`/stocks/quote/${symbol}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to fetch stock quote');
    }
  },

  // Get stock historical data
  getHistory: async (symbol) => {
    try {
      const response = await axiosInstance.get(`/stocks/history/${symbol}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to fetch historical data');
    }
  },

  // Get technical indicators
  getIndicators: async (symbol) => {
    try {
      const response = await axiosInstance.get(`/stocks/indicators/${symbol}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to fetch technical indicators');
    }
  },

  // Search stocks
  searchStocks: async (query) => {
    try {
      const response = await axiosInstance.get(`/stocks/search/${query}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to search stocks');
    }
  }
};