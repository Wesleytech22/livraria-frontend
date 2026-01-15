import axios from 'axios';

// Configuração base da API
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, // 15 segundos
});

// Interceptor para adicionar loading
api.interceptors.request.use(
  (config) => {
    // Mostrar loading global se necessário
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratamento de erros
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    let errorMessage = 'Erro desconhecido';
    
    if (error.response) {
      // Erros da API
      const { status, data } = error.response;
      
      switch (status) {
        case 400:
          errorMessage = data.mensagem || 'Requisição inválida';
          break;
        case 401:
          errorMessage = 'Não autorizado';
          break;
        case 403:
          errorMessage = 'Acesso proibido';
          break;
        case 404:
          errorMessage = data.mensagem || 'Recurso não encontrado';
          break;
        case 409:
          errorMessage = data.mensagem || 'Conflito de dados';
          break;
        case 422:
          errorMessage = data.mensagem || 'Dados inválidos';
          break;
        case 500:
          errorMessage = 'Erro interno do servidor';
          break;
        default:
          errorMessage = data.mensagem || `Erro ${status}`;
      }
    } else if (error.request) {
      // Erro de rede
      if (error.code === 'ECONNABORTED') {
        errorMessage = 'Tempo de conexão esgotado. Verifique sua internet.';
      } else {
        errorMessage = 'Erro de rede. Verifique sua conexão com a internet.';
      }
    } else {
      // Erro na configuração
      errorMessage = error.message;
    }
    
    error.userMessage = errorMessage;
    return Promise.reject(error);
  }
);

export default api;