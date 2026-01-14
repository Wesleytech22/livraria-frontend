import { useState } from 'react';
import { FaPlus, FaArrowLeft } from 'react-icons/fa';
import { bookService } from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function AddBook() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    titulo: '',
    autor: '',
    editora: '',
    preco: '',
    paginas: '',
    anoPublicacao: '',
    isbn: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validação básica
    if (!formData.titulo.trim()) {
      alert('O título é obrigatório!');
      return;
    }

    setLoading(true);
    
    try {
      const bookToSend = {
        ...formData,
        preco: parseFloat(formData.preco) || 0,
        paginas: parseInt(formData.paginas) || 0,
        anoPublicacao: parseInt(formData.anoPublicacao) || undefined
      };

      await bookService.create(bookToSend);
      
      // Reset form
      setFormData({
        titulo: '',
        autor: '',
        editora: '',
        preco: '',
        paginas: '',
        anoPublicacao: '',
        isbn: ''
      });
      
      // Redirecionar para lista de livros
      setTimeout(() => {
        navigate('/books');
      }, 1500);
      
    } catch (error) {
      console.error('Erro ao criar livro:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate('/books')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4"
        >
          <FaArrowLeft /> Voltar para livros
        </button>
        
        <h1 className="text-3xl font-bold text-gray-800">➕ Adicionar Novo Livro</h1>
        <p className="text-gray-600 mt-2">
          Preencha os detalhes do livro para adicioná-lo ao catálogo
        </p>
      </div>

      {/* Form */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Título */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Título do Livro *
              </label>
              <input
                type="text"
                name="titulo"
                value={formData.titulo}
                onChange={handleChange}
                placeholder="Ex: Node.js Avançado"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {/* Autor */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Autor
              </label>
              <input
                type="text"
                name="autor"
                value={formData.autor}
                onChange={handleChange}
                placeholder="Ex: Wesley Rodrigues"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Editora */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Editora
              </label>
              <input
                type="text"
                name="editora"
                value={formData.editora}
                onChange={handleChange}
                placeholder="Ex: Editora Tech"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Preço */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preço (R$)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  R$
                </span>
                <input
                  type="number"
                  name="preco"
                  value={formData.preco}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Páginas */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Número de Páginas
              </label>
              <input
                type="number"
                name="paginas"
                value={formData.paginas}
                onChange={handleChange}
                min="1"
                placeholder="Ex: 350"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Ano de Publicação */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ano de Publicação
              </label>
              <input
                type="number"
                name="anoPublicacao"
                value={formData.anoPublicacao}
                onChange={handleChange}
                min="1000"
                max={new Date().getFullYear()}
                placeholder="Ex: 2024"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* ISBN */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ISBN
              </label>
              <input
                type="text"
                name="isbn"
                value={formData.isbn}
                onChange={handleChange}
                placeholder="Ex: 978-85-333-0000-0"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex gap-4 pt-6 border-t">
            <button
              type="button"
              onClick={() => navigate('/books')}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-semibold"
            >
              Cancelar
            </button>
            
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Salvando...
                </>
              ) : (
                <>
                  <FaPlus />
                  Adicionar Livro
                </>
              )}
            </button>
          </div>

          <p className="text-sm text-gray-500 mt-4">
            * Campos obrigatórios
          </p>
        </form>
      </div>

      {/* Preview Card */}
      {(formData.titulo || formData.autor) && (
        <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            📋 Preview do Livro
          </h3>
          <div className="bg-white rounded-lg p-6 shadow">
            <div className="flex items-start gap-4">
              <div className="w-24 h-32 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
                <span className="text-4xl">📖</span>
              </div>
              <div className="flex-1">
                <h4 className="text-xl font-bold text-gray-800 mb-2">
                  {formData.titulo || "(Sem título)"}
                </h4>
                <p className="text-gray-600 mb-1">
                  <strong>Autor:</strong> {formData.autor || "Não informado"}
                </p>
                <p className="text-gray-600 mb-1">
                  <strong>Editora:</strong> {formData.editora || "Não informada"}
                </p>
                {formData.preco && (
                  <p className="text-gray-600">
                    <strong>Preço:</strong> R$ {parseFloat(formData.preco).toFixed(2)}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}