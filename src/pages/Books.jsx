import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import BookCard from '../components/BookCard';
import Pagination from '../components/Pagination';
import SearchBar from '../components/SearchBar';
import LoadingSpinner from '../components/LoadingSpinner';
import Alert from '../components/Alert';
import bookService from '../services/bookService';

const Books = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [sortBy, setSortBy] = useState('titulo');
  const [sortDirection, setSortDirection] = useState('asc');

  // Inicializar parâmetros da URL
  useEffect(() => {
    const page = parseInt(searchParams.get('pagina')) || 1;
    const limit = parseInt(searchParams.get('limite')) || 12;
    const sort = searchParams.get('ordenar') || 'titulo';
    const direction = searchParams.get('direcao') || 'asc';
    
    setCurrentPage(page);
    setItemsPerPage(limit);
    setSortBy(sort);
    setSortDirection(direction);
  }, [searchParams]);

  // Buscar livros
  useEffect(() => {
    fetchBooks();
  }, [currentPage, itemsPerPage, sortBy, sortDirection, searchTerm]);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let response;
      if (searchTerm) {
        response = await bookService.searchBooks(searchTerm);
        setBooks(response.dados || []);
        setTotalItems(response.resultados || 0);
      } else {
        response = await bookService.getBooks(
          currentPage, 
          itemsPerPage, 
          sortBy, 
          sortDirection
        );
        setBooks(response.dados || []);
        setTotalItems(response.paginacao?.total || 0);
      }
    } catch (err) {
      console.error('Erro ao buscar livros:', err);
      setError('Não foi possível carregar os livros. Tente novamente.');
      toast.error('Erro ao carregar livros');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (params) => {
    setSearchTerm(params.term || '');
    if (!params.term) {
      // Se busca limpa, volta para página 1
      setCurrentPage(1);
      updateUrlParams(1, itemsPerPage, sortBy, sortDirection);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    updateUrlParams(page, itemsPerPage, sortBy, sortDirection);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleItemsPerPageChange = (limit) => {
    setItemsPerPage(limit);
    setCurrentPage(1); // Volta para primeira página ao mudar limite
    updateUrlParams(1, limit, sortBy, sortDirection);
  };

  const handleFilterChange = (filters) => {
    setSortBy(filters.sortBy);
    setSortDirection(filters.sortDirection);
    updateUrlParams(currentPage, itemsPerPage, filters.sortBy, filters.sortDirection);
  };

  const updateUrlParams = (page, limit, sort, direction) => {
    const params = new URLSearchParams();
    params.set('pagina', page);
    params.set('limite', limit);
    params.set('ordenar', sort);
    params.set('direcao', direction);
    setSearchParams(params);
  };

  const handleDeleteBook = async (bookId) => {
    if (!window.confirm('Tem certeza que deseja excluir este livro?')) {
      return;
    }

    try {
      await bookService.deleteBook(bookId);
      toast.success('Livro excluído com sucesso!');
      // Recarregar a lista
      fetchBooks();
    } catch (err) {
      console.error('Erro ao excluir livro:', err);
      toast.error('Erro ao excluir livro');
    }
  };

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  if (loading && books.length === 0) {
    return <LoadingSpinner text="Carregando livros..." />;
  }

  return (
    <div className="space-y-8">
      {/* Cabeçalho */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Catálogo de Livros</h1>
        <p className="text-gray-600">
          {searchTerm 
            ? `Resultados da busca por "${searchTerm}"` 
            : 'Explore todos os livros disponíveis no acervo'}
        </p>
      </div>

      {/* Barra de busca */}
      <SearchBar
        onSearch={handleSearch}
        placeholder={searchTerm || "Buscar por título, autor, editora ou ISBN..."}
        showFilters={!searchTerm}
        onFilterChange={handleFilterChange}
      />

      {/* Mensagem de erro */}
      {error && (
        <Alert type="error" title="Erro" message={error} />
      )}

      {/* Resultados */}
      {books.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            {searchTerm ? 'Nenhum livro encontrado' : 'Nenhum livro cadastrado'}
          </h3>
          <p className="text-gray-500 mb-6">
            {searchTerm 
              ? 'Tente buscar por outro termo ou adicione um novo livro.'
              : 'Seja o primeiro a adicionar um livro ao acervo!'}
          </p>
        </div>
      ) : (
        <>
          {/* Grid de livros */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {books.map((book) => (
              <BookCard
                key={book._id}
                book={book}
                onDelete={handleDeleteBook}
              />
            ))}
          </div>

          {/* Paginação (apenas se não estiver pesquisando) */}
          {!searchTerm && totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              itemsPerPage={itemsPerPage}
              onItemsPerPageChange={handleItemsPerPageChange}
              totalItems={totalItems}
            />
          )}

          {/* Estatísticas */}
          <div className="text-center text-sm text-gray-500">
            Mostrando {books.length} {books.length === 1 ? 'livro' : 'livros'} 
            {!searchTerm && ` de ${totalItems} no total`}
          </div>
        </>
      )}
    </div>
  );
};

export default Books;