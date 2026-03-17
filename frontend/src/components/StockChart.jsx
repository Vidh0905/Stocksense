import React from 'react';
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const StockChart = ({ data, loading }) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex justify-center items-center h-64 bg-card rounded-lg">
        <p className="text-gray-400">No data available</p>
      </div>
    );
  }

  // Format data for chart
  const chartData = data.map(item => ({
    date: item.date,
    close: item.close,
    ma20: item.ma20,
    ma50: item.ma50,
    volume: item.volume
  }));

  return (
    <div className="bg-card p-4 rounded-lg">
      <ResponsiveContainer width="100%" height={400}>
        <ComposedChart
          data={chartData}
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
          <YAxis yAxisId="price" stroke="#94a3b8" domain={['auto', 'auto']} />
          <YAxis yAxisId="volume" orientation="right" stroke="#94a3b8" domain={[0, 'dataMax']} />
          <Tooltip
            contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155' }}
            labelStyle={{ color: '#f1f5f9' }}
            formatter={(value, name) => {
              if (name === 'volume') {
                return [value.toLocaleString(), 'Volume'];
              }
              return [`$${value.toFixed(2)}`, name.toUpperCase()];
            }}
          />
          <Legend />
          <Line
            yAxisId="price"
            type="monotone"
            dataKey="close"
            stroke="#3b82f6"
            name="Close Price"
            dot={false}
            strokeWidth={2}
          />
          <Line
            yAxisId="price"
            type="monotone"
            dataKey="ma20"
            stroke="#f59e0b"
            name="MA 20"
            dot={false}
            strokeWidth={1}
            strokeDasharray="3 3"
          />
          <Line
            yAxisId="price"
            type="monotone"
            dataKey="ma50"
            stroke="#8b5cf6"
            name="MA 50"
            dot={false}
            strokeWidth={1}
            strokeDasharray="3 3"
          />
          <Bar
            yAxisId="volume"
            dataKey="volume"
            fill="#4ade80"
            name="Volume"
            opacity={0.3}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StockChart;