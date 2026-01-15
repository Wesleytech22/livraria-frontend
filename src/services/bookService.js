import api from './api';
import { googleBooksService } from './googleBooks';

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
  },

  // Buscar livros da sua API e enriquecer com capas do Google Books
  getBooksWithCovers: async (page = 1, limit = 12) => {
    try {
      // 1. Buscar livros da sua API
      const localBooks = await bookService.getBooks(page, limit);
      
      // Se não houver livros, retorna vazio
      if (!localBooks.dados || localBooks.dados.length === 0) {
        return localBooks;
      }
      
      // 2. Para cada livro, buscar capa no Google Books
      const booksWithCovers = await Promise.all(
        localBooks.dados.map(async (book) => {
          try {
            let coverUrl = '';
            let googleBookData = null;
            
            // Tentar buscar por ISBN primeiro
            if (book.isbn) {
              const cleanISBN = book.isbn.replace(/[-\s]/g, '');
              if (cleanISBN.length >= 10) {
                googleBookData = await googleBooksService.getBookByISBN(cleanISBN);
                if (googleBookData.items && googleBookData.items.length > 0) {
                  const volumeInfo = googleBookData.items[0].volumeInfo;
                  coverUrl = volumeInfo?.imageLinks?.thumbnail || 
                            volumeInfo?.imageLinks?.smallThumbnail || '';
                }
              }
            }
            
            // Se não encontrou por ISBN, tenta por título e autor
            if (!coverUrl && book.titulo && book.autor) {
              const searchQuery = `${book.titulo} ${book.autor}`.substring(0, 100);
              googleBookData = await googleBooksService.searchBooks(searchQuery, 1);
              if (googleBookData.items && googleBookData.items.length > 0) {
                const volumeInfo = googleBookData.items[0].volumeInfo;
                coverUrl = volumeInfo?.imageLinks?.thumbnail || 
                          volumeInfo?.imageLinks?.smallThumbnail || '';
              }
            }
            
            // Gerar placeholder se não encontrou capa
            if (!coverUrl) {
              // Placeholder com cores baseadas no título
              const colors = ['3b82f6', '10b981', '8b5cf6', 'f59e0b', 'ef4444'];
              const colorIndex = (book.titulo?.length || 0) % colors.length;
              const text = encodeURIComponent((book.titulo?.substring(0, 20) || 'Livro').replace(/\s+/g, '+'));
              coverUrl = `https://via.placeholder.com/150x200/${colors[colorIndex]}/ffffff?text=${text}`;
            }
            
            return {
              ...book,
              coverUrl,
              hasCover: coverUrl && !coverUrl.includes('placeholder.com')
            };
            
          } catch (error) {
            console.log(`Não foi possível buscar capa para: ${book.titulo}`, error.message);
            // Placeholder em caso de erro
            const text = encodeURIComponent((book.titulo?.substring(0, 20) || 'Livro').replace(/\s+/g, '+'));
            return {
              ...book,
              coverUrl: `https://via.placeholder.com/150x200/6b7280/ffffff?text=${text}`,
              hasCover: false
            };
          }
        })
      );
      
      return {
        ...localBooks,
        dados: booksWithCovers
      };
      
    } catch (error) {
      console.error('Erro ao buscar livros com capas:', error);
      throw error;
    }
  },

  // Sugerir livros do Google Books para cadastro
  suggestBooks: async (searchTerm, limit = 10) => {
    try {
      if (!searchTerm || searchTerm.trim().length < 2) {
        return [];
      }
      
      const googleData = await googleBooksService.searchBooks(searchTerm.trim(), limit);
      
      if (!googleData.items || googleData.items.length === 0) {
        return [];
      }
      
      return googleData.items.map(item => {
        const googleBook = googleBooksService.formatBookData(item);
        return {
          googleBook,
          rawData: item,
          hasCover: !!(googleBook.capaPequena || googleBook.capaMedia || googleBook.capaGrande)
        };
      });
    } catch (error) {
      console.error('Erro ao sugerir livros:', error);
      return [];
    }
  },

  // Buscar livro específico por ISBN no Google Books
  getBookFromGoogleBooks: async (isbn) => {
    try {
      if (!isbn) return null;
      
      const cleanISBN = isbn.replace(/[-\s]/g, '');
      const googleData = await googleBooksService.getBookByISBN(cleanISBN);
      
      if (!googleData.items || googleData.items.length === 0) {
        return null;
      }
      
      const googleBook = googleBooksService.formatBookData(googleData.items[0]);
      return {
        googleBook,
        rawData: googleData.items[0],
        hasCover: !!(googleBook.capaPequena || googleBook.capaMedia || googleBook.capaGrande)
      };
    } catch (error) {
      console.error('Erro ao buscar livro do Google Books:', error);
      return null;
    }
  },

  // Criar livro com dados do Google Books
  createBookFromGoogle: async (googleBookData) => {
    try {
      const bookData = {
        titulo: googleBookData.titulo,
        autor: googleBookData.autor,
        editora: googleBookData.editora,
        anoPublicacao: googleBookData.dataPublicacao?.substring(0, 4) || new Date().getFullYear(),
        isbn: googleBookData.isbn || '',
        paginas: googleBookData.paginas || 0,
        preco: googleBookData.preco || 0,
        capaUrl: googleBookData.capaMedia || googleBookData.capaPequena || '',
        desenvolvedor: 'Importado do Google Books',
        // Campos adicionais que podem ser úteis
        descricao: googleBookData.descricao || '',
        categoria: googleBookData.categoria || '',
        idioma: googleBookData.idioma || 'pt'
      };
      
      return await bookService.createBook(bookData);
    } catch (error) {
      console.error('Erro ao criar livro do Google:', error);
      throw error;
    }
  },

  // Verificar se um livro já existe na base por ISBN
  checkBookExists: async (isbn) => {
    try {
      if (!isbn) return false;
      
      // Busca na sua API por livros com esse ISBN
      const books = await bookService.searchBooks(isbn);
      return books.dados && books.dados.length > 0;
    } catch (error) {
      console.error('Erro ao verificar se livro existe:', error);
      return false;
    }
  },

  // Buscar capa para um livro específico
  getBookCover: async (book) => {
    try {
      let coverUrl = '';
      
      // Se já tem capa URL, retorna ela
      if (book.capaUrl) {
        return book.capaUrl;
      }
      
      // Busca por ISBN
      if (book.isbn) {
        const googleData = await googleBooksService.getBookByISBN(book.isbn);
        if (googleData.items && googleData.items.length > 0) {
          const volumeInfo = googleData.items[0].volumeInfo;
          coverUrl = volumeInfo?.imageLinks?.thumbnail || 
                    volumeInfo?.imageLinks?.smallThumbnail || '';
        }
      }
      
      // Se não encontrou, tenta por título
      if (!coverUrl && book.titulo) {
        const searchQuery = `${book.titulo} ${book.autor || ''}`.substring(0, 100);
        const googleData = await googleBooksService.searchBooks(searchQuery, 1);
        if (googleData.items && googleData.items.length > 0) {
          const volumeInfo = googleData.items[0].volumeInfo;
          coverUrl = volumeInfo?.imageLinks?.thumbnail || 
                    volumeInfo?.imageLinks?.smallThumbnail || '';
        }
      }
      
      // Se ainda não encontrou, cria placeholder
      if (!coverUrl) {
        const colors = ['3b82f6', '10b981', '8b5cf6', 'f59e0b', 'ef4444'];
        const colorIndex = (book.titulo?.length || 0) % colors.length;
        const text = encodeURIComponent((book.titulo?.substring(0, 20) || 'Livro').replace(/\s+/g, '+'));
        coverUrl = `https://via.placeholder.com/150x200/${colors[colorIndex]}/ffffff?text=${text}`;
      }
      
      return coverUrl;
    } catch (error) {
      console.error('Erro ao buscar capa:', error);
      const text = encodeURIComponent((book.titulo?.substring(0, 20) || 'Livro').replace(/\s+/g, '+'));
      return `https://via.placeholder.com/150x200/6b7280/ffffff?text=${text}`;
    }
  }
};

export default bookService;