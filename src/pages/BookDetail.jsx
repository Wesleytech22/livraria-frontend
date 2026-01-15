import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, Edit2, Trash2, Calendar, User, 
  Building, DollarSign, FileText, BookOpen, 
  Clock, Tag 
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';
import Alert from '../components/Alert';
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

  const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price || 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Não disponível';
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return <LoadingSpinner text="Carregando detalhes do livro..." />;
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto">
        <Alert type="error" title="Erro" message={error} />
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
      {/* Botão voltar */}
      <div className="mb-6">
        <Link
          to="/livros"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-primary-600 transition-colors"
        >
          <ArrowLeft size={16} />
          Voltar para Livros
        </Link>
      </div>

      {/* Cabeçalho com ações */}
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
            className="btn btn-secondary flex items-center gap-2"
          >
            <Edit2 size={16} />
            Editar
          </Link>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="btn btn-danger flex items-center gap-2"
          >
            <Trash2 size={16} />
            {deleting ? 'Excluindo...' : 'Excluir'}
          </button>
        </div>
      </div>

      {/* Grid de informações */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coluna principal */}
        <div className="lg:col-span-2 space-y-6">
          {/* Informações básicas */}
          <div className="card p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Informações do Livro</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Building className="text-gray-400" size={20} />
                <div>
                  <p className="text-sm text-gray-500">Editora</p>
                  <p className="font-medium">{book.editora || 'Não informada'}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Calendar className="text-gray-400" size={20} />
                <div>
                  <p className="text-sm text-gray-500">Ano de Publicação</p>
                  <p className="font-medium">{book.anoPublicacao || 'Não informado'}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <FileText className="text-gray-400" size={20} />
                <div>
                  <p className="text-sm text-gray-500">Número de Páginas</p>
                  <p className="font-medium">{book.paginas || 0} páginas</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <DollarSign className="text-gray-400" size={20} />
                <div>
                  <p className="text-sm text-gray-500">Preço</p>
                  <p className="text-2xl font-bold text-primary-600">{formatPrice(book.preco)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* ISBN */}
          <div className="card p-6">
            <div className="flex items-center gap-3 mb-4">
              <BookOpen className="text-primary-600" size={24} />
              <h2 className="text-xl font-bold text-gray-800">Identificação</h2>
            </div>
            <div className="space-y-2">
              <div>
                <p className="text-sm text-gray-500">ISBN</p>
                <p className="font-mono font-medium bg-gray-50 p-2 rounded">
                  {book.isbn || 'Não informado'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Coluna lateral */}
        <div className="space-y-6">
          {/* Metadados */}
          <div className="card p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Metadados</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Clock className="text-gray-400" size={16} />
                <div>
                  <p className="text-sm text-gray-500">Criado em</p>
                  <p className="font-medium text-sm">{formatDate(book.createdAt)}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Clock className="text-gray-400" size={16} />
                <div>
                  <p className="text-sm text-gray-500">Atualizado em</p>
                  <p className="font-medium text-sm">{formatDate(book.updatedAt)}</p>
                </div>
              </div>
              
              {book.desenvolvedor && (
                <div className="flex items-center gap-3">
                  <Tag className="text-gray-400" size={16} />
                  <div>
                    <p className="text-sm text-gray-500">Desenvolvedor</p>
                    <p className="font-medium text-sm">{book.desenvolvedor}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Resumo */}
          <div className="card p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Resumo</h2>
            <p className="text-gray-600">
              {book.titulo} por {book.autor} é um livro publicado por {book.editora || 'editora desconhecida'} 
              {book.anoPublicacao && ` em ${book.anoPublicacao}`}. 
              Com {book.paginas || 0} páginas, está disponível por {formatPrice(book.preco)}.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetail;