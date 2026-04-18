import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, BookOpen } from 'lucide-react';
import { toast } from 'react-hot-toast';
import BookCard from '../components/BookCard';
import LoadingSpinner from '../components/LoadingSpinner';
import bookService from '../services/bookService';

const Books = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await bookService.getBooks();
      setBooks(response.dados || []);
    } catch (err) {
      console.error('Erro ao buscar livros:', err);
      toast.error('Erro ao carregar livros');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (bookId) => {
    if (!window.confirm('Tem certeza que deseja excluir este livro?')) {
      return;
    }

    try {
      await bookService.deleteBook(bookId);
      toast.success('Livro excluído com sucesso!');
      fetchBooks();
    } catch (err) {
      console.error('Erro ao excluir livro:', err);
      toast.error('Erro ao excluir livro');
    }
  };

  const filteredBooks = books.filter(book =>
    book.titulo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.autor?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <LoadingSpinner text="Carregando livros..." />;
  }

  return (
    <div className="space-y-8">
      {/* Cabeçalho */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-3">📚 Meus Livros</h1>
        <p className="text-gray-500 text-lg">Explore, gerencie e descubra novos livros</p>
      </div>

      {/* Barra de ações */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Buscar por título ou autor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
          />
        </div>

        <Link
          to="/adicionar"
          className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md hover:shadow-lg"
        >
          <Plus size={18} />
          Adicionar Livro
        </Link>
      </div>

      {/* Estatísticas */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-4">
        <div className="flex justify-between items-center">
          <div>
            <span className="text-2xl font-bold text-blue-600">{filteredBooks.length}</span>
            <span className="text-gray-600 ml-2">
              {filteredBooks.length === 1 ? 'livro encontrado' : 'livros encontrados'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <BookOpen size={18} className="text-blue-600" />
            <span className="text-sm text-gray-600">Total: {books.length} livros</span>
          </div>
        </div>
      </div>

      {/* Grid de livros */}
      {filteredBooks.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <BookOpen size={64} className="mx-auto" />
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            {searchTerm ? 'Nenhum livro encontrado' : 'Nenhum livro cadastrado'}
          </h3>
          <p className="text-gray-500 mb-6">
            {searchTerm
              ? 'Tente buscar por outro termo'
              : 'Comece adicionando seu primeiro livro'}
          </p>
          {!searchTerm && (
            <Link
              to="/adicionar"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
            >
              <Plus size={18} />
              Adicionar Primeiro Livro
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredBooks.map((book) => (
            <BookCard key={book._id} book={book} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Books;