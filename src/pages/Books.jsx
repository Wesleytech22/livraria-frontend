import { useState, useEffect } from 'react';
import { FaSearch, FaEdit, FaTrash, FaEye, FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';
import { bookService } from '../services/api';
import BookModal from '../components/BookModal';

export default function Books() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortField, setSortField] = useState('titulo');
  const [sortDirection, setSortDirection] = useState('asc');
  const [selectedBook, setSelectedBook] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('view'); // 'view', 'edit', 'delete'

  useEffect(() => {
    fetchBooks();
  }, [currentPage, sortField, sortDirection]);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const data = await bookService.getAll(currentPage, 10);
      setBooks(data.dados || []);
      setTotalPages(data.paginacao?.totalPaginas || 1);
    } catch (error) {
      console.error('Erro ao carregar livros:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      fetchBooks();
      return;
    }
    
    try {
      setLoading(true);
      const data = await bookService.search(searchTerm);
      setBooks(data.dados || []);
      setTotalPages(1);
    } catch (error) {
      console.error('Erro na busca:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleDelete = async (id) => {
    try {
      await bookService.delete(id);
      fetchBooks();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Erro ao deletar:', error);
    }
  };

  const openModal = (book, type) => {
    setSelectedBook(book);
    setModalType(type);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedBook(null);
  };

  const renderSortIcon = (field) => {
    if (sortField !== field) return <FaSort className="text-gray-400" />;
    return sortDirection === 'asc' ? 
      <FaSortUp className="text-blue-600" /> : 
      <FaSortDown className="text-blue-600" />;
  };

  if (loading && books.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando livros...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">📚 Catálogo de Livros</h1>
          <p className="text-gray-600 mt-2">
            Gerencie todos os livros cadastrados no sistema
          </p>
        </div>
        
        <a 
          href="/add-book"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
        >
          + Adicionar Livro
        </a>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <form onSubmit={handleSearch} className="flex gap-4">
          <div className="flex-1 relative">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por título, autor ou editora..."
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            type="submit"
            className="bg-gray-800 text-white px-6 py-3 rounded-lg hover:bg-gray-900 transition font-semibold"
          >
            Buscar
          </button>
          {searchTerm && (
            <button
              type="button"
              onClick={() => {
                setSearchTerm('');
                fetchBooks();
              }}
              className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition font-semibold"
            >
              Limpar
            </button>
          )}
        </form>
      </div>

      {/* Books Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th 
                  className="py-4 px-6 text-left cursor-pointer"
                  onClick={() => handleSort('titulo')}
                >
                  <div className="flex items-center gap-2">
                    Título
                    {renderSortIcon('titulo')}
                  </div>
                </th>
                <th 
                  className="py-4 px-6 text-left cursor-pointer"
                  onClick={() => handleSort('autor')}
                >
                  <div className="flex items-center gap-2">
                    Autor
                    {renderSortIcon('autor')}
                  </div>
                </th>
                <th 
                  className="py-4 px-6 text-left cursor-pointer"
                  onClick={() => handleSort('editora')}
                >
                  <div className="flex items-center gap-2">
                    Editora
                    {renderSortIcon('editora')}
                  </div>
                </th>
                <th 
                  className="py-4 px-6 text-left cursor-pointer"
                  onClick={() => handleSort('preco')}
                >
                  <div className="flex items-center gap-2">
                    Preço
                    {renderSortIcon('preco')}
                  </div>
                </th>
                <th className="py-4 px-6 text-left">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {books.map((book) => (
                <tr key={book._id} className="hover:bg-gray-50 transition">
                  <td className="py-4 px-6">
                    <div>
                      <p className="font-semibold text-gray-800">{book.titulo}</p>
                      <p className="text-sm text-gray-500">{book.paginas} páginas</p>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <p className="text-gray-700">{book.autor}</p>
                  </td>
                  <td className="py-4 px-6">
                    <p className="text-gray-700">{book.editora}</p>
                  </td>
                  <td className="py-4 px-6">
                    <p className="font-semibold text-blue-600">
                      R$ {book.preco?.toFixed(2)}
                    </p>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex gap-2">
                      <button
                        onClick={() => openModal(book, 'view')}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        title="Ver detalhes"
                      >
                        <FaEye />
                      </button>
                      <button
                        onClick={() => openModal(book, 'edit')}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition"
                        title="Editar"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => openModal(book, 'delete')}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                        title="Excluir"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {books.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Nenhum livro encontrado
            </h3>
            <p className="text-gray-500">
              {searchTerm ? 'Tente uma busca diferente' : 'Comece adicionando seu primeiro livro!'}
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Anterior
          </button>
          
          <span className="text-gray-700">
            Página <strong>{currentPage}</strong> de <strong>{totalPages}</strong>
          </span>
          
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Próxima
          </button>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <BookModal
          book={selectedBook}
          type={modalType}
          onClose={closeModal}
          onDelete={handleDelete}
          onUpdate={fetchBooks}
        />
      )}
    </div>
  );
}