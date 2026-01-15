import React from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, User, Building, DollarSign, Calendar, 
  FileText, Edit2, Trash2, Eye, Star 
} from 'lucide-react';

const BookCard = ({ book, onDelete }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price || 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Data não disponível';
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <div className="card group hover:shadow-lg transition-all duration-300 animate-fade-in">
      <div className="p-6">
        {/* Header com ações */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-gray-800 group-hover:text-primary-600 transition-colors truncate">
              {book.titulo || 'Título não informado'}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <User size={14} className="text-gray-400 flex-shrink-0" />
              <span className="text-sm text-gray-600 truncate">
                {book.autor || 'Autor não informado'}
              </span>
            </div>
          </div>
          
          <div className="flex gap-1 ml-2 flex-shrink-0">
            <Link
              to={`/livros/${book._id}`}
              className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
              title="Visualizar"
            >
              <Eye size={16} />
            </Link>
            <Link
              to={`/editar/${book._id}`}
              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Editar"
            >
              <Edit2 size={16} />
            </Link>
            <button
              onClick={() => onDelete(book._id)}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Excluir"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
        
        {/* Detalhes do livro */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Building size={14} className="text-gray-400 flex-shrink-0" />
            <span className="text-sm text-gray-600 truncate">
              {book.editora || 'Editora não informada'}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <Calendar size={14} className="text-gray-400 flex-shrink-0" />
            <span className="text-sm text-gray-600">
              {book.anoPublicacao || 'Ano não informado'}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText size={14} className="text-gray-400 flex-shrink-0" />
              <span className="text-sm text-gray-600">
                {book.paginas || 0} páginas
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <DollarSign size={14} className="text-gray-400 flex-shrink-0" />
              <span className="text-lg font-bold text-primary-600">
                {formatPrice(book.preco)}
              </span>
            </div>
          </div>
        </div>
        
        {/* Footer com informações adicionais */}
        <div className="mt-6 pt-4 border-t border-gray-100">
          <div className="flex justify-between items-center">
            <div className="text-xs text-gray-500 truncate max-w-[60%]">
              <BookOpen size={12} className="inline mr-1" />
              ISBN: {book.isbn || 'Não informado'}
            </div>
            
            <div className="text-xs text-gray-500 text-right">
              {book.createdAt && `Criado: ${formatDate(book.createdAt)}`}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookCard;