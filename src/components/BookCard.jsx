import React from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, User, Building, DollarSign, Calendar, 
  FileText, Edit2, Trash2, Eye, Image as ImageIcon
} from 'lucide-react';

const BookCard = ({ book, onDelete }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price || 0);
  };

  // Imagem de fallback se não tiver capa
  const getCoverImage = () => {
    if (book.coverUrl) {
      return book.coverUrl;
    }
    
    // Placeholder baseado no título
    const colors = ['bg-blue-100', 'bg-green-100', 'bg-purple-100', 'bg-yellow-100'];
    const colorIndex = book.titulo?.length % colors.length || 0;
    
    return (
      <div className={`${colors[colorIndex]} w-full h-full flex items-center justify-center`}>
        <div className="text-center">
          <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-2" />
          <p className="text-xs text-gray-600 font-medium px-2">
            {book.titulo?.substring(0, 20) || 'Sem capa'}
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Imagem da capa */}
      <div className="relative h-48 overflow-hidden">
        {typeof book.coverUrl === 'string' ? (
          <img 
            src={book.coverUrl} 
            alt={`Capa do livro ${book.titulo}`}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.parentElement.innerHTML = `
                <div class="bg-blue-50 w-full h-full flex items-center justify-center">
                  <div class="text-center">
                    <svg class="w-12 h-12 text-blue-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                    </svg>
                    <p class="text-xs text-blue-600 font-medium">${book.titulo?.substring(0, 20) || 'Sem imagem'}</p>
                  </div>
                </div>
              `;
            }}
          />
        ) : (
          getCoverImage()
        )}
        
        {/* Badge de preço */}
        {book.preco > 0 && (
          <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md">
            <span className="text-sm font-bold text-green-600">
              {formatPrice(book.preco)}
            </span>
          </div>
        )}
      </div>

      {/* Informações do livro */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-gray-800 text-lg line-clamp-1">
            {book.titulo || 'Título não informado'}
          </h3>
          <div className="flex gap-1">
            <Link
              to={`/livros/${book._id}`}
              className="p-1 text-gray-400 hover:text-blue-600"
              title="Visualizar"
            >
              <Eye size={16} />
            </Link>
            <Link
              to={`/editar/${book._id}`}
              className="p-1 text-gray-400 hover:text-green-600"
              title="Editar"
            >
              <Edit2 size={16} />
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-2 text-gray-600 mb-3">
          <User size={14} />
          <span className="text-sm truncate">
            {book.autor || 'Autor não informado'}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-sm text-gray-500 mb-4">
          <div className="flex items-center gap-1">
            <Building size={12} />
            <span className="truncate">{book.editora || '-'}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar size={12} />
            <span>{book.anoPublicacao || '-'}</span>
          </div>
          <div className="flex items-center gap-1">
            <FileText size={12} />
            <span>{book.paginas || 0} pág.</span>
          </div>
          <div className="flex items-center gap-1">
            <BookOpen size={12} />
            <span className="truncate">{book.isbn?.substring(0, 10) || 'Sem ISBN'}</span>
          </div>
        </div>

        <button
          onClick={() => onDelete(book._id)}
          className="w-full py-2 bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
        >
          <Trash2 size={14} />
          Remover
        </button>
      </div>
    </div>
  );
};

export default BookCard;