import axiosInstance from './axiosInstance';

export const predictionAPI = {
  // Get stock predictions
  getPredictions: async (symbol) => {
    try {
      const response = await axiosInstance.post('/predictions/predict', { symbol });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to fetch predictions');
    }
  }
};