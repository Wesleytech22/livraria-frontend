/**
 * Formata um valor numérico para moeda brasileira (BRL)
 * @param {number} value - Valor a ser formatado
 * @returns {string} Valor formatado em reais
 */
export const formatCurrency = (value) => {
  if (value === null || value === undefined) return 'R$ 0,00';
  
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

/**
 * Formata uma data para o formato brasileiro
 * @param {string|Date} dateString - Data a ser formatada
 * @param {boolean} includeTime - Incluir hora na formatação
 * @returns {string} Data formatada
 */
export const formatDate = (dateString, includeTime = false) => {
  if (!dateString) return 'Data não disponível';
  
  const date = new Date(dateString);
  
  if (isNaN(date.getTime())) {
    return 'Data inválida';
  }
  
  const options = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    ...(includeTime && {
      hour: '2-digit',
      minute: '2-digit'
    })
  };
  
  return date.toLocaleDateString('pt-BR', options);
};

/**
 * Trunca um texto se for muito longo
 * @param {string} text - Texto a ser truncado
 * @param {number} maxLength - Tamanho máximo permitido
 * @returns {string} Texto truncado
 */
export const truncateText = (text, maxLength = 50) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Valida se uma string parece ser um ISBN válido
 * @param {string} isbn - ISBN a ser validado
 * @returns {boolean} True se parecer válido
 */
export const isValidISBN = (isbn) => {
  if (!isbn) return true; // ISBN é opcional
  
  // Remove hífens e espaços
  const cleanISBN = isbn.replace(/[-\s]/g, '');
  
  // ISBN-10 ou ISBN-13
  const isbnRegex = /^(?:\d{9}[\dX]|\d{13})$/;
  return isbnRegex.test(cleanISBN);
};

/**
 * Gera uma cor baseada em uma string (para avatares, etc)
 * @param {string} str - String para gerar a cor
 * @returns {string} Cor em formato hexadecimal
 */
export const stringToColor = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const colors = [
    '#3B82F6', // blue
    '#10B981', // green
    '#8B5CF6', // purple
    '#F59E0B', // yellow
    '#EF4444', // red
    '#EC4899', // pink
    '#06B6D4', // cyan
    '#84CC16', // lime
  ];
  
  return colors[Math.abs(hash) % colors.length];
};

/**
 * Capitaliza a primeira letra de cada palavra
 * @param {string} text - Texto a ser capitalizado
 * @returns {string} Texto capitalizado
 */
export const capitalizeWords = (text) => {
  if (!text) return '';
  return text
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Remove acentos de uma string
 * @param {string} text - Texto com acentos
 * @returns {string} Texto sem acentos
 */
export const removeAccents = (text) => {
  if (!text) return '';
  return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
};

/**
 * Debounce function para otimizar pesquisas
 * @param {Function} func - Função a ser debounced
 * @param {number} wait - Tempo de espera em ms
 * @returns {Function} Função debounced
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};