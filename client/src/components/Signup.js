import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/Auth.css';

function Signup({ onLogin }) {
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    uniqueId: '',
    password: '',
    userType: 'Student'
  });
  const [contactMethod, setContactMethod] = useState('email');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleContactMethodChange = (method) => {
    setContactMethod(method);
    setFormData({
      ...formData,
      email: method === 'email' ? formData.email : '',
      phone: method === 'phone' ? formData.phone : ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const signupData = {
      ...formData,
      email: contactMethod === 'email' ? formData.email : null,
      phone: contactMethod === 'phone' ? formData.phone : null
    };

    try {
      await axios.post('/api/auth/signup', signupData);
      // Auto-login after signup
      const loginResponse = await axios.post('/api/auth/login', {
        identifier: formData.uniqueId,
        password: formData.password
      });
      onLogin(loginResponse.data.user);
    } catch (error) {
      setError(error.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">Queen of Science</h1>
        <h2 className="auth-subtitle">Sign Up</h2>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Contact Method</label>
            <div className="contact-method">
              <label>
                <input
                  type="radio"
                  value="email"
                  checked={contactMethod === 'email'}
                  onChange={() => handleContactMethodChange('email')}
                />
                Email
              </label>
              <label>
                <input
                  type="radio"
                  value="phone"
                  checked={contactMethod === 'phone'}
                  onChange={() => handleContactMethodChange('phone')}
                />
                Phone
              </label>
            </div>
          </div>

          {contactMethod === 'email' ? (
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Enter your email"
              />
            </div>
          ) : (
            <div className="form-group">
              <label htmlFor="phone">Phone</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                placeholder="Enter your phone number"
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="uniqueId">Unique ID Name</label>
            <input
              type="text"
              id="uniqueId"
              name="uniqueId"
              value={formData.uniqueId}
              onChange={handleChange}
              required
              placeholder="Choose a unique ID"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Choose a password"
            />
          </div>

          <div className="form-group">
            <label htmlFor="userType">User Type</label>
            <select
              id="userType"
              name="userType"
              value={formData.userType}
              onChange={handleChange}
            >
              <option value="Student">Student</option>
              <option value="Member">Member</option>
            </select>
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? 'Signing up...' : 'Sign Up'}
          </button>
        </form>

        <div className="auth-links">
          <p>Already have an account? <Link to="/login">Login</Link></p>
        </div>
      </div>
    </div>
  );
}

export default Signup;
