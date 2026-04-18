import React from 'react';
import { Link } from 'react-router-dom';
import { Book, User, Calendar, Eye, Edit2, Trash2 } from 'lucide-react';

const BookCard = ({ book, onDelete }) => {
  return (
    <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden">
      {/* Gradiente decorativo no topo */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>

      {/* Conteúdo do card */}
      <div className="p-6">
        {/* Ícone e título */}
        <div className="flex items-start justify-between mb-4">
          <div className="p-2 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
            <Book className="text-blue-600" size={24} />
          </div>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <Link
              to={`/editar/${book._id}`}
              className="p-2 text-gray-500 hover:text-blue-600 transition-colors"
              title="Editar"
            >
              <Edit2 size={16} />
            </Link>
            <button
              onClick={() => onDelete(book._id)}
              className="p-2 text-gray-500 hover:text-red-600 transition-colors"
              title="Excluir"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>

        {/* Informações do livro */}
        <Link to={`/livros/${book._id}`}>
          <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2 hover:text-blue-600 transition-colors">
            {book.titulo}
          </h3>
        </Link>

        <div className="space-y-2 mt-4">
          <div className="flex items-center gap-2 text-gray-600">
            <User size={14} className="text-gray-400" />
            <span className="text-sm truncate">{book.autor}</span>
          </div>

          {book.ano && (
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar size={14} className="text-gray-400" />
              <span className="text-sm">{book.ano}</span>
            </div>
          )}
        </div>

        {/* Botão de detalhes */}
        <div className="mt-6 pt-4 border-t border-gray-100">
          <Link
            to={`/livros/${book._id}`}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-50 text-gray-700 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 text-sm font-medium"
          >
            <Eye size={16} />
            Ver Detalhes
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BookCard;