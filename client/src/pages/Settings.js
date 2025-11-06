/**
 * Settings Page
 * User profile settings and account management
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import '../styles/Settings.css';

const Settings = () => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    age: '',
    gender: '',
    height: '',
    weight: '',
    goal: '',
    activityLevel: '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        age: user.age || '',
        gender: user.gender || '',
        height: user.height || '',
        weight: user.weight || '',
        goal: user.goal || 'maintenance',
        activityLevel: user.activityLevel || 'moderate',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
    setSuccess('');
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    setError('');
    setSuccess('');
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await authAPI.updateProfile(formData);
      updateUser(response.data);
      setSuccess('Profile updated successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      await authAPI.updateProfile({ password: passwordData.newPassword });
      setSuccess('Password updated successfully!');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  const getBMICategory = (bmi) => {
    if (!bmi) return { text: 'Unknown', color: '#999' };
    if (bmi < 18.5) return { text: 'Underweight', color: '#FFB74D' };
    if (bmi < 25) return { text: 'Normal', color: '#66BB6A' };
    if (bmi < 30) return { text: 'Overweight', color: '#FFA726' };
    return { text: 'Obese', color: '#EF5350' };
  };

  const bmiCategory = getBMICategory(user?.bmi);

  return (
    <div className="settings-page">
      <div className="page-header">
        <h1>⚙️ Settings</h1>
        <p>Manage your profile and account settings</p>
      </div>

      {success && <div className="alert alert-success">{success}</div>}
      {error && <div className="alert alert-error">{error}</div>}

      <div className="settings-grid">
        {/* Profile Information */}
        <div className="settings-card">
          <h2>👤 Profile Information</h2>
          <form onSubmit={handleProfileSubmit}>
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="age">Age</label>
                <input
                  type="number"
                  id="age"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  min="10"
                  max="120"
                />
              </div>

              <div className="form-group">
                <label htmlFor="gender">Gender</label>
                <select id="gender" name="gender" value={formData.gender} onChange={handleChange}>
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="height">Height (cm)</label>
                <input
                  type="number"
                  id="height"
                  name="height"
                  value={formData.height}
                  onChange={handleChange}
                  min="50"
                />
              </div>

              <div className="form-group">
                <label htmlFor="weight">Weight (kg)</label>
                <input
                  type="number"
                  id="weight"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  min="20"
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Updating...' : 'Update Profile'}
            </button>
          </form>
        </div>

        {/* Fitness Goals */}
        <div className="settings-card">
          <h2>🎯 Fitness Goals</h2>
          <form onSubmit={handleProfileSubmit}>
            <div className="form-group">
              <label htmlFor="goal">Fitness Goal</label>
              <select id="goal" name="goal" value={formData.goal} onChange={handleChange}>
                <option value="weight_loss">Weight Loss</option>
                <option value="weight_gain">Weight Gain</option>
                <option value="muscle_gain">Muscle Gain</option>
                <option value="maintenance">Maintenance</option>
                <option value="endurance">Endurance</option>
              </select>
              <p className="form-hint">Your recommendations will be based on this goal</p>
            </div>

            <div className="form-group">
              <label htmlFor="activityLevel">Activity Level</label>
              <select
                id="activityLevel"
                name="activityLevel"
                value={formData.activityLevel}
                onChange={handleChange}
              >
                <option value="sedentary">Sedentary (little or no exercise)</option>
                <option value="light">Light Activity (1-3 days/week)</option>
                <option value="moderate">Moderate Activity (3-5 days/week)</option>
                <option value="active">Active (6-7 days/week)</option>
                <option value="very_active">Very Active (2x per day)</option>
              </select>
              <p className="form-hint">Used to calculate daily calorie targets</p>
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Updating...' : 'Update Goals'}
            </button>
          </form>
        </div>

        {/* Health Stats */}
        <div className="settings-card">
          <h2>📊 Health Statistics</h2>
          <div className="health-stats">
            <div className="stat-item">
              <span className="stat-label">BMI</span>
              <span className="stat-value" style={{ color: bmiCategory.color }}>
                {user?.bmi ? user.bmi.toFixed(1) : 'N/A'}
              </span>
              <span className="stat-category" style={{ color: bmiCategory.color }}>
                {bmiCategory.text}
              </span>
            </div>

            <div className="stat-item">
              <span className="stat-label">Current Weight</span>
              <span className="stat-value">{user?.weight || 'N/A'} kg</span>
            </div>

            <div className="stat-item">
              <span className="stat-label">Height</span>
              <span className="stat-value">{user?.height || 'N/A'} cm</span>
            </div>

            <div className="stat-item">
              <span className="stat-label">Age</span>
              <span className="stat-value">{user?.age || 'N/A'} years</span>
            </div>
          </div>

          <div className="bmi-info">
            <h4>BMI Categories:</h4>
            <ul>
              <li><span className="dot" style={{ background: '#FFB74D' }}></span> Underweight: &lt; 18.5</li>
              <li><span className="dot" style={{ background: '#66BB6A' }}></span> Normal: 18.5 - 24.9</li>
              <li><span className="dot" style={{ background: '#FFA726' }}></span> Overweight: 25 - 29.9</li>
              <li><span className="dot" style={{ background: '#EF5350' }}></span> Obese: ≥ 30</li>
            </ul>
          </div>
        </div>

        {/* Change Password */}
        <div className="settings-card">
          <h2>🔒 Change Password</h2>
          <form onSubmit={handlePasswordSubmit}>
            <div className="form-group">
              <label htmlFor="newPassword">New Password</label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                required
                placeholder="At least 6 characters"
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm New Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                required
                placeholder="Re-enter new password"
              />
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Updating...' : 'Change Password'}
            </button>
          </form>
        </div>

        {/* Account Info */}
        <div className="settings-card">
          <h2>ℹ️ Account Information</h2>
          <div className="account-info">
            <div className="info-item">
              <span className="info-label">Account Type:</span>
              <span className="info-value">
                {user?.role === 'admin' ? '🧑‍💼 Administrator' : '👤 User'}
              </span>
            </div>
            <div className="info-item">
              <span className="info-label">Member Since:</span>
              <span className="info-value">
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
              </span>
            </div>
            <div className="info-item">
              <span className="info-label">Email:</span>
              <span className="info-value">{user?.email}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
