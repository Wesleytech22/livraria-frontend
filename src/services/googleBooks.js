import axios from 'axios';

const googleBooksAPI = axios.create({
  baseURL: 'https://www.googleapis.com/books/v1',
  timeout: 10000,
  // Adicione sua API Key aqui se tiver (opcional)
  // params: {
  //   key: 'SUA_API_KEY_AQUI'
  // }
});

export const googleBooksService = {
  // Buscar livros por termo
  searchBooks: async (query, maxResults = 20) => {
    try {
      const response = await googleBooksAPI.get('/volumes', {
        params: {
          q: query,
          maxResults: maxResults,
          langRestrict: 'pt',
          printType: 'books',
          orderBy: 'relevance'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar livros:', error);
      // Retorna objeto vazio em caso de erro
      return { items: [] };
    }
  },

  // Buscar livro por ISBN
  getBookByISBN: async (isbn) => {
    try {
      const response = await googleBooksAPI.get('/volumes', {
        params: {
          q: `isbn:${isbn}`,
          maxResults: 1
        }
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar livro por ISBN:', error);
      return { items: [] };
    }
  },

  // Buscar livro por ID do Google Books
  getBookById: async (bookId) => {
    try {
      const response = await googleBooksAPI.get(`/volumes/${bookId}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar livro por ID:', error);
      throw error;
    }
  },

  // Formatar dados do livro para seu sistema
  formatBookData: (googleBook) => {
    const volumeInfo = googleBook.volumeInfo || {};
    const saleInfo = googleBook.saleInfo || {};
    
    // Extrair ISBN
    let isbn10 = '';
    let isbn13 = '';
    
    if (volumeInfo.industryIdentifiers) {
      volumeInfo.industryIdentifiers.forEach(identifier => {
        if (identifier.type === 'ISBN_10') isbn10 = identifier.identifier;
        if (identifier.type === 'ISBN_13') isbn13 = identifier.identifier;
      });
    }
    
    // Formatar data de publicação
    let publishedDate = '';
    if (volumeInfo.publishedDate) {
      publishedDate = volumeInfo.publishedDate;
    }
    
    // Formatar autores
    let authors = 'Autor desconhecido';
    if (volumeInfo.authors && volumeInfo.authors.length > 0) {
      authors = volumeInfo.authors.join(', ');
    }
    
    // Formatar categorias
    let categories = '';
    if (volumeInfo.categories && volumeInfo.categories.length > 0) {
      categories = volumeInfo.categories.join(', ');
    }
    
    // Formatar descrição (remover HTML tags)
    let description = volumeInfo.description || '';
    if (description) {
      description = description
        .replace(/<[^>]*>/g, '') // Remove HTML tags
        .replace(/\n+/g, ' ') // Remove múltiplas quebras de linha
        .substring(0, 500); // Limita tamanho
    }
    
    return {
      googleBooksId: googleBook.id,
      titulo: volumeInfo.title || 'Título não disponível',
      subtitulo: volumeInfo.subtitle || '',
      autor: authors,
      editora: volumeInfo.publisher || 'Editora não informada',
      dataPublicacao: publishedDate,
      descricao: description,
      isbn: isbn13 || isbn10 || '',
      isbn10: isbn10,
      isbn13: isbn13,
      paginas: volumeInfo.pageCount || 0,
      categoria: categories || 'Não categorizado',
      idioma: volumeInfo.language || 'pt',
      capaPequena: volumeInfo.imageLinks?.smallThumbnail || '',
      capaMedia: volumeInfo.imageLinks?.thumbnail || '',
      capaGrande: volumeInfo.imageLinks?.medium || volumeInfo.imageLinks?.large || '',
      preco: saleInfo.listPrice?.amount || 0,
      moeda: saleInfo.listPrice?.currencyCode || 'BRL',
      link: volumeInfo.previewLink || volumeInfo.infoLink || '',
      linkCompra: saleInfo.buyLink || '',
      avaliacao: volumeInfo.averageRating || 0,
      totalAvaliacoes: volumeInfo.ratingsCount || 0
    };
  },

  // Verificar se a API está disponível
  checkAvailability: async () => {
    try {
      await googleBooksAPI.get('/volumes', {
        params: {
          q: 'test',
          maxResults: 1
        }
      });
      return true;
    } catch (error) {
      console.error('Google Books API não disponível:', error.message);
      return false;
    }
  }
};