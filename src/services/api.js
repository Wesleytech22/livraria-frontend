import axios from 'axios';

// Configuração base da API
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 30000, // 30 segundos para produção
});

// Interceptor para requisição
api.interceptors.request.use(
  (config) => {
    // Pode adicionar token de autenticação aqui no futuro
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }

    // Log em desenvolvimento
    if (import.meta.env.DEV) {
      console.log(`📤 ${config.method?.toUpperCase()} ${config.url}`, config.data);
    }

    return config;
  },
  (error) => {
    console.error('❌ Erro na requisição:', error);
    return Promise.reject(error);
  }
);

// Interceptor para resposta
api.interceptors.response.use(
  (response) => {
    // Log em desenvolvimento
    if (import.meta.env.DEV) {
      console.log(`📥 ${response.status} ${response.config.url}`, response.data);
    }
    return response;
  },
  (error) => {
    let errorMessage = 'Erro desconhecido';
    let statusCode = null;

    if (error.response) {
      // Erros da API (resposta do servidor)
      const { status, data } = error.response;
      statusCode = status;

      switch (status) {
        case 400:
          errorMessage = data.mensagem || data.error || 'Requisição inválida';
          break;
        case 401:
          errorMessage = 'Não autorizado. Faça login novamente.';
          break;
        case 403:
          errorMessage = 'Acesso proibido. Você não tem permissão.';
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
        case 429:
          errorMessage = 'Muitas requisições. Aguarde um momento.';
          break;
        case 500:
          errorMessage = 'Erro interno do servidor. Tente novamente mais tarde.';
          break;
        case 502:
        case 503:
        case 504:
          errorMessage = 'Servidor indisponível. Tente novamente mais tarde.';
          break;
        default:
          errorMessage = data.mensagem || data.error || `Erro ${status}`;
      }

      // Log do erro em desenvolvimento
      if (import.meta.env.DEV) {
        console.error(`❌ API Error ${status}:`, errorMessage);
        console.error('Detalhes:', data);
      }
    } else if (error.request) {
      // Erro de rede (sem resposta do servidor)
      statusCode = 0;

      if (error.code === 'ECONNABORTED') {
        errorMessage = 'Tempo de conexão esgotado. Verifique sua internet e tente novamente.';
      } else if (error.message === 'Network Error') {
        errorMessage = 'Erro de rede. Verifique se o servidor está rodando e sua conexão com a internet.';
      } else {
        errorMessage = 'Erro de conexão. Não foi possível se conectar ao servidor.';
      }

      if (import.meta.env.DEV) {
        console.error('❌ Network Error:', error.message);
      }
    } else {
      // Erro na configuração da requisição
      errorMessage = error.message || 'Erro ao configurar a requisição';

      if (import.meta.env.DEV) {
        console.error('❌ Request Error:', error.message);
      }
    }

    // Adiciona informações úteis ao erro
    error.userMessage = errorMessage;
    error.statusCode = statusCode;

    return Promise.reject(error);
  }
);

// Função para verificar status da API
export const checkApiStatus = async () => {
  try {
    const response = await api.get('/');
    return { online: true, data: response.data };
  } catch (error) {
    return { online: false, error: error.userMessage };
  }
};

// Função para obter a URL base atual
export const getApiBaseUrl = () => API_BASE_URL;

export default api;