import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BookOpen, Home, Plus, Search, Library, Activity } from 'lucide-react';
import bookService from '../services/bookService';

const Header = () => {
  const location = useLocation();
  const [apiStatus, setApiStatus] = useState('loading');
  
  useEffect(() => {
    checkApiStatus();
  }, []);

  const checkApiStatus = async () => {
    try {
      await bookService.getStatus();
      setApiStatus('online');
    } catch (error) {
      setApiStatus('offline');
    }
  };

  const navItems = [
    { path: '/', label: 'Início', icon: <Home size={18} /> },
    { path: '/livros', label: 'Livros', icon: <BookOpen size={18} /> },
    { path: '/adicionar', label: 'Adicionar', icon: <Plus size={18} /> },
    { path: '/buscar', label: 'Buscar', icon: <Search size={18} /> },
  ];
  
  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="p-2 bg-primary-100 rounded-lg group-hover:bg-primary-200 transition-colors">
              <Library className="text-primary-600" size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">Livraria API</h1>
              <p className="text-xs text-gray-500">Gerenciamento de Livros</p>
            </div>
          </Link>
          
          {/* Navigation */}
          <nav className="flex items-center gap-1 bg-gray-50 rounded-lg p-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
                    isActive
                      ? 'bg-white text-primary-600 font-semibold shadow-sm'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {item.icon}
                  <span className="hidden sm:inline">{item.label}</span>
                </Link>
              );
            })}
          </nav>
          
          {/* API Status */}
          <div className="flex items-center gap-2">
            <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${
              apiStatus === 'online' 
                ? 'bg-green-50 text-green-700' 
                : apiStatus === 'offline'
                ? 'bg-red-50 text-red-700'
                : 'bg-yellow-50 text-yellow-700'
            }`}>
              <div className={`w-2 h-2 rounded-full ${
                apiStatus === 'online' 
                  ? 'bg-green-500 animate-pulse-slow' 
                  : apiStatus === 'offline'
                  ? 'bg-red-500'
                  : 'bg-yellow-500 animate-pulse'
              }`}></div>
              <span className="text-sm font-medium capitalize">
                {apiStatus === 'loading' ? 'Conectando...' : `API ${apiStatus}`}
              </span>
              <Activity size={12} />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;