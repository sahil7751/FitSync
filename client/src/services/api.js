/**
 * API Service
 * Centralized API calls using axios
 */

import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error
      console.error('API Error:', error.response.data);
    } else if (error.request) {
      // Request made but no response
      console.error('Network Error:', error.request);
    } else {
      // Error setting up request
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (userData) => api.put('/auth/profile', userData),
};

// Meal API calls
export const mealAPI = {
  getAll: (params) => api.get('/meals', { params }),
  getById: (id) => api.get(`/meals/${id}`),
  create: (mealData) => api.post('/meals', mealData),
  update: (id, mealData) => api.put(`/meals/${id}`, mealData),
  delete: (id) => api.delete(`/meals/${id}`),
  getStats: (params) => api.get('/meals/stats/summary', { params }),
};

// Workout API calls
export const workoutAPI = {
  getAll: (params) => api.get('/workouts', { params }),
  getById: (id) => api.get(`/workouts/${id}`),
  create: (workoutData) => api.post('/workouts', workoutData),
  update: (id, workoutData) => api.put(`/workouts/${id}`, workoutData),
  delete: (id) => api.delete(`/workouts/${id}`),
  getStats: (params) => api.get('/workouts/stats/summary', { params }),
};

// Recommendation API calls
export const recommendationAPI = {
  getWorkouts: () => api.get('/recommendations/workouts'),
  getMeals: () => api.get('/recommendations/meals'),
  getDailyTargets: () => api.get('/recommendations/daily-targets'),
};

// Admin API calls
export const adminAPI = {
  getAllUsers: () => api.get('/admin/users'),
  getUser: (id) => api.get(`/admin/users/${id}`),
  updateUser: (id, userData) => api.put(`/admin/users/${id}`, userData),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  getAllMeals: () => api.get('/admin/meals'),
  deleteMeal: (id) => api.delete(`/admin/meals/${id}`),
  getAllWorkouts: () => api.get('/admin/workouts'),
  deleteWorkout: (id) => api.delete(`/admin/workouts/${id}`),
  getStats: () => api.get('/admin/stats'),
};

export default api;
