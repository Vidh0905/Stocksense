import React from 'react';

const NewsCard = ({ article }) => {
  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) {
      return `${diffInSeconds} seconds ago`;
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    }
  };

  // Determine sentiment color
  const getSentimentColor = (sentiment) => {
    if (sentiment > 0.3) {
      return 'text-green-500';
    } else if (sentiment < -0.3) {
      return 'text-red-500';
    } else {
      return 'text-yellow-500';
    }
  };

  // Get sentiment label
  const getSentimentLabel = (sentiment) => {
    if (sentiment > 0.3) {
      return 'Bullish';
    } else if (sentiment < -0.3) {
      return 'Bearish';
    } else {
      return 'Neutral';
    }
  };

  return (
    <div className="bg-card rounded-lg p-4 hover:bg-gray-800 transition duration-150 ease-in-out">
      <a href={article.url} target="_blank" rel="noopener noreferrer" className="block">
        <div className="flex justify-between items-start">
          <h3 className="font-semibold text-lg mb-2 hover:text-blue-400 transition duration-150 ease-in-out">
            {article.title}
          </h3>
          {article.sentiment !== undefined && (
            <span className={`text-sm font-medium ${getSentimentColor(article.sentiment)}`}>
              {getSentimentLabel(article.sentiment)}
            </span>
          )}
        </div>
        <p className="text-gray-400 text-sm mb-3 line-clamp-2">
          {article.description}
        </p>
        <div className="flex justify-between items-center text-xs text-gray-500">
          <span>{article.source}</span>
          <span>{formatDate(article.publishedAt)}</span>
        </div>
      </a>
    </div>
  );
};

export default NewsCard;