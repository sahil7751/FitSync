/**
 * Workouts Page
 * Manage workout entries with add, edit, and delete functionality
 */

import React, { useState, useEffect } from 'react';
import { workoutAPI } from '../services/api';
import Modal from '../components/Modal';
import '../styles/Workouts.css';

const Workouts = () => {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingWorkout, setEditingWorkout] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'cardio',
    date: new Date().toISOString().split('T')[0],
    duration: '',
    intensity: 'moderate',
    caloriesBurned: '',
    description: '',
    sets: '',
    reps: '',
    distance: '',
  });

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const fetchWorkouts = async () => {
    try {
      setLoading(true);
      const response = await workoutAPI.getAll();
      setWorkouts(response.data);
    } catch (error) {
      console.error('Error fetching workouts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingWorkout) {
        await workoutAPI.update(editingWorkout._id, formData);
      } else {
        await workoutAPI.create(formData);
      }
      
      // Reset form and close modal
      setFormData({
        name: '',
        type: 'cardio',
        date: new Date().toISOString().split('T')[0],
        duration: '',
        intensity: 'moderate',
        caloriesBurned: '',
        description: '',
        sets: '',
        reps: '',
        distance: '',
      });
      setShowModal(false);
      setEditingWorkout(null);
      
      // Refresh workouts list
      fetchWorkouts();
    } catch (error) {
      console.error('Error saving workout:', error);
      alert(error.response?.data?.message || 'Failed to save workout');
    }
  };

  const handleEdit = (workout) => {
    setEditingWorkout(workout);
    setFormData({
      name: workout.name,
      type: workout.type,
      date: new Date(workout.date).toISOString().split('T')[0],
      duration: workout.duration,
      intensity: workout.intensity,
      caloriesBurned: workout.caloriesBurned,
      description: workout.description || '',
      sets: workout.sets || '',
      reps: workout.reps || '',
      distance: workout.distance || '',
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    try {
      await workoutAPI.delete(id);
      setDeleteConfirm(null);
      fetchWorkouts();
    } catch (error) {
      console.error('Error deleting workout:', error);
      alert('Failed to delete workout');
    }
  };

  const openAddModal = () => {
    setEditingWorkout(null);
    setFormData({
      name: '',
      type: 'cardio',
      date: new Date().toISOString().split('T')[0],
      duration: '',
      intensity: 'moderate',
      caloriesBurned: '',
      description: '',
      sets: '',
      reps: '',
      distance: '',
    });
    setShowModal(true);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getWorkoutIcon = (type) => {
    const icons = {
      cardio: '🏃',
      strength: '💪',
      flexibility: '🧘',
      sports: '⚽',
      other: '🏋️',
    };
    return icons[type] || '🏋️';
  };

  if (loading) {
    return <div className="loading">Loading workouts...</div>;
  }

  return (
    <div className="workouts-page">
      <div className="page-header">
        <h1>🏋️ Workout Tracker</h1>
        <button className="btn btn-primary" onClick={openAddModal}>
          + Add New Workout
        </button>
      </div>

      {workouts.length === 0 ? (
        <div className="empty-state">
          <p className="empty-icon">🏋️</p>
          <h3>No workouts logged yet</h3>
          <p>Start tracking your fitness by adding your first workout!</p>
          <button className="btn btn-primary" onClick={openAddModal}>
            Add Your First Workout
          </button>
        </div>
      ) : (
        <div className="workouts-grid">
          {workouts.map((workout) => (
            <div key={workout._id} className="workout-card">
              <div className="workout-header">
                <div className="workout-title">
                  <span className="workout-icon">{getWorkoutIcon(workout.type)}</span>
                  <h3>{workout.name}</h3>
                </div>
                <div className="workout-actions">
                  <button className="btn-icon" onClick={() => handleEdit(workout)} title="Edit">
                    ✏️
                  </button>
                  <button
                    className="btn-icon"
                    onClick={() => setDeleteConfirm(workout)}
                    title="Delete"
                  >
                    🗑️
                  </button>
                </div>
              </div>

              <div className="workout-info">
                <span className="workout-type">{workout.type}</span>
                <span className={`intensity-badge ${workout.intensity}`}>{workout.intensity}</span>
                <span className="workout-date">{formatDate(workout.date)}</span>
              </div>

              <div className="workout-stats">
                <div className="stat">
                  <span className="stat-icon">⏱️</span>
                  <span className="stat-value">{workout.duration} min</span>
                </div>
                <div className="stat">
                  <span className="stat-icon">🔥</span>
                  <span className="stat-value">{workout.caloriesBurned} kcal</span>
                </div>
                {workout.distance > 0 && (
                  <div className="stat">
                    <span className="stat-icon">📏</span>
                    <span className="stat-value">{workout.distance} km</span>
                  </div>
                )}
              </div>

              {(workout.sets || workout.reps) && (
                <div className="workout-details">
                  {workout.sets && <span>{workout.sets} sets</span>}
                  {workout.reps && <span>{workout.reps} reps</span>}
                </div>
              )}

              {workout.description && <p className="workout-description">{workout.description}</p>}
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingWorkout(null);
        }}
        title={editingWorkout ? 'Edit Workout' : 'Add New Workout'}
      >
        <form onSubmit={handleSubmit} className="workout-form">
          <div className="form-group">
            <label htmlFor="name">Workout Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="e.g., Morning Run"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="type">Type *</label>
              <select id="type" name="type" value={formData.type} onChange={handleChange}>
                <option value="cardio">Cardio</option>
                <option value="strength">Strength</option>
                <option value="flexibility">Flexibility</option>
                <option value="sports">Sports</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="intensity">Intensity *</label>
              <select id="intensity" name="intensity" value={formData.intensity} onChange={handleChange}>
                <option value="low">Low</option>
                <option value="moderate">Moderate</option>
                <option value="high">High</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="date">Date *</label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="duration">Duration (min) *</label>
              <input
                type="number"
                id="duration"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                required
                min="1"
                placeholder="30"
              />
            </div>

            <div className="form-group">
              <label htmlFor="caloriesBurned">Calories Burned *</label>
              <input
                type="number"
                id="caloriesBurned"
                name="caloriesBurned"
                value={formData.caloriesBurned}
                onChange={handleChange}
                required
                min="0"
                placeholder="250"
              />
            </div>

            <div className="form-group">
              <label htmlFor="distance">Distance (km)</label>
              <input
                type="number"
                id="distance"
                name="distance"
                value={formData.distance}
                onChange={handleChange}
                min="0"
                step="0.1"
                placeholder="5.0"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="sets">Sets</label>
              <input
                type="number"
                id="sets"
                name="sets"
                value={formData.sets}
                onChange={handleChange}
                min="0"
                placeholder="4"
              />
            </div>

            <div className="form-group">
              <label htmlFor="reps">Reps</label>
              <input
                type="number"
                id="reps"
                name="reps"
                value={formData.reps}
                onChange={handleChange}
                min="0"
                placeholder="10"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              placeholder="Optional notes about this workout..."
            />
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                setShowModal(false);
                setEditingWorkout(null);
              }}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {editingWorkout ? 'Update Workout' : 'Add Workout'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        title="Confirm Delete"
      >
        <div className="delete-confirm">
          <p>Are you sure you want to delete "{deleteConfirm?.name}"?</p>
          <p className="warning-text">This action cannot be undone.</p>
          <div className="form-actions">
            <button className="btn btn-secondary" onClick={() => setDeleteConfirm(null)}>
              Cancel
            </button>
            <button className="btn btn-danger" onClick={() => handleDelete(deleteConfirm._id)}>
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Workouts;
