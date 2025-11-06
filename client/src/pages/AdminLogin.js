/**
 * Admin Login Page
 * Login form for administrators
 */

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import '../styles/Auth.css';

const AdminLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authAPI.login(formData);
      
      // Check if user is admin
      if (response.data.role !== 'admin') {
        setError('Access denied. This is for administrators only.');
        setLoading(false);
        return;
      }

      login(response.data, response.data.token);
      navigate('/admin-dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card auth-card-small admin-card">
        <div className="auth-header">
          <h1>🧑‍💼 FitSync Admin</h1>
          <h2>Administrator Access</h2>
          <p>Login to manage the platform</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Admin Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="admin@fitsync.com"
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Admin Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter admin password"
              autoComplete="current-password"
            />
          </div>

          <button type="submit" className="btn btn-admin btn-full" disabled={loading}>
            {loading ? 'Verifying...' : '🔐 Admin Login'}
          </button>
        </form>

        <div className="demo-credentials">
          <p><strong>Demo Admin:</strong></p>
          <p>📧 admin@fitsync.com</p>
          <p>🔒 admin123</p>
        </div>

        <div className="auth-footer">
          <p>
            <Link to="/">← Back to Home</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
