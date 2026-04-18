import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Edit2, Trash2, User, Calendar } from 'lucide-react';
import { toast } from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';
import bookService from '../services/bookService';

const BookDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchBookDetails();
  }, [id]);

  const fetchBookDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await bookService.getBookById(id);
      setBook(response.dados);
    } catch (err) {
      console.error('Erro ao buscar livro:', err);
      setError('Não foi possível carregar os detalhes do livro.');
      toast.error('Livro não encontrado');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Tem certeza que deseja excluir este livro?')) {
      return;
    }

    setDeleting(true);
    try {
      await bookService.deleteBook(id);
      toast.success('Livro excluído com sucesso!');
      navigate('/livros');
    } catch (err) {
      console.error('Erro ao excluir livro:', err);
      toast.error('Erro ao excluir livro');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Carregando detalhes do livro..." />;
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{error}</p>
        </div>
        <div className="mt-6 text-center">
          <Link to="/livros" className="btn btn-primary">
            <ArrowLeft size={16} className="mr-2" />
            Voltar para Livros
          </Link>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Livro não encontrado</h2>
        <p className="text-gray-600 mb-6">O livro solicitado não existe ou foi removido.</p>
        <Link to="/livros" className="btn btn-primary">
          Ver Todos os Livros
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Link
          to="/livros"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-primary-600 transition-colors"
        >
          <ArrowLeft size={16} />
          Voltar para Livros
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{book.titulo}</h1>
          <div className="flex items-center gap-2">
            <User size={16} className="text-gray-400" />
            <span className="text-lg text-gray-600">{book.autor}</span>
          </div>
        </div>

        <div className="flex gap-2">
          <Link
            to={`/editar/${book._id}`}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center gap-2"
          >
            <Edit2 size={16} />
            Editar
          </Link>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <Trash2 size={16} />
            {deleting ? 'Excluindo...' : 'Excluir'}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Informações do Livro</h2>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <User className="text-gray-400" size={20} />
            <div>
              <p className="text-sm text-gray-500">Autor</p>
              <p className="font-medium">{book.autor || 'Não informado'}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Calendar className="text-gray-400" size={20} />
            <div>
              <p className="text-sm text-gray-500">Ano de Publicação</p>
              <p className="font-medium">{book.ano || 'Não informado'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetail;