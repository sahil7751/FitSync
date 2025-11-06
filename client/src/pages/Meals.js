/**
 * Meals Page
 * Manage meal entries with add, edit, and delete functionality
 */

import React, { useState, useEffect } from 'react';
import { mealAPI } from '../services/api';
import Modal from '../components/Modal';
import '../styles/Meals.css';

const Meals = () => {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingMeal, setEditingMeal] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    mealType: 'breakfast',
    date: new Date().toISOString().split('T')[0],
    calories: '',
    protein: '',
    carbs: '',
    fats: '',
    description: '',
    portion: '1 serving',
  });

  useEffect(() => {
    fetchMeals();
  }, []);

  const fetchMeals = async () => {
    try {
      setLoading(true);
      const response = await mealAPI.getAll();
      setMeals(response.data);
    } catch (error) {
      console.error('Error fetching meals:', error);
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
      if (editingMeal) {
        await mealAPI.update(editingMeal._id, formData);
      } else {
        await mealAPI.create(formData);
      }
      
      // Reset form and close modal
      setFormData({
        name: '',
        mealType: 'breakfast',
        date: new Date().toISOString().split('T')[0],
        calories: '',
        protein: '',
        carbs: '',
        fats: '',
        description: '',
        portion: '1 serving',
      });
      setShowModal(false);
      setEditingMeal(null);
      
      // Refresh meals list
      fetchMeals();
    } catch (error) {
      console.error('Error saving meal:', error);
      alert(error.response?.data?.message || 'Failed to save meal');
    }
  };

  const handleEdit = (meal) => {
    setEditingMeal(meal);
    setFormData({
      name: meal.name,
      mealType: meal.mealType,
      date: new Date(meal.date).toISOString().split('T')[0],
      calories: meal.calories,
      protein: meal.protein,
      carbs: meal.carbs,
      fats: meal.fats,
      description: meal.description || '',
      portion: meal.portion || '1 serving',
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    try {
      await mealAPI.delete(id);
      setDeleteConfirm(null);
      fetchMeals();
    } catch (error) {
      console.error('Error deleting meal:', error);
      alert('Failed to delete meal');
    }
  };

  const openAddModal = () => {
    setEditingMeal(null);
    setFormData({
      name: '',
      mealType: 'breakfast',
      date: new Date().toISOString().split('T')[0],
      calories: '',
      protein: '',
      carbs: '',
      fats: '',
      description: '',
      portion: '1 serving',
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

  const getMealIcon = (type) => {
    const icons = {
      breakfast: '🌅',
      lunch: '☀️',
      dinner: '🌙',
      snack: '🍪',
    };
    return icons[type] || '🍽️';
  };

  if (loading) {
    return <div className="loading">Loading meals...</div>;
  }

  return (
    <div className="meals-page">
      <div className="page-header">
        <h1>🍽️ Meal Tracker</h1>
        <button className="btn btn-primary" onClick={openAddModal}>
          + Add New Meal
        </button>
      </div>

      {meals.length === 0 ? (
        <div className="empty-state">
          <p className="empty-icon">🍽️</p>
          <h3>No meals logged yet</h3>
          <p>Start tracking your nutrition by adding your first meal!</p>
          <button className="btn btn-primary" onClick={openAddModal}>
            Add Your First Meal
          </button>
        </div>
      ) : (
        <div className="meals-grid">
          {meals.map((meal) => (
            <div key={meal._id} className="meal-card">
              <div className="meal-header">
                <div className="meal-title">
                  <span className="meal-icon">{getMealIcon(meal.mealType)}</span>
                  <h3>{meal.name}</h3>
                </div>
                <div className="meal-actions">
                  <button className="btn-icon" onClick={() => handleEdit(meal)} title="Edit">
                    ✏️
                  </button>
                  <button
                    className="btn-icon"
                    onClick={() => setDeleteConfirm(meal)}
                    title="Delete"
                  >
                    🗑️
                  </button>
                </div>
              </div>

              <div className="meal-info">
                <span className="meal-type">{meal.mealType}</span>
                <span className="meal-date">{formatDate(meal.date)}</span>
              </div>

              <div className="meal-calories">
                <span className="calories-value">{meal.calories}</span>
                <span className="calories-label">kcal</span>
              </div>

              <div className="meal-macros">
                <div className="macro">
                  <span className="macro-label">Protein</span>
                  <span className="macro-value">{meal.protein}g</span>
                </div>
                <div className="macro">
                  <span className="macro-label">Carbs</span>
                  <span className="macro-value">{meal.carbs}g</span>
                </div>
                <div className="macro">
                  <span className="macro-label">Fats</span>
                  <span className="macro-value">{meal.fats}g</span>
                </div>
              </div>

              {meal.description && <p className="meal-description">{meal.description}</p>}
              {meal.portion && <p className="meal-portion">Portion: {meal.portion}</p>}
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingMeal(null);
        }}
        title={editingMeal ? 'Edit Meal' : 'Add New Meal'}
      >
        <form onSubmit={handleSubmit} className="meal-form">
          <div className="form-group">
            <label htmlFor="name">Meal Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="e.g., Grilled Chicken Salad"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="mealType">Meal Type *</label>
              <select id="mealType" name="mealType" value={formData.mealType} onChange={handleChange}>
                <option value="breakfast">Breakfast</option>
                <option value="lunch">Lunch</option>
                <option value="dinner">Dinner</option>
                <option value="snack">Snack</option>
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
              <label htmlFor="calories">Calories (kcal) *</label>
              <input
                type="number"
                id="calories"
                name="calories"
                value={formData.calories}
                onChange={handleChange}
                required
                min="0"
                placeholder="300"
              />
            </div>

            <div className="form-group">
              <label htmlFor="portion">Portion</label>
              <input
                type="text"
                id="portion"
                name="portion"
                value={formData.portion}
                onChange={handleChange}
                placeholder="1 serving"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="protein">Protein (g)</label>
              <input
                type="number"
                id="protein"
                name="protein"
                value={formData.protein}
                onChange={handleChange}
                min="0"
                step="0.1"
                placeholder="25"
              />
            </div>

            <div className="form-group">
              <label htmlFor="carbs">Carbs (g)</label>
              <input
                type="number"
                id="carbs"
                name="carbs"
                value={formData.carbs}
                onChange={handleChange}
                min="0"
                step="0.1"
                placeholder="40"
              />
            </div>

            <div className="form-group">
              <label htmlFor="fats">Fats (g)</label>
              <input
                type="number"
                id="fats"
                name="fats"
                value={formData.fats}
                onChange={handleChange}
                min="0"
                step="0.1"
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
              placeholder="Optional notes about this meal..."
            />
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                setShowModal(false);
                setEditingMeal(null);
              }}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {editingMeal ? 'Update Meal' : 'Add Meal'}
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

export default Meals;
