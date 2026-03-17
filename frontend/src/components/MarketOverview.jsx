import React from 'react';
import { useNavigate } from 'react-router-dom';

const MarketOverview = ({ stocks, loading }) => {
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!stocks || stocks.length === 0) {
    return (
      <div className="bg-card rounded-lg p-8 text-center">
        <p className="text-gray-400">No market data available</p>
      </div>
    );
  }

  const handleStockClick = (symbol) => {
    navigate(`/stock/${symbol}`);
  };

  const formatChange = (change, changePercent) => {
    const sign = change >= 0 ? '+' : '';
    const color = change >= 0 ? 'text-green-500' : 'text-red-500';
    return (
      <div className={color}>
        {sign}{change?.toFixed(2)} ({sign}{changePercent?.toFixed(2)}%)
      </div>
    );
  };

  // Sample popular stocks data
  const popularStocks = [
    { symbol: 'AAPL', name: 'Apple Inc.', price: 175.50, change: 2.35, changePercent: 1.36 },
    { symbol: 'TSLA', name: 'Tesla Inc.', price: 250.75, change: -5.25, changePercent: -2.05 },
    { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 170.25, change: 1.80, changePercent: 1.07 },
    { symbol: 'MSFT', name: 'Microsoft Corp.', price: 415.30, change: 3.45, changePercent: 0.84 },
    { symbol: 'AMZN', name: 'Amazon.com Inc.', price: 180.45, change: -1.20, changePercent: -0.66 },
    { symbol: 'NVDA', name: 'NVIDIA Corp.', price: 950.20, change: 15.30, changePercent: 1.64 }
  ];

  return (
    <div className="bg-card rounded-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-700">
        <h3 className="text-lg font-medium">Market Overview</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Symbol</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Price</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Change</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {popularStocks.map((stock) => (
              <tr
                key={stock.symbol}
                className="hover:bg-gray-800 cursor-pointer"
                onClick={() => handleStockClick(stock.symbol)}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-blue-400">{stock.symbol}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-200">{stock.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <div className="text-sm text-gray-200">${stock.price?.toFixed(2)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <div className="text-sm">
                    {formatChange(stock.change, stock.changePercent)}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MarketOverview;