import React, { useState } from 'react';
import { predictionAPI } from '../api/predictionAPI';
import PredictionChart from '../components/PredictionChart';
import TechnicalIndicators from '../components/TechnicalIndicators';

const Predictions = () => {
  const [symbol, setSymbol] = useState('');
  const [predictionData, setPredictionData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!symbol.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const data = await predictionAPI.getPredictions(symbol.trim().toUpperCase());
      setPredictionData(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch predictions');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">AI Predictions</h1>

      {/* Prediction Form */}
      <div className="bg-card rounded-lg p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">Generate Predictions</h2>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
          <div className="flex-grow">
            <input
              type="text"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              placeholder="Enter stock symbol (e.g. AAPL)"
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !symbol.trim()}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md disabled:opacity-50"
          >
            {loading ? 'Generating...' : 'Generate'}
          </button>
        </form>
      </div>

      {error && (
        <div className="mb-6 rounded-md bg-red-900 p-4">
          <div className="text-sm text-red-300">{error}</div>
        </div>
      )}

      {predictionData && (
        <>
          {/* Prediction Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-card rounded-lg p-6">
              <h3 className="text-gray-400 text-sm mb-1">Current Price</h3>
              <p className="text-2xl font-bold">${predictionData.currentPrice?.toFixed(2)}</p>
            </div>
            <div className="bg-card rounded-lg p-6">
              <h3 className="text-gray-400 text-sm mb-1">Predicted Trend</h3>
              <p className={`text-2xl font-bold ${
                predictionData.trend === 'bullish' ? 'text-green-500' :
                predictionData.trend === 'bearish' ? 'text-red-500' : 'text-yellow-500'
              }`}>
                {predictionData.trend?.charAt(0).toUpperCase() + predictionData.trend?.slice(1)}
              </p>
            </div>
            <div className="bg-card rounded-lg p-6">
              <h3 className="text-gray-400 text-sm mb-1">Model Confidence</h3>
              <p className="text-2xl font-bold text-blue-400">{(predictionData.confidence * 100)?.toFixed(1)}%</p>
            </div>
          </div>

          {/* Prediction Chart */}
          <div className="mb-6">
            <PredictionChart
              historicalData={[]} // We could fetch historical data here if needed
              predictionData={predictionData.predictions}
              loading={loading}
            />
          </div>

          {/* Prediction Details */}
          <div className="bg-card rounded-lg p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">7-Day Forecast</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Predicted Price</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Confidence</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Trend</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {predictionData.predictions.map((pred, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                        {new Date(pred.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-200">
                        ${pred.predictedPrice?.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-200">
                        {(pred.confidence * 100)?.toFixed(1)}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          pred.trend === 'bullish' ? 'bg-green-800 text-green-300' :
                          pred.trend === 'bearish' ? 'bg-red-800 text-red-300' : 'bg-yellow-800 text-yellow-300'
                        }`}>
                          {pred.trend?.charAt(0).toUpperCase() + pred.trend?.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Technical Indicators */}
          <div>
            <TechnicalIndicators indicators={predictionData.technicalIndicators} loading={false} />
          </div>
        </>
      )}
    </div>
  );
};

export default Predictions;