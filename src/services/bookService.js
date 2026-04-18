import api from './api';

const bookService = {
  getBooks: async () => {
    const response = await api.get('/livros');
    return { dados: response.data };
  },

  getBookById: async (id) => {
    const response = await api.get(`/livros/${id}`);
    return { dados: response.data };
  },

  createBook: async (bookData) => {
    const response = await api.post('/livros', {
      titulo: bookData.titulo,
      autor: bookData.autor,
      ano: bookData.anoPublicacao,
    });
    return { dados: response.data };
  },

  updateBook: async (id, bookData) => {
    const response = await api.put(`/livros/${id}`, {
      titulo: bookData.titulo,
      autor: bookData.autor,
      ano: bookData.anoPublicacao,
    });
    return { dados: response.data };
  },

  deleteBook: async (id) => {
    const response = await api.delete(`/livros/${id}`);
    return response.data;
  },

  searchBooks: async (term) => {
    const response = await api.get('/livros');
    const books = response.data;
    const filtered = books.filter(book =>
      book.titulo?.toLowerCase().includes(term.toLowerCase()) ||
      book.autor?.toLowerCase().includes(term.toLowerCase())
    );
    return { dados: filtered, resultados: filtered.length };
  },

  getApiInfo: async () => {
    return {
      mensagem: 'API de Livraria',
      desenvolvedor: 'Wesley Rodrigues',
      versao: '1.0.0',
      status: 'Operacional'
    };
  },

  getStatus: async () => {
    return { status: 'online' };
  }
};

export default bookService;