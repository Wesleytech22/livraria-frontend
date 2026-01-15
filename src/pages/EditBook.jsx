import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import BookForm from '../components/BookForm';
import LoadingSpinner from '../components/LoadingSpinner';
import Alert from '../components/Alert';
import bookService from '../services/bookService';

const EditBook = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBook();
  }, [id]);

  const fetchBook = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await bookService.getBookById(id);
      setBook(response.dados);
    } catch (err) {
      console.error('Erro ao buscar livro:', err);
      setError('Não foi possível carregar o livro para edição.');
      toast.error('Livro não encontrado');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      const response = await bookService.updateBook(id, formData);
      
      toast.success('Livro atualizado com sucesso!', {
        duration: 4000,
        icon: '✏️',
      });
      
      // Redirecionar para a página de detalhes do livro
      navigate(`/livros/${id}`);
    } catch (error) {
      console.error('Erro ao atualizar livro:', error);
      
      if (error.response?.data?.erros) {
        error.response.data.erros.forEach((err) => {
          toast.error(err, {
            duration: 5000,
          });
        });
      } else {
        toast.error('Erro ao atualizar livro. Tente novamente.', {
          duration: 4000,
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Carregando livro..." />;
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto">
        <Alert type="error" title="Erro" message={error} />
        <div className="mt-6 text-center">
          <button
            onClick={() => navigate('/livros')}
            className="btn btn-primary"
          >
            Voltar para Livros
          </button>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Livro não encontrado</h2>
        <p className="text-gray-600 mb-6">O livro que você está tentando editar não existe.</p>
        <button
          onClick={() => navigate('/livros')}
          className="btn btn-primary"
        >
          Ver Todos os Livros
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Editar Livro</h1>
        <p className="text-gray-600">Atualize as informações do livro abaixo</p>
      </div>
      
      <BookForm
        initialData={book}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        title={`Editando: ${book.titulo}`}
        submitText="Atualizar Livro"
      />
    </div>
  );
};

export default EditBook;