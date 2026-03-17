import axiosInstance from './axiosInstance';

export const newsAPI = {
  // Get latest news
  getLatestNews: async () => {
    try {
      const response = await axiosInstance.get('/news/latest');
      return response.data.articles;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to fetch news');
    }
  },

  // Get sentiment analysis
  getSentiment: async () => {
    try {
      const response = await axiosInstance.get('/news/sentiment');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to fetch sentiment');
    }
  }
};