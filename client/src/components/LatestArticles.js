import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/LatestArticles.css';

function LatestArticles({ user, articles, onArticleUpdate }) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({ title: '', content: '' });
  const [editingArticle, setEditingArticle] = useState(null);
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyContent, setReplyContent] = useState('');

  const handleCreateArticle = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/articles', formData);
      setFormData({ title: '', content: '' });
      setShowCreateForm(false);
      onArticleUpdate();
    } catch (error) {
      console.error('Failed to create article:', error);
    }
  };

  const handleEditArticle = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/articles/${editingArticle.id}`, formData);
      setFormData({ title: '', content: '' });
      setEditingArticle(null);
      onArticleUpdate();
    } catch (error) {
      console.error('Failed to edit article:', error);
    }
  };

  const handleDeleteArticle = async (articleId) => {
    if (window.confirm('Are you sure you want to delete this article?')) {
      try {
        await axios.delete(`/api/articles/${articleId}`);
        onArticleUpdate();
      } catch (error) {
        console.error('Failed to delete article:', error);
      }
    }
  };

  const handleReply = async (articleId) => {
    try {
      await axios.post(`/api/articles/${articleId}/reply`, { content: replyContent });
      setReplyContent('');
      setReplyingTo(null);
      onArticleUpdate();
    } catch (error) {
      console.error('Failed to reply:', error);
    }
  };

  const startEdit = (article) => {
    setEditingArticle(article);
    setFormData({ title: article.title, content: article.content });
  };

  return (
    <div className="latest-articles">
      <div className="section-header">
        <h2>Latest Articles</h2>
        <button
          className="create-btn"
          onClick={() => setShowCreateForm(!showCreateForm)}
        >
          {showCreateForm ? 'Cancel' : 'Create Article'}
        </button>
      </div>

      {showCreateForm && (
        <form onSubmit={handleCreateArticle} className="article-form">
          <input
            type="text"
            placeholder="Article Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
          <textarea
            placeholder="Article Content"
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            required
          />
          <button type="submit">Create Article</button>
        </form>
      )}

      {editingArticle && (
        <form onSubmit={handleEditArticle} className="article-form">
          <input
            type="text"
            placeholder="Article Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
          <textarea
            placeholder="Article Content"
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            required
          />
          <button type="submit">Update Article</button>
          <button type="button" onClick={() => setEditingArticle(null)}>Cancel</button>
        </form>
      )}

      <div className="articles-list">
        {articles.map(article => (
          <div key={article.id} className="article-card">
            <h3>
              <Link to={`/article/${article.id}`}>{article.title}</Link>
            </h3>
            <p className="article-meta">
              By {article.authorUniqueId} on {new Date(article.createdAt).toLocaleDateString()}
            </p>
            <p className="article-preview">{article.content.substring(0, 200)}...</p>

            <div className="article-actions">
              {user.uniqueId === article.authorUniqueId && (
                <>
                  <button onClick={() => startEdit(article)}>Edit</button>
                  <button onClick={() => handleDeleteArticle(article.id)}>Delete</button>
                </>
              )}
              <button onClick={() => setReplyingTo(replyingTo === article.id ? null : article.id)}>
                {replyingTo === article.id ? 'Cancel Reply' : 'Reply'}
              </button>
            </div>

            {replyingTo === article.id && (
              <div className="reply-form">
                <textarea
                  placeholder="Write your reply..."
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                />
                <button onClick={() => handleReply(article.id)}>Submit Reply</button>
              </div>
            )}

            {article.replies && article.replies.length > 0 && (
              <div className="replies">
                <h4>Replies ({article.replies.length})</h4>
                {article.replies.slice(0, 3).map(reply => (
                  <div key={reply.id} className="reply">
                    <p><strong>{reply.authorUniqueId}:</strong> {reply.content}</p>
                    <small>{new Date(reply.createdAt).toLocaleDateString()}</small>
                  </div>
                ))}
                {article.replies.length > 3 && (
                  <Link to={`/article/${article.id}`}>View all {article.replies.length} replies</Link>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default LatestArticles;
