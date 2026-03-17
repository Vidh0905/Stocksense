import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: '📊' },
    { name: 'Predictions', path: '/predictions', icon: '🔮' },
    { name: 'News & Sentiment', path: '/news', icon: '📰' },
    { name: 'Watchlist', path: '/watchlist', icon: '⭐' },
  ];

  return (
    <div className="fixed left-0 top-16 bottom-0 w-64 bg-secondary border-r border-gray-700 z-40 overflow-y-auto">
      <nav className="mt-5 px-2 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`${
              isActive(item.path)
                ? 'bg-blue-600 text-white'
                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
            } group flex items-center px-2 py-2 text-base font-medium rounded-md transition duration-150 ease-in-out`}
          >
            <span className="mr-3 text-lg">{item.icon}</span>
            {item.name}
          </Link>
        ))}
      </nav>

      <div className="absolute bottom-0 w-full p-4 border-t border-gray-700">
        <div className="text-xs text-gray-500">
          <p>StockSense v1.0</p>
          <p className="mt-1">AI-Powered Insights</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;