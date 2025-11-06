/**
 * Admin Dashboard Page
 * Admin panel for managing users, meals, and workouts
 */

import React, { useState, useEffect } from 'react';
import { adminAPI } from '../services/api';
import Modal from '../components/Modal';
import '../styles/AdminDashboard.css';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({ totalUsers: 0, totalMeals: 0, totalWorkouts: 0 });
  const [users, setUsers] = useState([]);
  const [meals, setMeals] = useState([]);
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      if (activeTab === 'overview') {
        const statsRes = await adminAPI.getStats();
        setStats(statsRes.data);
      } else if (activeTab === 'users') {
        const usersRes = await adminAPI.getAllUsers();
        setUsers(usersRes.data);
      } else if (activeTab === 'meals') {
        const mealsRes = await adminAPI.getAllMeals();
        setMeals(mealsRes.data);
      } else if (activeTab === 'workouts') {
        const workoutsRes = await adminAPI.getAllWorkouts();
        setWorkouts(workoutsRes.data);
      }
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const handleDeleteUser = async (id) => {
    try {
      await adminAPI.deleteUser(id);
      setDeleteConfirm(null);
      fetchData();
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Failed to delete user');
    }
  };

  const handleDeleteMeal = async (id) => {
    try {
      await adminAPI.deleteMeal(id);
      setDeleteConfirm(null);
      fetchData();
    } catch (error) {
      console.error('Error deleting meal:', error);
      alert('Failed to delete meal');
    }
  };

  const handleDeleteWorkout = async (id) => {
    try {
      await adminAPI.deleteWorkout(id);
      setDeleteConfirm(null);
      fetchData();
    } catch (error) {
      console.error('Error deleting workout:', error);
      alert('Failed to delete workout');
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="admin-dashboard">
      <div className="page-header">
        <h1>🧑‍💼 Admin Dashboard</h1>
        <p>Manage users and platform data</p>
      </div>

      {/* Tabs */}
      <div className="admin-tabs">
        <button
          className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          📊 Overview
        </button>
        <button
          className={`tab ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          👥 Users
        </button>
        <button
          className={`tab ${activeTab === 'meals' ? 'active' : ''}`}
          onClick={() => setActiveTab('meals')}
        >
          🍽️ Meals
        </button>
        <button
          className={`tab ${activeTab === 'workouts' ? 'active' : ''}`}
          onClick={() => setActiveTab('workouts')}
        >
          🏋️ Workouts
        </button>
      </div>

      {/* Content */}
      <div className="admin-content">
        {loading ? (
          <div className="loading">Loading...</div>
        ) : (
          <>
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="overview-section">
                <div className="stats-grid">
                  <div className="stat-card">
                    <div className="stat-icon">👥</div>
                    <div className="stat-info">
                      <h3>Total Users</h3>
                      <p className="stat-value">{stats.totalUsers}</p>
                      <p className="stat-label">registered users</p>
                    </div>
                  </div>

                  <div className="stat-card">
                    <div className="stat-icon">🍽️</div>
                    <div className="stat-info">
                      <h3>Total Meals</h3>
                      <p className="stat-value">{stats.totalMeals}</p>
                      <p className="stat-label">logged meals</p>
                    </div>
                  </div>

                  <div className="stat-card">
                    <div className="stat-icon">🏋️</div>
                    <div className="stat-info">
                      <h3>Total Workouts</h3>
                      <p className="stat-value">{stats.totalWorkouts}</p>
                      <p className="stat-label">logged workouts</p>
                    </div>
                  </div>
                </div>

                <div className="platform-info">
                  <h3>Platform Information</h3>
                  <p>Welcome to the FitSync Admin Dashboard. Here you can manage all users, view their activities, and maintain the platform.</p>
                  <div className="info-cards">
                    <div className="info-card">
                      <h4>🔧 User Management</h4>
                      <p>View, edit, and delete user accounts. Monitor user activity and profile information.</p>
                    </div>
                    <div className="info-card">
                      <h4>📊 Data Oversight</h4>
                      <p>Monitor all meals and workouts logged across the platform. Remove inappropriate content.</p>
                    </div>
                    <div className="info-card">
                      <h4>📈 Analytics</h4>
                      <p>Track platform usage statistics and user engagement metrics.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Users Tab */}
            {activeTab === 'users' && (
              <div className="users-section">
                <h3>All Users ({users.length})</h3>
                <div className="table-container">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Goal</th>
                        <th>BMI</th>
                        <th>Joined</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user._id}>
                          <td>{user.name}</td>
                          <td>{user.email}</td>
                          <td>
                            <span className={`role-badge ${user.role}`}>
                              {user.role === 'admin' ? '🧑‍💼 Admin' : '👤 User'}
                            </span>
                          </td>
                          <td>{user.goal?.replace('_', ' ') || 'N/A'}</td>
                          <td>{user.bmi?.toFixed(1) || 'N/A'}</td>
                          <td>{formatDate(user.createdAt)}</td>
                          <td>
                            <button
                              className="btn-icon btn-delete"
                              onClick={() => setDeleteConfirm({ type: 'user', data: user })}
                              title="Delete User"
                            >
                              🗑️
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Meals Tab */}
            {activeTab === 'meals' && (
              <div className="meals-section">
                <h3>All Meals ({meals.length})</h3>
                <div className="table-container">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>User</th>
                        <th>Meal Name</th>
                        <th>Type</th>
                        <th>Calories</th>
                        <th>Protein</th>
                        <th>Carbs</th>
                        <th>Fats</th>
                        <th>Date</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {meals.map((meal) => (
                        <tr key={meal._id}>
                          <td>{meal.userId?.name || 'Unknown'}</td>
                          <td>{meal.name}</td>
                          <td>
                            <span className="meal-type-badge">{meal.mealType}</span>
                          </td>
                          <td>{meal.calories} kcal</td>
                          <td>{meal.protein}g</td>
                          <td>{meal.carbs}g</td>
                          <td>{meal.fats}g</td>
                          <td>{formatDate(meal.date)}</td>
                          <td>
                            <button
                              className="btn-icon btn-delete"
                              onClick={() => setDeleteConfirm({ type: 'meal', data: meal })}
                              title="Delete Meal"
                            >
                              🗑️
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Workouts Tab */}
            {activeTab === 'workouts' && (
              <div className="workouts-section">
                <h3>All Workouts ({workouts.length})</h3>
                <div className="table-container">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>User</th>
                        <th>Workout Name</th>
                        <th>Type</th>
                        <th>Duration</th>
                        <th>Intensity</th>
                        <th>Calories Burned</th>
                        <th>Date</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {workouts.map((workout) => (
                        <tr key={workout._id}>
                          <td>{workout.userId?.name || 'Unknown'}</td>
                          <td>{workout.name}</td>
                          <td>
                            <span className="workout-type-badge">{workout.type}</span>
                          </td>
                          <td>{workout.duration} min</td>
                          <td>
                            <span className={`intensity-badge ${workout.intensity}`}>
                              {workout.intensity}
                            </span>
                          </td>
                          <td>{workout.caloriesBurned} kcal</td>
                          <td>{formatDate(workout.date)}</td>
                          <td>
                            <button
                              className="btn-icon btn-delete"
                              onClick={() => setDeleteConfirm({ type: 'workout', data: workout })}
                              title="Delete Workout"
                            >
                              🗑️
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        title="Confirm Delete"
      >
        <div className="delete-confirm">
          <p>
            Are you sure you want to delete this {deleteConfirm?.type}?
            {deleteConfirm?.type === 'user' && (
              <strong> This will also delete all associated meals and workouts.</strong>
            )}
          </p>
          <p className="warning-text">This action cannot be undone.</p>
          <div className="form-actions">
            <button className="btn btn-secondary" onClick={() => setDeleteConfirm(null)}>
              Cancel
            </button>
            <button
              className="btn btn-danger"
              onClick={() => {
                if (deleteConfirm.type === 'user') {
                  handleDeleteUser(deleteConfirm.data._id);
                } else if (deleteConfirm.type === 'meal') {
                  handleDeleteMeal(deleteConfirm.data._id);
                } else if (deleteConfirm.type === 'workout') {
                  handleDeleteWorkout(deleteConfirm.data._id);
                }
              }}
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AdminDashboard;
