import React from 'react';
import {
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const PredictionChart = ({ historicalData, predictionData, loading }) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if ((!historicalData || historicalData.length === 0) && (!predictionData || predictionData.length === 0)) {
    return (
      <div className="flex justify-center items-center h-64 bg-card rounded-lg">
        <p className="text-gray-400">No data available</p>
      </div>
    );
  }

  // Combine historical and prediction data
  const combinedData = [];

  // Add historical data
  if (historicalData && historicalData.length > 0) {
    historicalData.forEach(item => {
      combinedData.push({
        date: item.date,
        historical: item.close,
        prediction: null
      });
    });
  }

  // Add prediction data
  if (predictionData && predictionData.length > 0) {
    predictionData.forEach(item => {
      combinedData.push({
        date: item.date,
        historical: null,
        prediction: item.predictedPrice
      });
    });
  }

  return (
    <div className="bg-card p-4 rounded-lg">
      <ResponsiveContainer width="100%" height={400}>
        <ComposedChart
          data={combinedData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis
            dataKey="date"
            stroke="#94a3b8"
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => {
              const date = new Date(value);
              return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            }}
          />
          <YAxis stroke="#94a3b8" domain={['auto', 'auto']} />
          <Tooltip
            contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155' }}
            labelStyle={{ color: '#f1f5f9' }}
            formatter={(value, name) => {
              if (value !== null) {
                return [`$${parseFloat(value).toFixed(2)}`, name === 'historical' ? 'Historical' : 'Predicted'];
              }
              return [];
            }}
          />
          <Legend />
          {historicalData && historicalData.length > 0 && (
            <Line
              type="monotone"
              dataKey="historical"
              stroke="#3b82f6"
              name="Historical Price"
              dot={false}
              strokeWidth={2}
            />
          )}
          {predictionData && predictionData.length > 0 && (
            <Line
              type="monotone"
              dataKey="prediction"
              stroke="#22c55e"
              name="Predicted Price"
              dot={false}
              strokeWidth={2}
              strokeDasharray="5 5"
            />
          )}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PredictionChart;