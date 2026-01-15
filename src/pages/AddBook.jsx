import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import BookForm from '../components/BookForm';
import bookService from '../services/bookService';

const AddBook = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      const response = await bookService.createBook(formData);
      
      toast.success('Livro criado com sucesso!', {
        duration: 4000,
        icon: '📚',
      });
      
      // Redirecionar para a página de detalhes do livro
      navigate(`/livros/${response.dados._id}`);
    } catch (error) {
      console.error('Erro ao criar livro:', error);
      
      if (error.response?.data?.erros) {
        error.response.data.erros.forEach((err) => {
          toast.error(err, {
            duration: 5000,
          });
        });
      } else {
        toast.error('Erro ao criar livro. Tente novamente.', {
          duration: 4000,
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Adicionar Novo Livro</h1>
        <p className="text-gray-600">Preencha os dados abaixo para adicionar um novo livro ao acervo</p>
      </div>
      
      <BookForm
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        title="Novo Livro"
        submitText="Adicionar Livro"
      />
    </div>
  );
};

export default AddBook;