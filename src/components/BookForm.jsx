import React, { useState, useEffect } from 'react';
<<<<<<< HEAD
import { Save, X, Loader2, BookOpen } from 'lucide-react';
=======
import { Save, X, Loader2, BookOpen, Search, Image as ImageIcon } from 'lucide-react';
import { toast } from 'react-hot-toast';
import bookService from '../services/bookService';
>>>>>>> feat/refacturer-frontend-livraria

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
<<<<<<< HEAD
=======
    coverUrl: '', // NOVO: URL da capa
>>>>>>> feat/refacturer-frontend-livraria
    ...initialData
  });

  const [errors, setErrors] = useState({});
<<<<<<< HEAD

  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({
        ...prev,
        ...initialData
      }));
    }
  }, [initialData]);
=======
  const [searchingCover, setSearchingCover] = useState(false);

  // Função para buscar capa automática
  const searchBookCover = async () => {
    if (!formData.isbn && !formData.titulo) return;
    
    setSearchingCover(true);
    try {
      const searchTerm = formData.isbn || `${formData.titulo} ${formData.autor}`;
      const results = await bookService.suggestBooks(searchTerm, 1);
      
      if (results.length > 0 && results[0].googleBook.capaPequena) {
        setFormData(prev => ({
          ...prev,
          coverUrl: results[0].googleBook.capaPequena,
          // Preencher outros campos automaticamente se estiverem vazios
          titulo: prev.titulo || results[0].googleBook.titulo,
          autor: prev.autor || results[0].googleBook.autor,
          editora: prev.editora || results[0].googleBook.editora,
          anoPublicacao: prev.anoPublicacao || results[0].googleBook.dataPublicacao?.substring(0, 4) || new Date().getFullYear(),
          paginas: prev.paginas || results[0].googleBook.paginas || 1,
        }));
        toast.success('Capa e informações encontradas automaticamente!');
      } else {
        toast.error('Capa não encontrada. Você pode adicionar uma URL manualmente.');
      }
    } catch (error) {
      console.log('Não foi possível buscar capa automática:', error);
      toast.error('Erro ao buscar capa. Tente manualmente.');
    } finally {
      setSearchingCover(false);
    }
  };

  // Buscar capa quando ISBN for preenchido
  useEffect(() => {
    if (formData.isbn && formData.isbn.length >= 10 && !formData.coverUrl) {
      const timer = setTimeout(() => {
        searchBookCover();
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [formData.isbn]);
>>>>>>> feat/refacturer-frontend-livraria

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
    
<<<<<<< HEAD
=======
    // Validação da URL da capa (opcional)
    if (formData.coverUrl && !isValidUrl(formData.coverUrl)) {
      newErrors.coverUrl = 'URL inválida';
    }
    
>>>>>>> feat/refacturer-frontend-livraria
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

<<<<<<< HEAD
=======
  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

>>>>>>> feat/refacturer-frontend-livraria
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
<<<<<<< HEAD
=======
      coverUrl: '',
>>>>>>> feat/refacturer-frontend-livraria
      ...initialData
    });
    setErrors({});
  };

<<<<<<< HEAD
  return (
    <div className="max-w-2xl mx-auto">
=======
  // Função para testar a imagem
  const testImageUrl = (url) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = url;
    });
  };

  // Pré-visualização da capa
  const PreviewCover = () => {
    if (!formData.coverUrl) {
      return (
        <div className="w-full h-64 bg-gray-100 rounded-lg flex flex-col items-center justify-center">
          <ImageIcon className="w-12 h-12 text-gray-400 mb-3" />
          <p className="text-gray-500 text-sm">Nenhuma capa selecionada</p>
          <p className="text-gray-400 text-xs mt-1">Adicione uma URL ou busque automaticamente</p>
        </div>
      );
    }

    return (
      <div className="relative">
        <img
          src={formData.coverUrl}
          alt="Pré-visualização da capa"
          className="w-full h-64 object-cover rounded-lg shadow-md"
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.parentElement.innerHTML = `
              <div class="w-full h-64 bg-red-50 rounded-lg flex flex-col items-center justify-center border border-red-200">
                <ImageIcon class="w-12 h-12 text-red-400 mb-3" />
                <p class="text-red-600 font-medium">Imagem não carregada</p>
                <p class="text-red-500 text-sm mt-1">URL inválida ou imagem não acessível</p>
              </div>
            `;
          }}
        />
        <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
          Pré-visualização
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto">
>>>>>>> feat/refacturer-frontend-livraria
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

