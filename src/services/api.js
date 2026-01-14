// src/services/api.js - Serviço completo
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Configuração do axios
const apiConfig = {
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
};

// Função para fazer requisições
const fetchAPI = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Serviços completos
export const bookService = {
  // Listar todos os livros com paginação
  getAll: async (page = 1, limit = 12) => {
    try {
      const data = await fetchAPI(`/livros?pagina=${page}&limite=${limit}`);
      return {
        success: true,
        books: data.dados || [],
        pagination: data.paginacao || { total: 0, pagina: 1, totalPaginas: 1 },
      };
    } catch (error) {
      return { success: false, books: [], pagination: null, error: error.message };
    }
  },

  // Buscar livro por ID
  getById: async (id) => {
    try {
      const data = await fetchAPI(`/livros/${id}`);
      return { success: true, book: data.dados || data };
    } catch (error) {
      return { success: false, book: null, error: error.message };
    }
  },

  // Criar novo livro
  create: async (bookData) => {
    try {
      const data = await fetchAPI('/livros', {
        method: 'POST',
        body: JSON.stringify(bookData),
      });
      return { success: true, book: data.dados || data, message: data.mensagem };
    } catch (error) {
      return { success: false, book: null, error: error.message };
    }
  },

  // Atualizar livro
  update: async (id, bookData) => {
    try {
      const data = await fetchAPI(`/livros/${id}`, {
        method: 'PUT',
        body: JSON.stringify(bookData),
      });
      return { success: true, book: data.dados || data, message: data.mensagem };
    } catch (error) {
      return { success: false, book: null, error: error.message };
    }
  },

  // Deletar livro
  delete: async (id) => {
    try {
      const data = await fetchAPI(`/livros/${id}`, {
        method: 'DELETE',
      });
      return { success: true, message: data.mensagem || 'Livro deletado com sucesso' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Buscar por termo
  search: async (term) => {
    try {
      const data = await fetchAPI(`/livros/busca/${term}`);
      return { success: true, books: data.dados || [] };
    } catch (error) {
      return { success: false, books: [], error: error.message };
    }
  },

  // Health check da API
  getStatus: async () => {
    try {
      const data = await fetchAPI('/status');
      return { success: true, status: data.status || 'online', uptime: data.uptime };
    } catch (error) {
      return { success: false, status: 'offline', error: error.message };
    }
  },

  // Documentação da API
  getDocs: async () => {
    try {
      const data = await fetchAPI('/');
      return { success: true, docs: data };
    } catch (error) {
      return { success: false, docs: null, error: error.message };
    }
  },
};

// Notificações (simuladas)
export const showNotification = (type, message) => {
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.innerHTML = `
    <div style="
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 15px 20px;
      background: ${type === 'success' ? '#10b981' : '#ef4444'};
      color: white;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 1000;
      animation: slideIn 0.3s ease-out;
    ">
      ${message}
    </div>
  `;
  document.body.appendChild(notification);
  setTimeout(() => notification.remove(), 3000);
};