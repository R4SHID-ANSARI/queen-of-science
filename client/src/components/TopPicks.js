import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/TopPicks.css';

function TopPicks({ articles }) {
  // Get top 5-6 articles based on reply count or recency
  const topPicks = articles
    .sort((a, b) => (b.replies?.length || 0) - (a.replies?.length || 0))
    .slice(0, 6);

  return (
    <div className="top-picks">
      <h2>Top Picks of the Day</h2>
      <div className="picks-grid">
        {topPicks.map(article => (
          <div key={article.id} className="pick-card">
            <h3>
              <Link to={`/article/${article.id}`}>{article.title}</Link>
            </h3>
            <p className="pick-preview">
              {article.content.substring(0, 100)}...
            </p>
            <p className="pick-meta">
              By {article.authorUniqueId} • {article.replies?.length || 0} replies
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TopPicks;
