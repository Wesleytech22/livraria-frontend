import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { Search, BookOpen, Plus, Image as ImageIcon, Download } from 'lucide-react';
import bookService from '../services/bookService';

const SearchBooks = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [importing, setImporting] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setLoading(true);
    try {
      const suggestions = await bookService.suggestBooks(searchTerm);
      setResults(suggestions);
      
      if (suggestions.length === 0) {
        toast.error('Nenhum livro encontrado');
      }
    } catch (error) {
      toast.error('Erro ao buscar livros');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleImportBook = async (googleBook) => {
    if (importing) return;

    setImporting(true);
    try {
      // Converter dados do Google Books para seu formato
      const bookData = {
        titulo: googleBook.titulo,
        autor: googleBook.autor,
        editora: googleBook.editora,
        anoPublicacao: googleBook.dataPublicacao?.substring(0, 4) || new Date().getFullYear(),
        isbn: googleBook.isbn || '',
        paginas: googleBook.paginas || 0,
        preco: googleBook.preco || 0,
        // Salvar URL da capa
        capaUrl: googleBook.capaMedia || googleBook.capaPequena || '',
        desenvolvedor: 'Importado do Google Books'
      };

      // Enviar para sua API
      await bookService.createBook(bookData);
      
      toast.success('Livro importado com sucesso!');
      
      // Remover da lista de resultados
      setResults(results.filter(r => r.googleBook.titulo !== googleBook.titulo));
      
    } catch (error) {
      toast.error('Erro ao importar livro');
      console.error(error);
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-3">
          🔍 Buscar Livros no Google Books
        </h1>
        <p className="text-gray-600">
          Encontre livros com capas e importe para sua biblioteca
        </p>
      </div>

      {/* Formulário de busca */}
      <form onSubmit={handleSearch} className="mb-8">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Busque por título, autor ou ISBN..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !searchTerm.trim()}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Buscando...
              </>
            ) : (
              <>
                <Search size={20} />
                Buscar
              </>
            )}
          </button>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Exemplos: "Harry Potter", "Stephen King", "9788535902775"
        </p>
      </form>

      {/* Resultados */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Buscando livros...</p>
        </div>
      ) : results.length > 0 ? (
        <>
          <div className="mb-4 flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-800">
              {results.length} livros encontrados
            </h2>
            <div className="text-sm text-gray-500">
              Clique em "Importar" para adicionar à sua biblioteca
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((result, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
                {/* Capa do livro */}
                <div className="relative h-48 bg-gray-100">
                  {result.googleBook.capaMedia || result.googleBook.capaPequena ? (
                    <img 
                      src={result.googleBook.capaMedia || result.googleBook.capaPequena}
                      alt={result.googleBook.titulo}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.parentElement.innerHTML = `
                          <div class="w-full h-full flex items-center justify-center bg-gray-100">
                            <BookOpen class="w-12 h-12 text-gray-400" />
                          </div>
                        `;
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                      <BookOpen className="w-12 h-12 text-gray-400" />
                    </div>
                  )}
                  
                  {/* Badge */}
                  <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-medium">
                    Google Books
                  </div>
                </div>

                {/* Informações */}
                <div className="p-4">
                  <h3 className="font-bold text-gray-800 text-lg line-clamp-2 mb-2">
                    {result.googleBook.titulo}
                  </h3>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      <User size={14} />
                      <span className="text-sm">{result.googleBook.autor}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-gray-600">
                      <Building size={14} />
                      <span className="text-sm">{result.googleBook.editora || 'Editora não informada'}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar size={14} />
                      <span className="text-sm">{result.googleBook.dataPublicacao || 'Ano não informado'}</span>
                    </div>
                    
                    {result.googleBook.isbn && (
                      <div className="text-xs text-gray-500 font-mono">
                        ISBN: {result.googleBook.isbn}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => handleImportBook(result.googleBook)}
                    disabled={importing}
                    className="w-full py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {importing ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Importando...
                      </>
                    ) : (
                      <>
                        <Download size={16} />
                        Importar para Minha Biblioteca
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : searchTerm ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            Nenhum livro encontrado
          </h3>
          <p className="text-gray-500">
            Tente buscar por outro termo ou verifique a ortografia
          </p>
        </div>
      ) : null}
    </div>
  );
};

// Ícones locais (já que não temos User, Building, Calendar importados)
const User = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

const Building = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="9" y1="3" x2="9" y2="21"></line>
    <line x1="15" y1="3" x2="15" y2="21"></line>
    <line x1="3" y1="9" x2="21" y2="9"></line>
    <line x1="3" y1="15" x2="21" y2="15"></line>
  </svg>
);

const Calendar = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
);

export default SearchBooks;