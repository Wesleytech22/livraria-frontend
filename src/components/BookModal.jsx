import { useState } from 'react';
import { FaTimes, FaBook, FaUserEdit, FaBuilding, FaMoneyBillWave, FaFileAlt } from 'react-icons/fa';
import { bookService } from '../services/api';

export default function BookModal({ book, type, onClose, onDelete, onUpdate }) {
  const [loading, setLoading] = useState(false);
  const [editData, setEditData] = useState(book || {});

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveEdit = async () => {
    try {
      setLoading(true);
      await bookService.update(book._id, editData);
      onUpdate();
      onClose();
    } catch (error) {
      console.error('Erro ao atualizar:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    switch (type) {
      case 'view':
        return (
          <div className="space-y-6">
            <div className="flex items-start gap-6">
              <div className="w-32 h-44 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center">
                <span className="text-6xl">📖</span>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">{book.titulo}</h3>
                <p className="text-gray-600 text-lg">{book.autor}</p>
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">Editora</p>
                    <p className="font-semibold">{book.editora}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">Preço</p>
                    <p className="font-semibold text-blue-600">R$ {book.preco?.toFixed(2)}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">Páginas</p>
                    <p className="font-semibold">{book.paginas}</p>
                  </div>
                  {book.anoPublicacao && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500">Ano</p>
                      <p className="font-semibold">{book.anoPublicacao}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {book.isbn && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">ISBN</p>
                <p className="font-semibold font-mono">{book.isbn}</p>
              </div>
            )}
          </div>
        );

      case 'edit':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaBook className="inline mr-2" /> Título
                </label>
                <input
                  type="text"
                  name="titulo"
                  value={editData.titulo || ''}
                  onChange={handleEditChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaUserEdit className="inline mr-2" /> Autor
                </label>
                <input
                  type="text"
                  name="autor"
                  value={editData.autor || ''}
                  onChange={handleEditChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaBuilding className="inline mr-2" /> Editora
                </label>
                <input
                  type="text"
                  name="editora"
                  value={editData.editora || ''}
                  onChange={handleEditChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaMoneyBillWave className="inline mr-2" /> Preço
                </label>
                <input
                  type="number"
                  name="preco"
                  value={editData.preco || ''}
                  onChange={handleEditChange}
                  step="0.01"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Páginas
                </label>
                <input
                  type="number"
                  name="paginas"
                  value={editData.paginas || ''}
                  onChange={handleEditChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaFileAlt className="inline mr-2" /> ISBN
                </label>
                <input
                  type="text"
                  name="isbn"
                  value={editData.isbn || ''}
                  onChange={handleEditChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
          </div>
        );

      case 'delete':
        return (
          <div className="text-center py-8">
            <div className="text-6xl text-red-500 mb-4">⚠️</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              Confirmar Exclusão
            </h3>
            <p className="text-gray-600 mb-6">
              Tem certeza que deseja excluir o livro <strong>"{book.titulo}"</strong>?
              <br />
              Esta ação não pode ser desfeita.
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  const renderActions = () => {
    switch (type) {
      case 'view':
        return (
          <button
            onClick={onClose}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Fechar
          </button>
        );

      case 'edit':
        return (
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
            >
              Cancelar
            </button>
            <button
              onClick={handleSaveEdit}
              disabled={loading}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50"
            >
              {loading ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </div>
        );

      case 'delete':
        return (
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
            >
              Cancelar
            </button>
            <button
              onClick={() => onDelete(book._id)}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              Sim, Excluir
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  const getTitle = () => {
    switch (type) {
      case 'view': return 'Detalhes do Livro';
      case 'edit': return 'Editar Livro';
      case 'delete': return 'Excluir Livro';
      default: return 'Livro';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-8 py-6 flex justify-between items-center rounded-t-2xl">
          <h2 className="text-2xl font-bold text-gray-800">
            {getTitle()}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <FaTimes className="text-gray-500 text-xl" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8">
          {renderContent()}
        </div>

        {/* Actions */}
        <div className="border-t px-8 py-6 flex justify-end">
          {renderActions()}
        </div>
      </div>
    </div>
  );
}