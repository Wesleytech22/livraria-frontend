import React, { useState } from 'react';
import { Search, X, Filter } from 'lucide-react';

const SearchBar = ({ 
  onSearch, 
  placeholder = "Buscar livros...",
  showFilters = false,
  onFilterChange 
}) => {
  const [term, setTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [filters, setFilters] = useState({
    sortBy: 'titulo',
    sortDirection: 'asc'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (term.trim() || showFilters) {
      setIsSearching(true);
      const searchParams = {
        term: term.trim(),
        ...(showFilters && filters)
      };
      onSearch(searchParams);
      setTimeout(() => setIsSearching(false), 500);
    }
  };

  const handleClear = () => {
    setTerm('');
    setIsSearching(false);
    onSearch({ term: '' });
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    if (onFilterChange) {
      onFilterChange(newFilters);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Barra de busca principal */}
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400 group-hover:text-primary-400 transition-colors" />
          </div>
          
          <input
            type="text"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            className="input pl-10 pr-10 py-3 w-full text-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500"
            placeholder={placeholder}
          />
          
          {term && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute inset-y-0 right-0 pr-3 flex items-center hover:opacity-75 transition-opacity"
              title="Limpar busca"
            >
              <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
            </button>
          )}
        </div>

        {/* Filtros (opcional) */}
        {showFilters && (
          <div className="flex flex-wrap gap-3 items-center p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              <Filter size={16} className="text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Ordenar por:</span>
            </div>
            
            <select
              value={filters.sortBy}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-lg text-sm bg-white"
            >
              <option value="titulo">Título</option>
              <option value="autor">Autor</option>
              <option value="anoPublicacao">Ano</option>
              <option value="preco">Preço</option>
            </select>
            
            <select
              value={filters.sortDirection}
              onChange={(e) => handleFilterChange('sortDirection', e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-lg text-sm bg-white"
            >
              <option value="asc">Crescente</option>
              <option value="desc">Decrescente</option>
            </select>
          </div>
        )}

        {/* Botão de busca */}
        <div className="flex justify-center">
          <button
            type="submit"
            className="px-8 py-3 bg-primary-600 text-white rounded-lg shadow-lg hover:bg-primary-700 transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            disabled={(!term.trim() && !showFilters) || isSearching}
          >
            {isSearching ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Buscando...
              </>
            ) : (
              <>
                <Search size={18} />
                Buscar Livros
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchBar;