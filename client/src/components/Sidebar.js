/**
 * Sidebar Component
 * Navigation sidebar with responsive design
 */

import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Sidebar.css';

const Sidebar = () => {
  const { user, logout, isAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  // Navigation items for user
  const userNavItems = [
    { path: '/dashboard', icon: '🏠', label: 'Home' },
    { path: '/meals', icon: '🍽️', label: 'Add Meals' },
    { path: '/workouts', icon: '🏋️', label: 'Add Workouts' },
    { path: '/settings', icon: '⚙️', label: 'Settings' },
  ];

  // Navigation items for admin
  const adminNavItems = [
    { path: '/admin-dashboard', icon: '🧑‍💼', label: 'Admin Dashboard' },
    { path: '/settings', icon: '⚙️', label: 'Settings' },
  ];

  const navItems = isAdmin ? adminNavItems : userNavItems;

  return (
    <>
      {/* Mobile toggle button */}
      <button className="sidebar-toggle" onClick={toggleSidebar}>
        ☰
      </button>

      {/* Sidebar */}
      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2>💪 FitSync</h2>
          <p className="user-name">{user?.name}</p>
          <span className="user-badge">{isAdmin ? 'Admin' : 'User'}</span>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
              onClick={() => setIsOpen(false)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </Link>
          ))}

          <button className="nav-link logout-btn" onClick={handleLogout}>
            <span className="nav-icon">🚪</span>
            <span className="nav-label">Log Out</span>
          </button>
        </nav>

        <div className="sidebar-footer">
          <p>© 2025 FitSync</p>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isOpen && <div className="sidebar-overlay" onClick={toggleSidebar}></div>}
    </>
  );
};

export default Sidebar;
