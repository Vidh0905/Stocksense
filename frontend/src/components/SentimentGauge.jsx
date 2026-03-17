import React from 'react';

const SentimentGauge = ({ sentiment, confidence, loading }) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Convert sentiment score (-1 to 1) to angle (0 to 180 degrees)
  const angle = ((sentiment + 1) / 2) * 180;

  // Determine color based on sentiment
  let color;
  if (sentiment > 0.3) {
    color = '#22c55e'; // Green for positive
  } else if (sentiment < -0.3) {
    color = '#ef4444'; // Red for negative
  } else {
    color = '#f59e0b'; // Yellow for neutral
  }

  return (
    <div className="bg-card p-6 rounded-lg flex flex-col items-center">
      <h3 className="text-lg font-medium mb-4">Market Sentiment</h3>

      <div className="relative w-48 h-24 mb-4">
        {/* Gauge background */}
        <svg width="192" height="96" viewBox="0 0 192 96">
          <path
            d="M 10 90 A 86 86 0 0 1 182 90"
            fill="none"
            stroke="#334155"
            strokeWidth="8"
            strokeLinecap="round"
          />

          {/* Sentiment arc */}
          <path
            d="M 10 90 A 86 86 0 0 1 182 90"
            fill="none"
            stroke="url(#gradient)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray="270"
            strokeDashoffset="270"
            transform="rotate(180, 96, 90)"
          />

          {/* Gradient definition */}
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ef4444" />
              <stop offset="50%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#22c55e" />
            </linearGradient>
          </defs>

          {/* Indicator needle */}
          <line
            x1="96"
            y1="90"
            x2={96 + 70 * Math.cos((angle - 90) * Math.PI / 180)}
            y2={90 + 70 * Math.sin((angle - 90) * Math.PI / 180)}
            stroke="#f1f5f9"
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* Center circle */}
          <circle cx="96" cy="90" r="4" fill="#f1f5f9" />
        </svg>
      </div>

      {/* Labels */}
      <div className="flex justify-between w-full text-xs text-gray-400 mb-2">
        <span>Bearish</span>
        <span>Neutral</span>
        <span>Bullish</span>
      </div>

      {/* Sentiment value */}
      <div className="text-center">
        <p className="text-2xl font-bold" style={{ color }}>
          {sentiment > 0 ? '+' : ''}{(sentiment * 100).toFixed(1)}%
        </p>
        <p className="text-sm text-gray-400">
          Confidence: {(confidence * 100).toFixed(1)}%
        </p>
      </div>
    </div>
  );
};

export default SentimentGauge;