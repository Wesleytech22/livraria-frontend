// src/components/Header.jsx
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaBook, FaPlus, FaCog, FaSignOutAlt } from 'react-icons/fa';

const Header = () => {
  const location = useLocation();
  
  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <header style={styles.header}>
      <div className="container" style={styles.container}>
        {/* Logo */}
        <div style={styles.logoContainer}>
          <div style={styles.logo}>📚</div>
          <div>
            <h1 style={styles.title}>Livraria API</h1>
            <p style={styles.subtitle}>Gerenciamento completo de livros</p>
          </div>
        </div>

        {/* Navigation */}
        <nav style={styles.nav}>
          <Link 
            to="/" 
            style={{...styles.navLink, ...(isActive('/') && styles.activeLink)}}
          >
            <FaHome style={styles.icon} />
            <span>Início</span>
          </Link>
          
          <Link 
            to="/books" 
            style={{...styles.navLink, ...(isActive('/books') && styles.activeLink)}}
          >
            <FaBook style={styles.icon} />
            <span>Livros</span>
          </Link>
          
          <Link 
            to="/add-book" 
            style={{...styles.navLink, ...(isActive('/add-book') && styles.activeLink)}}
          >
            <FaPlus style={styles.icon} />
            <span>Adicionar</span>
          </Link>
          
          <div style={styles.userSection}>
            <button style={styles.userBtn}>
              <FaCog style={styles.icon} />
            </button>
            <button style={styles.logoutBtn}>
              <FaSignOutAlt style={styles.icon} />
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
};

const styles = {
  header: {
    backgroundColor: 'white',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    padding: '15px 0',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
  },
  logo: {
    fontSize: '2.5rem',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    width: '50px',
    height: '50px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#212529',
    margin: 0,
  },
  subtitle: {
    fontSize: '0.875rem',
    color: '#6c757d',
    margin: 0,
  },
  nav: {
    display: 'flex',
    alignItems: 'center',
    gap: '30px',
  },
  navLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    textDecoration: 'none',
    color: '#6c757d',
    fontWeight: '500',
    padding: '8px 16px',
    borderRadius: '8px',
    transition: 'all 0.2s ease',
  },
  activeLink: {
    backgroundColor: '#4361ee',
    color: 'white',
  },
  icon: {
    fontSize: '1.1rem',
  },
  userSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginLeft: '20px',
    paddingLeft: '20px',
    borderLeft: '1px solid #e9ecef',
  },
  userBtn: {
    background: 'none',
    border: 'none',
    color: '#6c757d',
    cursor: 'pointer',
    padding: '8px',
    borderRadius: '8px',
    transition: 'all 0.2s ease',
  },
  logoutBtn: {
    background: '#f8f9fa',
    border: '1px solid #dee2e6',
    color: '#6c757d',
    cursor: 'pointer',
    padding: '8px',
    borderRadius: '8px',
    transition: 'all 0.2s ease',
  },
};

export default Header;