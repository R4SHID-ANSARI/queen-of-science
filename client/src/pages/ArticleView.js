import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/ArticleView.css';

function ArticleView({ user, onLogout }) {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [replyContent, setReplyContent] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArticle();
  }, [id]);

  const fetchArticle = async () => {
    try {
      const response = await axios.get(`/api/articles/${id}`);
      setArticle(response.data);
    } catch (error) {
      console.error('Failed to fetch article:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async () => {
    try {
      await axios.post(`/api/articles/${id}/reply`, { content: replyContent });
      setReplyContent('');
      fetchArticle();
    } catch (error) {
      console.error('Failed to reply:', error);
    }
  };

  if (loading) {
    return <div className="loading">Loading article...</div>;
  }

  if (!article) {
    return <div className="error">Article not found</div>;
  }

  return (
    <div className="article-view">
      <header className="article-header">
        <Link to="/" className="back-btn">← Back to Main</Link>
        <div className="user-info">
          <span>Welcome, {user.uniqueId} ({user.userType})</span>
          <button onClick={onLogout} className="logout-btn">Logout</button>
        </div>
      </header>

      <div className="article-content">
        <h1>{article.title}</h1>
        <div className="article-meta">
          <p>By {article.authorUniqueId}</p>
          <p>Posted on {new Date(article.createdAt).toLocaleDateString()}</p>
          {article.updatedAt && (
            <p>Last updated: {new Date(article.updatedAt).toLocaleDateString()}</p>
          )}
        </div>
        <div className="article-body">
          {article.content.split('\n').map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </div>

      <div className="replies-section">
        <h2>Replies ({article.replies?.length || 0})</h2>

        <div className="reply-form">
          <textarea
            placeholder="Write your reply..."
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
          />
          <button onClick={handleReply} disabled={!replyContent.trim()}>
            Submit Reply
          </button>
        </div>

        <div className="replies-list">
          {article.replies?.map(reply => (
            <div key={reply.id} className="reply">
              <div className="reply-header">
                <strong>{reply.authorUniqueId}</strong>
                <span>{new Date(reply.createdAt).toLocaleDateString()}</span>
              </div>
              <p>{reply.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ArticleView;
