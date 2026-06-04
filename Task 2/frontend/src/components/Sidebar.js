import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';
import '../styles/sidebar.css';

const NAV_ITEMS = {
  student: [
    { to: '/dashboard', icon: '⊞', label: 'Dashboard' },
    { to: '/courses', icon: '📚', label: 'Browse Courses' },
    { to: '/my-courses', icon: '🎯', label: 'My Learning' },
    { to: '/profile', icon: '👤', label: 'Profile' },
  ],
  instructor: [
    { to: '/dashboard', icon: '⊞', label: 'Dashboard' },
    { to: '/my-courses', icon: '📋', label: 'My Courses' },
    { to: '/courses/create', icon: '➕', label: 'Create Course' },
    { to: '/profile', icon: '👤', label: 'Profile' },
  ],
  admin: [
    { to: '/dashboard', icon: '⊞', label: 'Dashboard' },
    { to: '/users', icon: '👥', label: 'Users' },
    { to: '/courses', icon: '📚', label: 'All Courses' },
    { to: '/profile', icon: '👤', label: 'Profile' },
  ],
};

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const navItems = NAV_ITEMS[user?.role] || NAV_ITEMS.student;

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : '??';

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <span className="sidebar-logo-icon">⚡</span>
        <span className="sidebar-logo-text">LearnHub</span>
      </div>

      {/* User chip */}
      <div className="sidebar-user">
        <div className="user-avatar">{user?.avatar ? <img src={user.avatar} alt={user.name} /> : initials}</div>
        <div className="user-info">
          <div className="user-name">{user?.name || 'User'}</div>
          <div className="user-role badge badge-purple">{user?.role || 'student'}</div>
        </div>
      </div>

      {/* Nav */}
      <nav className="sidebar-nav">
        <div className="sidebar-nav-label">Menu</div>
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/dashboard'}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          >
            <span className="sidebar-link-icon">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <button className="sidebar-logout" onClick={handleLogout}>
          <span>🚪</span> Sign out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
