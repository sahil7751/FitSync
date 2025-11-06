/**
 * Admin Route Component
 * Protects routes that require admin authentication
 */

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminRoute = ({ children }) => {
  const { isAdmin, loading } = useAuth();

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return isAdmin ? children : <Navigate to="/admin-login" />;
};

export default AdminRoute;
