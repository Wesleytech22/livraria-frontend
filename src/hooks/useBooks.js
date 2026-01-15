import { useState, useEffect, useCallback } from 'react';
import bookService from '../services/bookService';
import { toast } from 'react-hot-toast';

export const useBooks = (initialParams = {}) => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0
  });

  const fetchBooks = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const page = params.page || pagination.page;
      const limit = params.limit || pagination.limit;
      const sort = params.sort || 'titulo';
      const direction = params.direction || 'asc';
      const searchTerm = params.searchTerm;

      let response;
      if (searchTerm) {
        response = await bookService.searchBooks(searchTerm);
        setBooks(response.dados || []);
        setPagination(prev => ({
          ...prev,
          total: response.resultados || 0,
          totalPages: 1
        }));
      } else {
        response = await bookService.getBooks(page, limit, sort, direction);
        setBooks(response.dados || []);
        setPagination({
          page: response.paginacao?.pagina || page,
          limit: response.paginacao?.limite || limit,
          total: response.paginacao?.total || 0,
          totalPages: response.paginacao?.totalPaginas || 0,
          hasNext: response.paginacao?.hasNext || false,
          hasPrev: response.paginacao?.hasPrev || false
        });
      }
    } catch (err) {
      console.error('Erro ao buscar livros:', err);
      setError(err.userMessage || 'Erro ao carregar livros');
      toast.error(err.userMessage || 'Erro ao carregar livros');
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit]);

  const createBook = async (bookData) => {
    try {
      const response = await bookService.createBook(bookData);
      toast.success('Livro criado com sucesso!');
      // Atualizar a lista
      fetchBooks();
      return response;
    } catch (err) {
      console.error('Erro ao criar livro:', err);
      toast.error(err.userMessage || 'Erro ao criar livro');
      throw err;
    }
  };

  const updateBook = async (id, bookData) => {
    try {
      const response = await bookService.updateBook(id, bookData);
      toast.success('Livro atualizado com sucesso!');
      // Atualizar a lista
      fetchBooks();
      return response;
    } catch (err) {
      console.error('Erro ao atualizar livro:', err);
      toast.error(err.userMessage || 'Erro ao atualizar livro');
      throw err;
    }
  };

  const deleteBook = async (id) => {
    try {
      const response = await bookService.deleteBook(id);
      toast.success('Livro excluído com sucesso!');
      // Atualizar a lista
      fetchBooks();
      return response;
    } catch (err) {
      console.error('Erro ao excluir livro:', err);
      toast.error(err.userMessage || 'Erro ao excluir livro');
      throw err;
    }
  };

  const searchBooks = async (term) => {
    await fetchBooks({ searchTerm: term, page: 1 });
  };

  const changePage = (page) => {
    fetchBooks({ page });
  };

  const changeLimit = (limit) => {
    fetchBooks({ limit, page: 1 });
  };

  useEffect(() => {
    fetchBooks(initialParams);
  }, []);

  return {
    books,
    loading,
    error,
    pagination,
    fetchBooks,
    createBook,
    updateBook,
    deleteBook,
    searchBooks,
    changePage,
    changeLimit
  };
};