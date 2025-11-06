/**
 * Home Page
 * Landing page with navigation to login and register
 */

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Home.css';

const Home = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (isAuthenticated) {
      if (isAdmin) {
        navigate('/admin-dashboard');
      } else {
        navigate('/dashboard');
      }
    }
  }, [isAuthenticated, isAdmin, navigate]);

  return (
    <div className="home-container">
      <div className="home-content">
        <div className="home-hero">
          <h1 className="home-title">
            <span className="gradient-text">💪 FitSync</span>
          </h1>
          <p className="home-subtitle">Your Personal Fitness & Diet Companion</p>
          <p className="home-description">
            Track workouts, monitor nutrition, and achieve your fitness goals with personalized
            recommendations tailored just for you.
          </p>
        </div>

        <div className="home-features">
          <div className="feature-card">
            <span className="feature-icon">🏋️</span>
            <h3>Track Workouts</h3>
            <p>Log and monitor your exercise routines with detailed statistics</p>
          </div>
          <div className="feature-card">
            <span className="feature-icon">🍽️</span>
            <h3>Nutrition Tracking</h3>
            <p>Keep track of meals and macros to optimize your diet</p>
          </div>
          <div className="feature-card">
            <span className="feature-icon">📊</span>
            <h3>Progress Analytics</h3>
            <p>Visualize your fitness journey with charts and insights</p>
          </div>
          <div className="feature-card">
            <span className="feature-icon">🎯</span>
            <h3>Personalized Plans</h3>
            <p>Get customized recommendations based on your goals</p>
          </div>
        </div>

        <div className="home-actions">
          <div className="action-group">
            <h3>New User?</h3>
            <Link to="/register" className="btn btn-primary">
              🧍‍♂️ Create Account
            </Link>
          </div>
          <div className="action-group">
            <h3>Existing User?</h3>
            <Link to="/user-login" className="btn btn-secondary">
              🔑 User Login
            </Link>
          </div>
          <div className="action-group">
            <h3>Administrator?</h3>
            <Link to="/admin-login" className="btn btn-admin">
              🧑‍💼 Admin Login
            </Link>
          </div>
        </div>
      </div>

      <footer className="home-footer">
        <p>© 2025 FitSync. Your journey to a healthier you starts here.</p>
      </footer>
    </div>
  );
};

export default Home;
