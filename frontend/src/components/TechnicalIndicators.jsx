import React from 'react';

const TechnicalIndicators = ({ indicators, loading }) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!indicators) {
    return (
      <div className="bg-card p-4 rounded-lg">
        <p className="text-gray-400 text-center">No indicators available</p>
      </div>
    );
  }

  // Determine trend based on moving averages
  const trend = indicators.ma20 > indicators.ma50 ? 'bullish' : 'bearish';

  return (
    <div className="bg-card rounded-lg p-4">
      <h3 className="text-lg font-medium mb-4">Technical Indicators</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-800 p-3 rounded">
          <div className="flex justify-between items-center">
            <span className="text-gray-400">MA 20</span>
            <span className="font-medium">${indicators.ma20?.toFixed(2)}</span>
          </div>
        </div>

        <div className="bg-gray-800 p-3 rounded">
          <div className="flex justify-between items-center">
            <span className="text-gray-400">MA 50</span>
            <span className="font-medium">${indicators.ma50?.toFixed(2)}</span>
          </div>
        </div>

        <div className="bg-gray-800 p-3 rounded">
          <div className="flex justify-between items-center">
            <span className="text-gray-400">RSI (14)</span>
            <span className={`font-medium ${
              indicators.rsi > 70 ? 'text-red-500' :
              indicators.rsi < 30 ? 'text-green-500' : 'text-yellow-500'
            }`}>
              {indicators.rsi?.toFixed(2)}
            </span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-1.5 mt-1">
            <div
              className="bg-blue-500 h-1.5 rounded-full"
              style={{ width: `${Math.min(100, Math.max(0, indicators.rsi))}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-gray-800 p-3 rounded">
          <div className="flex justify-between items-center">
            <span className="text-gray-400">MACD</span>
            <span className={`font-medium ${
              indicators.macd > 0 ? 'text-green-500' : 'text-red-500'
            }`}>
              {indicators.macd?.toFixed(2)}
            </span>
          </div>
        </div>

        <div className="bg-gray-800 p-3 rounded">
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Volume</span>
            <span className="font-medium">
              {indicators.volume?.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="bg-gray-800 p-3 rounded">
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Trend</span>
            <span className={`font-medium ${
              trend === 'bullish' ? 'text-green-500' : 'text-red-500'
            }`}>
              {trend.charAt(0).toUpperCase() + trend.slice(1)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TechnicalIndicators;