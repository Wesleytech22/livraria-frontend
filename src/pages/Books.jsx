import { useState, useEffect } from 'react';
import { 
  FaSearch, FaEdit, FaTrash, FaEye, FaSort, 
  FaSortUp, FaSortDown, FaPlus, FaFilter, 
  FaFileExport, FaSync 
} from 'react-icons/fa';
import { bookService } from '../services/api';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import BookModal from '../components/BookModal';

const Books = () => {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortField, setSortField] = useState('titulo');
  const [sortDirection, setSortDirection] = useState('asc');
  const [selectedBook, setSelectedBook] = useState(null);
  const [modalType, setModalType] = useState(null);
  const [selectedBooks, setSelectedBooks] = useState([]);

  useEffect(() => {
    fetchBooks();
  }, [page, sortField, sortDirection]);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const data = await bookService.getAll(page, 10, sortField, sortDirection);
      setBooks(data.dados || []);
      setTotalPages(data.paginacao?.totalPaginas || 1);
    } catch (error) {
      toast.error('Erro ao carregar livros');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!search.trim()) {
      fetchBooks();
      return;
    }
    
    try {
      setLoading(true);
      const data = await bookService.search(search);
      setBooks(data.dados || []);
      setTotalPages(1);
    } catch (error) {
      toast.error('Erro na busca');
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
    if (!window.confirm('Tem certeza que deseja excluir este livro?')) return;
    
    try {
      await bookService.delete(id);
      toast.success('Livro excluído com sucesso!');
      fetchBooks();
    } catch (error) {
      toast.error('Erro ao excluir livro');
    }
  };

  const handleBulkDelete = async () => {
    if (selectedBooks.length === 0) {
      toast.error('Selecione livros para excluir');
      return;
    }
    
    if (!window.confirm(`Excluir ${selectedBooks.length} livro(s)?`)) return;
    
    try {
      for (const id of selectedBooks) {
        await bookService.delete(id);
      }
      toast.success(`${selectedBooks.length} livro(s) excluído(s)!`);
      setSelectedBooks([]);
      fetchBooks();
    } catch (error) {
      toast.error('Erro ao excluir livros');
    }
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedBooks(books.map(book => book._id));
    } else {
      setSelectedBooks([]);
    }
  };

  const handleSelectBook = (id, checked) => {
    if (checked) {
      setSelectedBooks([...selectedBooks, id]);
    } else {
      setSelectedBooks(selectedBooks.filter(bookId => bookId !== id));
    }
  };

  const getSortIcon = (field) => {
    if (sortField !== field) return <FaSort className="text-gray-400" />;
    return sortDirection === 'asc' ? 
      <FaSortUp className="text-primary" /> : 
      <FaSortDown className="text-primary" />;
  };

  return (
    <div className="books-page">
      <div className="page-header">
        <div>
          <h1>📚 Gerenciar Livros</h1>
          <p>Gerencie todos os livros do seu catálogo</p>
        </div>
        <div className="header-actions">
          <button 
            className="btn btn-secondary"
            onClick={() => navigate('/books/new')}
          >
            <FaPlus /> Novo Livro
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="card mb-6">
        <div className="search-filters">
          <div className="search-box">
            <FaSearch />
            <input
              type="text"
              placeholder="Buscar por título, autor, editora..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button onClick={handleSearch} className="btn btn-primary">
              Buscar
            </button>
          </div>
          
          <div className="filters">
            <button className="btn btn-outline">
              <FaFilter /> Filtrar
            </button>
            <button className="btn btn-outline" onClick={fetchBooks}>
              <FaSync /> Atualizar
            </button>
            {selectedBooks.length > 0 && (
              <button className="btn btn-danger" onClick={handleBulkDelete}>
                <FaTrash /> Excluir ({selectedBooks.length})
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Books Table */}
      <div className="card">
        <div className="table-responsive">
          {loading ? (
            <div className="loading-table">
              <div className="spinner"></div>
              <p>Carregando livros...</p>
            </div>
          ) : books.length === 0 ? (
            <div className="empty-state">
              <FaBook size={48} />
              <h3>Nenhum livro encontrado</h3>
              <p>{search ? 'Tente uma busca diferente' : 'Comece adicionando seu primeiro livro!'}</p>
              <button 
                className="btn btn-primary mt-4"
                onClick={() => navigate('/books/new')}
              >
                <FaPlus /> Adicionar Livro
              </button>
            </div>
          ) : (
            <>
              <table className="books-table">
                <thead>
                  <tr>
                    <th style={{ width: '50px' }}>
                      <input
                        type="checkbox"
                        onChange={(e) => handleSelectAll(e.target.checked)}
                        checked={selectedBooks.length === books.length && books.length > 0}
                      />
                    </th>
                    <th onClick={() => handleSort('titulo')}>
                      <div className="sortable">
                        Título {getSortIcon('titulo')}
                      </div>
                    </th>
                    <th onClick={() => handleSort('autor')}>
                      <div className="sortable">
                        Autor {getSortIcon('autor')}
                      </div>
                    </th>
                    <th onClick={() => handleSort('editora')}>
                      <div className="sortable">
                        Editora {getSortIcon('editora')}
                      </div>
                    </th>
                    <th onClick={() => handleSort('preco')}>
                      <div className="sortable">
                        Preço {getSortIcon('preco')}
                      </div>
                    </th>
                    <th>Páginas</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {books.map((book) => (
                    <tr key={book._id} className="book-row">
                      <td>
                        <input
                          type="checkbox"
                          checked={selectedBooks.includes(book._id)}
                          onChange={(e) => handleSelectBook(book._id, e.target.checked)}
                        />
                      </td>
                      <td>
                        <div className="book-title">
                          <strong>{book.titulo}</strong>
                          {book.isbn && (
                            <span className="isbn">ISBN: {book.isbn}</span>
                          )}
                        </div>
                      </td>
                      <td>{book.autor || '—'}</td>
                      <td>{book.editora || '—'}</td>
                      <td>
                        <span className="price">
                          R$ {book.preco?.toFixed(2) || '0,00'}
                        </span>
                      </td>
                      <td>{book.paginas || '—'}</td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="btn-icon"
                            onClick={() => navigate(`/books/${book._id}`)}
                            title="Visualizar"
                          >
                            <FaEye />
                          </button>
                          <button
                            className="btn-icon"
                            onClick={() => navigate(`/books/edit/${book._id}`)}
                            title="Editar"
                          >
                            <FaEdit />
                          </button>
                          <button
                            className="btn-icon danger"
                            onClick={() => handleDelete(book._id)}
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
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="pagination">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="btn btn-outline"
                  >
                    Anterior
                  </button>
                  
                  <div className="page-info">
                    Página <strong>{page}</strong> de <strong>{totalPages}</strong>
                  </div>
                  
                  <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="btn btn-outline"
                  >
                    Próxima
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Modal */}
      {modalType && selectedBook && (
        <BookModal
          book={selectedBook}
          type={modalType}
          onClose={() => {
            setModalType(null);
            setSelectedBook(null);
          }}
          onSuccess={fetchBooks}
        />
      )}
    </div>
  );
};

export default Books;