import api from './api';

const bookService = {
  // GET /livros - Listar todos os livros
  getBooks: async (page = 1, limit = 12, sort = 'titulo', direction = 'asc') => {
    try {
      const response = await api.get('/livros', {
        params: { 
          pagina: page, 
          limite: limit, 
          ordenar: sort, 
          direcao: direction 
        }
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar livros:', error);
      throw error;
    }
  },

  // GET /livros/:id - Buscar livro por ID
  getBookById: async (id) => {
    try {
      const response = await api.get(`/livros/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar livro ${id}:`, error);
      throw error;
    }
  },

  // POST /livros - Criar novo livro
  createBook: async (bookData) => {
    try {
      const response = await api.post('/livros', bookData);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar livro:', error);
      throw error;
    }
  },

  // PUT /livros/:id - Atualizar livro
  updateBook: async (id, bookData) => {
    try {
      const response = await api.put(`/livros/${id}`, bookData);
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar livro ${id}:`, error);
      throw error;
    }
  },

  // DELETE /livros/:id - Deletar livro
  deleteBook: async (id) => {
    try {
      const response = await api.delete(`/livros/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao deletar livro ${id}:`, error);
      throw error;
    }
  },

  // GET /livros/busca/:termo - Buscar por texto
  searchBooks: async (term) => {
    try {
      const response = await api.get(`/livros/busca/${term}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar por termo "${term}":`, error);
      throw error;
    }
  },

  // GET / - Informações da API
  getApiInfo: async () => {
    try {
      const response = await api.get('/');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar informações da API:', error);
      // Retorna objeto padrão em caso de erro
      return {
        mensagem: 'Bem-vindo à API de Livraria',
        desenvolvedor: 'Wesley Rodrigues',
        versao: '1.0.0',
        status: 'API operacional'
      };
    }
  },

  // GET /status - Health check
  getStatus: async () => {
    try {
      const response = await api.get('/status');
      return response.data;
    } catch (error) {
      console.error('Erro ao verificar status da API:', error);
      throw error;
    }
  }
};

export default bookService;