import { Link, useLocation } from 'react-router-dom';
import {
  FaHome,
  FaBook,
  FaPlusCircle,
  FaEdit,
  FaTrash,
  FaList,
  FaChartBar,
  FaCog,
  FaQuestionCircle,
  FaDatabase
} from 'react-icons/fa';

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    {
      title: 'Principal',
      items: [
        { path: '/dashboard', label: 'Dashboard', icon: <FaHome /> },
        { path: '/books', label: 'Todos os Livros', icon: <FaList /> },
        { path: '/books/new', label: 'Novo Livro', icon: <FaPlusCircle /> },
      ]
    },
    {
      title: 'API',
      items: [
        { path: '/api-docs', label: 'Documentação', icon: <FaQuestionCircle /> },
        { path: 'http://localhost:3000', label: 'API Endpoints', icon: <FaServer />, external: true },
        { path: 'http://localhost:3000/livros', label: 'Ver JSON Livros', icon: <FaDatabase />, external: true },
      ]
    },
    {
      title: 'Configurações',
      items: [
        { path: '/settings', label: 'Configurações', icon: <FaCog /> },
        { path: '/analytics', label: 'Analytics', icon: <FaChartBar /> },
      ]
    }
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h3>📚 Menu</h3>
        <p className="sidebar-subtitle">Gerencie sua livraria</p>
      </div>

      <div className="sidebar-menu">
        {menuItems.map((section, index) => (
          <div key={index} className="menu-section">
            <h4 className="menu-title">{section.title}</h4>
            <ul className="menu-items">
              {section.items.map((item) => (
                <li key={item.path}>
                  {item.external ? (
                    <a
                      href={item.path}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`menu-item ${location.pathname === item.path ? 'active' : ''}`}
                    >
                      <span className="menu-icon">{item.icon}</span>
                      <span className="menu-label">{item.label}</span>
                      <span className="external-icon">↗</span>
                    </a>
                  ) : (
                    <Link
                      to={item.path}
                      className={`menu-item ${location.pathname === item.path ? 'active' : ''}`}
                    >
                      <span className="menu-icon">{item.icon}</span>
                      <span className="menu-label">{item.label}</span>
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="sidebar-footer">
        <div className="api-status">
          <div className="status-indicator online"></div>
          <span>API Online</span>
        </div>
        <div className="quick-stats">
          <div className="stat">
            <FaBook />
            <span>Livros</span>
            <strong>12</strong>
          </div>
          <div className="stat">
            <FaDatabase />
            <span>Requests</span>
            <strong>156</strong>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;