<<<<<<< HEAD
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
=======
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Coluna da esquerda - Pré-visualização */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <h3 className="font-bold text-gray-700 mb-3 flex items-center gap-2">
                <ImageIcon size={18} />
                Capa do Livro
              </h3>
              
              <PreviewCover />
              
              <div className="mt-4 space-y-3">
                <div>
                  <label className="label">URL da Capa</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      name="coverUrl"
                      value={formData.coverUrl}
                      onChange={handleChange}
                      className="input flex-1"
                      placeholder="https://exemplo.com/capa.jpg"
                      disabled={isSubmitting || searchingCover}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const url = prompt('Cole a URL da imagem da capa:');
                        if (url) {
                          setFormData(prev => ({ ...prev, coverUrl: url }));
                        }
                      }}
                      className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                      disabled={isSubmitting || searchingCover}
                    >
                      Colar
                    </button>
                  </div>
                  {errors.coverUrl && (
                    <p className="mt-1 text-sm text-red-600">{errors.coverUrl}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    Cole uma URL de imagem (JPG, PNG, etc.)
                  </p>
                </div>

                <button
                  type="button"
                  onClick={searchBookCover}
                  disabled={searchingCover || isSubmitting || (!formData.isbn && !formData.titulo)}
                  className="w-full py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {searchingCover ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Buscando capa...
                    </>
                  ) : (
                    <>
                      <Search size={16} />
                      Buscar Capa Automaticamente
                    </>
                  )}
                </button>

                <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
                  <p className="font-medium mb-1">Dica:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Preencha o ISBN para busca automática</li>
                    <li>Ou busque por título + autor</li>
                    <li>Use imagens públicas (Google Books, Open Library)</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Coluna da direita - Formulário */}
          <div className="lg:col-span-2">
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
                <label className="label">ISBN (busca automática de capa)</label>
                <input
                  type="text"
                  name="isbn"
                  value={formData.isbn}
                  onChange={handleChange}
                  className="input uppercase font-mono"
                  placeholder="978-85-12345-67-8"
                  disabled={isSubmitting}
                />
                <div className="flex items-center gap-2 mt-1">
                  {formData.isbn.length >= 10 && (
                    <div className="flex items-center gap-1 text-sm text-blue-600">
                      <Search size={12} />
                      <span>Buscando capa em 1.5s...</span>
                    </div>
                  )}
                  <p className="text-xs text-gray-500 ml-auto">
                    ISBN-10: 10 dígitos | ISBN-13: 13 dígitos
                  </p>
                </div>
              </div>

              {/* Botões */}
              <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleReset}
                  className="btn btn-secondary flex items-center gap-2"
                  disabled={isSubmitting || searchingCover}
                >
                  <X size={16} />
                  Limpar
                </button>
                <button
                  type="submit"
                  className="btn btn-primary flex items-center gap-2"
                  disabled={isSubmitting || searchingCover}
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

            {/* Status da busca */}
            {searchingCover && (
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  <div>
                    <p className="font-medium text-blue-800">Buscando capa...</p>
                    <p className="text-sm text-blue-600">
                      Consultando Google Books por: {formData.isbn || formData.titulo}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
>>>>>>> feat/refacturer-frontend-livraria
      </div>
    </div>
  );
};

export default BookForm;