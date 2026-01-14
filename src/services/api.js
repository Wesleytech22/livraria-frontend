import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Interceptor para tratamento de erros
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const message = error.response?.data?.message || 'Erro na conexão com o servidor';
    
    if (error.response?.status === 404) {
      toast.error('Recurso não encontrado');
    } else if (error.response?.status === 400) {
      toast.error('Dados inválidos. Verifique os campos.');
    } else if (error.response?.status === 500) {
      toast.error('Erro interno do servidor');
    } else if (error.code === 'ECONNABORTED') {
      toast.error('Tempo de conexão esgotado');
    } else {
      toast.error(message);
    }
    
    return Promise.reject(error);
  }
);

// Serviços para Livros
export const bookService = {
  // Listar todos os livros
  getAll: async (page = 1, limit = 10) => {
    try {
      const response = await api.get(`/livros?pagina=${page}&limite=${limit}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Buscar livro por ID
  getById: async (id) => {
    try {
      const response = await api.get(`/livros/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Criar novo livro
  create: async (bookData) => {
    try {
      const response = await api.post('/livros', bookData);
      toast.success('Livro criado com sucesso!');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Atualizar livro
  update: async (id, bookData) => {
    try {
      const response = await api.put(`/livros/${id}`, bookData);
      toast.success('Livro atualizado com sucesso!');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Deletar livro
  delete: async (id) => {
    try {
      const response = await api.delete(`/livros/${id}`);
      toast.success('Livro deletado com sucesso!');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Buscar por termo
  search: async (term) => {
    try {
      const response = await api.get(`/livros/busca/${term}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Health check
  getStatus: async () => {
    try {
      const response = await api.get('/status');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Documentação
  getDocs: async () => {
    try {
      const response = await api.get('/');
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default api;