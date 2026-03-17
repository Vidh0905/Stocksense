import React from 'react';
import { useNavigate } from 'react-router-dom';

const WatchlistTable = ({ watchlist, loading, onRemove }) => {
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!watchlist || watchlist.length === 0) {
    return (
      <div className="bg-card rounded-lg p-8 text-center">
        <p className="text-gray-400">Your watchlist is empty</p>
        <p className="text-gray-500 text-sm mt-2">Add stocks to your watchlist to track them here</p>
      </div>
    );
  }

  const handleRowClick = (symbol) => {
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

  return (
    <div className="bg-card rounded-lg overflow-hidden">
      <table className="min-w-full divide-y divide-gray-700">
        <thead>
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Symbol</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Name</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Price</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Change</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-700">
          {watchlist.map((item) => (
            <tr
              key={item._id}
              className="hover:bg-gray-800 cursor-pointer"
              onClick={() => handleRowClick(item.symbol)}
            >
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-blue-400">{item.symbol}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-200">{item.name}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right">
                <div className="text-sm text-gray-200">${item.price?.toFixed(2)}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right">
                <div className="text-sm">
                  {formatChange(item.change, item.changePercent)}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemove(item._id);
                  }}
                  className="text-red-500 hover:text-red-400"
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default WatchlistTable;