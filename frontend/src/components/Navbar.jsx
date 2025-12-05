import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth.jsx';

export default function Navbar() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="main-navbar">
      <div className="navbar-brand">
        <Link to="/dashboard">Shopify Insights</Link>
      </div>
      <div className="navbar-links">
        <Link 
          to="/dashboard" 
          className={isActive('/dashboard') ? 'active' : ''}
        >
          Dashboard
        </Link>
        <Link 
          to="/settings" 
          className={isActive('/settings') ? 'active' : ''}
        >
          Settings
        </Link>
        {user && (
          <span className="navbar-user">{user.email || 'User'}</span>
        )}
        <button onClick={handleLogout} className="navbar-logout">
          Logout
        </button>
      </div>
    </nav>
  );
}
