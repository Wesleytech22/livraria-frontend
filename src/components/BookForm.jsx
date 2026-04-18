import React, { useState, useEffect } from 'react';
import { Save, X, Loader2, BookOpen, Plus } from 'lucide-react';

const BookForm = ({
  initialData = {},
  onSubmit,
  isSubmitting = false,
  title = "Adicionar Novo Livro",
  submitText = "Cadastrar Livro"
}) => {
  const [formData, setFormData] = useState({
    titulo: '',
    autor: '',
    anoPublicacao: new Date().getFullYear(),
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setFormData({
        titulo: initialData.titulo || '',
        autor: initialData.autor || '',
        anoPublicacao: initialData.ano || initialData.anoPublicacao || new Date().getFullYear(),
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'anoPublicacao') {
      const numValue = value === '' ? '' : Number(value);
      setFormData(prev => ({ ...prev, [name]: numValue }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }

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
    }

    if (!formData.autor?.trim()) {
      newErrors.autor = 'Autor é obrigatório';
    }

    if (formData.anoPublicacao) {
      const currentYear = new Date().getFullYear();
      if (formData.anoPublicacao < 1000 || formData.anoPublicacao > currentYear + 1) {
        newErrors.anoPublicacao = `Ano deve ser entre 1000 e ${currentYear + 1}`;
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
      anoPublicacao: new Date().getFullYear(),
    });
    setErrors({});
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl p-8 border border-gray-100">
        {/* Cabeçalho */}
        <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-200">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
            <BookOpen className="text-white" size={28} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
            <p className="text-gray-500 mt-1">Preencha os dados abaixo para {title.toLowerCase()}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Título */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Título do Livro <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="titulo"
              value={formData.titulo}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 outline-none"
              placeholder="Ex: Dom Casmurro"
              disabled={isSubmitting}
            />
            {errors.titulo && (
              <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                <span>⚠️</span> {errors.titulo}
              </p>
            )}
          </div>

          {/* Autor */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Autor <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="autor"
              value={formData.autor}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 outline-none"
              placeholder="Ex: Machado de Assis"
              disabled={isSubmitting}
            />
            {errors.autor && (
              <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                <span>⚠️</span> {errors.autor}
              </p>
            )}
          </div>

          {/* Ano */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Ano de Publicação
            </label>
            <input
              type="number"
              name="anoPublicacao"
              value={formData.anoPublicacao}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 outline-none"
              placeholder="2024"
              disabled={isSubmitting}
            />
            {errors.anoPublicacao && (
              <p className="mt-2 text-sm text-red-600">{errors.anoPublicacao}</p>
            )}
          </div>

          {/* Botões */}
          <div className="flex gap-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleReset}
              className="flex-1 px-6 py-3 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all duration-200 font-semibold flex items-center justify-center gap-2"
              disabled={isSubmitting}
            >
              <X size={18} />
              Limpar Formulário
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-semibold flex items-center justify-center gap-2 shadow-lg hover:shadow-xl disabled:opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Plus size={18} />
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