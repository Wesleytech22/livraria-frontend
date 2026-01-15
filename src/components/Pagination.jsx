import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

const Pagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange,
  itemsPerPage,
  onItemsPerPageChange,
  totalItems 
}) => {
  const pagesToShow = 5;
  
  const getPageNumbers = () => {
    if (totalPages <= pagesToShow) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    
    const start = Math.max(1, currentPage - Math.floor(pagesToShow / 2));
    const end = Math.min(totalPages, start + pagesToShow - 1);
    
    const adjustedStart = Math.max(1, end - pagesToShow + 1);
    
    return Array.from({ length: end - adjustedStart + 1 }, (_, i) => adjustedStart + i);
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 p-4 bg-white rounded-xl shadow-sm border">
      {/* Informações */}
      <div className="text-sm text-gray-600">
        <span className="font-medium">{totalItems}</span> livros encontrados
        <span className="mx-2">•</span>
        Página <span className="font-medium">{currentPage}</span> de <span className="font-medium">{totalPages}</span>
      </div>
      
      {/* Controles de página */}
      <div className="flex items-center gap-2">
        {/* Itens por página */}
        <div className="flex items-center gap-2 mr-4">
          <label className="text-sm text-gray-600">Por página:</label>
          <select
            value={itemsPerPage}
            onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
            className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
          >
            {[6, 12, 24, 48].map(num => (
              <option key={num} value={num}>{num}</option>
            ))}
          </select>
        </div>
        
        {/* Navegação */}
        <nav className="flex items-center gap-1">
          {/* Primeira página */}
          <button
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1}
            className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Primeira página"
          >
            <ChevronsLeft size={16} className="text-gray-600" />
          </button>
          
          {/* Página anterior */}
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Página anterior"
          >
            <ChevronLeft size={16} className="text-gray-600" />
          </button>
          
          {/* Números das páginas */}
          {getPageNumbers().map(page => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`w-10 h-10 rounded-lg font-medium transition-all ${
                currentPage === page
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {page}
            </button>
          ))}
          
          {/* Próxima página */}
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Próxima página"
          >
            <ChevronRight size={16} className="text-gray-600" />
          </button>
          
          {/* Última página */}
          <button
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Última página"
          >
            <ChevronsRight size={16} className="text-gray-600" />
          </button>
        </nav>
      </div>
    </div>
  );
};

export default Pagination;