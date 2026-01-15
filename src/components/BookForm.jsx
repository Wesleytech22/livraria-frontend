import React, { useState, useEffect } from 'react';
import { Save, X, Loader2, BookOpen } from 'lucide-react';

const BookForm = ({ 
  initialData = {}, 
  onSubmit, 
  isSubmitting = false, 
  title = "Adicionar Livro",
  submitText = "Salvar Livro"
}) => {
  const [formData, setFormData] = useState({
    titulo: '',
    autor: '',
    editora: '',
    preco: 0,
    paginas: 1,
    anoPublicacao: new Date().getFullYear(),
    isbn: '',
    desenvolvedor: 'desenvolvedor não informado',
    ...initialData
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({
        ...prev,
        ...initialData
      }));
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Validação para números
    if (['preco', 'paginas', 'anoPublicacao'].includes(name)) {
      const numValue = value === '' ? '' : Number(value);
      setFormData(prev => ({ ...prev, [name]: numValue }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    // Limpa erro do campo ao editar
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.titulo?.trim()) {
      newErrors.titulo = 'Título é obrigatório';
    } else if (formData.titulo.length < 2) {
      newErrors.titulo = 'Título muito curto (mínimo 2 caracteres)';
    } else if (formData.titulo.length > 200) {
      newErrors.titulo = 'Título muito longo (máximo 200 caracteres)';
    }
    
    if (!formData.autor?.trim()) {
      newErrors.autor = 'Autor é obrigatório';
    }
    
    if (formData.preco < 0) {
      newErrors.preco = 'Preço não pode ser negativo';
    }
    
    if (formData.paginas < 1) {
      newErrors.paginas = 'Número de páginas inválido';
    }
    
    if (formData.anoPublicacao) {
      const currentYear = new Date().getFullYear();
      if (formData.anoPublicacao < 1000 || formData.anoPublicacao > currentYear) {
        newErrors.anoPublicacao = `Ano deve ser entre 1000 e ${currentYear}`;
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleReset = () => {
    setFormData({
      titulo: '',
      autor: '',
      editora: '',
      preco: 0,
      paginas: 1,
      anoPublicacao: new Date().getFullYear(),
      isbn: '',
      desenvolvedor: 'desenvolvedor não informado',
      ...initialData
    });
    setErrors({});
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm p-6">
        {/* Cabeçalho */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-primary-50 rounded-lg">
            <BookOpen className="text-primary-600" size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">{title}</h2>
            <p className="text-sm text-gray-600">Preencha os dados do livro</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Título */}
          <div>
            <label className="label">Título *</label>
            <input
              type="text"
              name="titulo"
              value={formData.titulo}
              onChange={handleChange}
              className="input"
              placeholder="Digite o título do livro"
              disabled={isSubmitting}
            />
            {errors.titulo && (
              <p className="mt-1 text-sm text-red-600">{errors.titulo}</p>
            )}
          </div>

          {/* Autor */}
          <div>
            <label className="label">Autor *</label>
            <input
              type="text"
              name="autor"
              value={formData.autor}
              onChange={handleChange}
              className="input"
              placeholder="Nome do autor"
              disabled={isSubmitting}
            />
            {errors.autor && (
              <p className="mt-1 text-sm text-red-600">{errors.autor}</p>
            )}
          </div>

          {/* Editora e Ano */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">Editora</label>
              <input
                type="text"
                name="editora"
                value={formData.editora}
                onChange={handleChange}
                className="input"
                placeholder="Nome da editora"
                disabled={isSubmitting}
              />
            </div>
            
            <div>
              <label className="label">Ano de Publicação</label>
              <input
                type="number"
                name="anoPublicacao"
                value={formData.anoPublicacao}
                onChange={handleChange}
                className="input"
                min="1000"
                max={new Date().getFullYear()}
                disabled={isSubmitting}
              />
              {errors.anoPublicacao && (
                <p className="mt-1 text-sm text-red-600">{errors.anoPublicacao}</p>
              )}
            </div>
          </div>

          {/* Preço e Páginas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">Preço (R$)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  R$
                </span>
                <input
                  type="number"
                  name="preco"
                  value={formData.preco}
                  onChange={handleChange}
                  className="input pl-10"
                  step="0.01"
                  min="0"
                  disabled={isSubmitting}
                />
              </div>
              {errors.preco && (
                <p className="mt-1 text-sm text-red-600">{errors.preco}</p>
              )}
            </div>
            
            <div>
              <label className="label">Número de Páginas</label>
              <input
                type="number"
                name="paginas"
                value={formData.paginas}
                onChange={handleChange}
                className="input"
                min="1"
                disabled={isSubmitting}
              />
              {errors.paginas && (
                <p className="mt-1 text-sm text-red-600">{errors.paginas}</p>
              )}
            </div>
          </div>

          {/* ISBN */}
          <div>
            <label className="label">ISBN</label>
            <input
              type="text"
              name="isbn"
              value={formData.isbn}
              onChange={handleChange}
              className="input uppercase"
              placeholder="978-85-12345-67-8"
              disabled={isSubmitting}
            />
          </div>

          {/* Botões */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleReset}
              className="btn btn-secondary flex items-center gap-2"
              disabled={isSubmitting}
            >
              <X size={16} />
              Limpar
            </button>
            <button
              type="submit"
              className="btn btn-primary flex items-center gap-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save size={16} />
                  {submitText}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookForm;