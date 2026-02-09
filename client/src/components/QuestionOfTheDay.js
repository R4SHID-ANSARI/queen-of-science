import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/QuestionOfTheDay.css';

function QuestionOfTheDay({ user }) {
  const [question, setQuestion] = useState(null);
  const [replyContent, setReplyContent] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({ title: '', content: '' });

  useEffect(() => {
    fetchQuestion();
  }, []);

  const fetchQuestion = async () => {
    try {
      const response = await axios.get('/api/questions');
      setQuestion(response.data);
    } catch (error) {
      console.error('Failed to fetch question:', error);
    }
  };

  const handleCreateQuestion = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/questions', formData);
      setFormData({ title: '', content: '' });
      setShowCreateForm(false);
      fetchQuestion();
    } catch (error) {
      console.error('Failed to create question:', error);
    }
  };

  const handleReply = async () => {
    try {
      await axios.post('/api/questions/reply', { content: replyContent });
      setReplyContent('');
      fetchQuestion();
    } catch (error) {
      console.error('Failed to reply:', error);
    }
  };

  return (
    <div className="question-of-the-day">
      <h2>Question of the Day</h2>

      {user.userType === 'Member' && (
        <div className="create-section">
          <button
            className="create-btn"
            onClick={() => setShowCreateForm(!showCreateForm)}
          >
            {showCreateForm ? 'Cancel' : 'Create Question'}
          </button>

          {showCreateForm && (
            <form onSubmit={handleCreateQuestion} className="question-form">
              <input
                type="text"
                placeholder="Question Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
              <textarea
                placeholder="Question Content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                required
              />
              <button type="submit">Create Question</button>
            </form>
          )}
        </div>
      )}

      {question && question.id ? (
        <div className="question-card">
          <h3>{question.title}</h3>
          <p>{question.content}</p>
          <p className="question-meta">
            Posted by {question.authorUniqueId} on {new Date(question.createdAt).toLocaleDateString()}
          </p>

          <div className="reply-section">
            <textarea
              placeholder="Write your reply..."
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
            />
            <button onClick={handleReply} disabled={!replyContent.trim()}>
              Submit Reply
            </button>
          </div>

          {question.replies && question.replies.length > 0 && (
            <div className="replies">
              <h4>Replies ({question.replies.length})</h4>
              {question.replies.map(reply => (
                <div key={reply.id} className="reply">
                  <p><strong>{reply.authorUniqueId}:</strong> {reply.content}</p>
                  <small>{new Date(reply.createdAt).toLocaleDateString()}</small>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <p>No question for today. {user.userType === 'Member' ? 'Create one!' : 'Check back later.'}</p>
      )}
    </div>
  );
}

export default QuestionOfTheDay;
