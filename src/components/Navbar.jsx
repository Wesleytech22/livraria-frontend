import { Link, useLocation } from 'react-router-dom';
import { FaBook, FaServer, FaUser, FaBell, FaSearch } from 'react-icons/fa';
import { useState } from 'react';

const Navbar = () => {
  const location = useLocation();
  const [search, setSearch] = useState('');

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: <FaBook /> },
    { path: '/books', label: 'Livros', icon: <FaBook /> },
    { path: '/api-docs', label: 'API Docs', icon: <FaServer /> },
  ];

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <div className="navbar-logo">
          <div className="logo-icon">
            <FaBook size={24} />
          </div>
          <div className="logo-text">
            <h1>Livraria<span>API</span></h1>
            <p>Fullstack Dashboard</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="navbar-search">
          <div className="search-container">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Buscar livros, autores..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        {/* Navigation Items */}
        <div className="navbar-links">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </div>

        {/* User Menu */}
        <div className="navbar-user">
          <button className="icon-button">
            <FaBell size={18} />
            <span className="notification-badge">3</span>
          </button>
          <div className="user-profile">
            <div className="user-avatar">
              <FaUser size={16} />
            </div>
            <div className="user-info">
              <span className="user-name">Wesley Rodrigues</span>
              <span className="user-role">Administrador</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;