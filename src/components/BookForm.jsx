// src/components/BookForm.jsx
import { useState } from 'react';
import { FaSave, FaTimes } from 'react-icons/fa';

const BookForm = ({ initialData = {}, onSubmit, onCancel, isLoading = false }) => {
  const [formData, setFormData] = useState({
    titulo: initialData.titulo || '',
    autor: initialData.autor || '',
    editora: initialData.editora || '',
    preco: initialData.preco || '',
    paginas: initialData.paginas || '',
    anoPublicacao: initialData.anoPublicacao || '',
    isbn: initialData.isbn || '',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.titulo.trim()) {
      newErrors.titulo = 'O título é obrigatório';
    }
    
    if (formData.preco && isNaN(parseFloat(formData.preco))) {
      newErrors.preco = 'Preço deve ser um número válido';
    }
    
    if (formData.paginas && (isNaN(parseInt(formData.paginas)) || parseInt(formData.paginas) <= 0)) {
      newErrors.paginas = 'Número de páginas inválido';
    }
    
    if (formData.anoPublicacao && 
        (isNaN(parseInt(formData.anoPublicacao)) || 
         parseInt(formData.anoPublicacao) < 1000 || 
         parseInt(formData.anoPublicacao) > new Date().getFullYear())) {
      newErrors.anoPublicacao = 'Ano de publicação inválido';
    }
    
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    
    // Prepare data for API
    const bookToSubmit = {
      ...formData,
      preco: formData.preco ? parseFloat(formData.preco) : undefined,
      paginas: formData.paginas ? parseInt(formData.paginas) : undefined,
      anoPublicacao: formData.anoPublicacao ? parseInt(formData.anoPublicacao) : undefined,
    };
    
    onSubmit(bookToSubmit);
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <div style={styles.formGrid}>
        {/* Título */}
        <div style={styles.formGroup}>
          <label style={styles.label}>
            Título do Livro *
            <input
              type="text"
              name="titulo"
              value={formData.titulo}
              onChange={handleChange}
              placeholder="Digite o título do livro"
              style={{...styles.input, ...(errors.titulo && styles.inputError)}}
              disabled={isLoading}
            />
          </label>
          {errors.titulo && <span style={styles.error}>{errors.titulo}</span>}
        </div>

        {/* Autor */}
        <div style={styles.formGroup}>
          <label style={styles.label}>
            Autor
            <input
              type="text"
              name="autor"
              value={formData.autor}
              onChange={handleChange}
              placeholder="Nome do autor"
              style={styles.input}
              disabled={isLoading}
            />
          </label>
        </div>

        {/* Editora */}
        <div style={styles.formGroup}>
          <label style={styles.label}>
            Editora
            <input
              type="text"
              name="editora"
              value={formData.editora}
              onChange={handleChange}
              placeholder="Nome da editora"
              style={styles.input}
              disabled={isLoading}
            />
          </label>
        </div>

        {/* Preço */}
        <div style={styles.formGroup}>
          <label style={styles.label}>
            Preço (R$)
            <div style={styles.inputWithPrefix}>
              <span style={styles.prefix}>R$</span>
              <input
                type="number"
                name="preco"
                value={formData.preco}
                onChange={handleChange}
                placeholder="0.00"
                step="0.01"
                min="0"
                style={{...styles.input, ...(errors.preco && styles.inputError), paddingLeft: '40px'}}
                disabled={isLoading}
              />
            </div>
          </label>
          {errors.preco && <span style={styles.error}>{errors.preco}</span>}
        </div>

        {/* Páginas */}
        <div style={styles.formGroup}>
          <label style={styles.label}>
            Número de Páginas
            <input
              type="number"
              name="paginas"
              value={formData.paginas}
              onChange={handleChange}
              placeholder="Ex: 350"
              min="1"
              style={{...styles.input, ...(errors.paginas && styles.inputError)}}
              disabled={isLoading}
            />
          </label>
          {errors.paginas && <span style={styles.error}>{errors.paginas}</span>}
        </div>

        {/* Ano de Publicação */}
        <div style={styles.formGroup}>
          <label style={styles.label}>
            Ano de Publicação
            <input
              type="number"
              name="anoPublicacao"
              value={formData.anoPublicacao}
              onChange={handleChange}
              placeholder="Ex: 2024"
              min="1000"
              max={new Date().getFullYear()}
              style={{...styles.input, ...(errors.anoPublicacao && styles.inputError)}}
              disabled={isLoading}
            />
          </label>
          {errors.anoPublicacao && <span style={styles.error}>{errors.anoPublicacao}</span>}
        </div>

        {/* ISBN */}
        <div style={styles.formGroup}>
          <label style={styles.label}>
            ISBN
            <input
              type="text"
              name="isbn"
              value={formData.isbn}
              onChange={handleChange}
              placeholder="Ex: 978-85-333-0000-0"
              style={styles.input}
              disabled={isLoading}
            />
          </label>
        </div>
      </div>

      {/* Form Actions */}
      <div style={styles.formActions}>
        <button
          type="button"
          onClick={onCancel}
          style={styles.cancelBtn}
          disabled={isLoading}
        >
          <FaTimes style={styles.btnIcon} />
          Cancelar
        </button>
        
        <button
          type="submit"
          style={styles.submitBtn}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <div style={styles.spinner}></div>
              Processando...
            </>
          ) : (
            <>
              <FaSave style={styles.btnIcon} />
              {initialData._id ? 'Atualizar Livro' : 'Salvar Livro'}
            </>
          )}
        </button>
      </div>

      <p style={styles.helperText}>
        * Campos obrigatórios
      </p>
    </form>
  );
};

const styles = {
  form: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '30px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
    marginBottom: '30px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    fontSize: '0.9rem',
    fontWeight: '600',
    color: '#495057',
    marginBottom: '8px',
    display: 'block',
  },
  input: {
    padding: '12px 16px',
    border: '2px solid #e9ecef',
    borderRadius: '8px',
    fontSize: '16px',
    transition: 'all 0.2s ease',
    width: '100%',
    backgroundColor: '#f8f9fa',
  },
  inputError: {
    borderColor: '#f72585',
    backgroundColor: '#fff5f7',
  },
  inputWithPrefix: {
    position: 'relative',
  },
  prefix: {
    position: 'absolute',
    left: '16px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#6c757d',
    fontWeight: '500',
  },
  error: {
    color: '#f72585',
    fontSize: '0.85rem',
    marginTop: '5px',
    display: 'block',
  },
  formActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '15px',
    paddingTop: '20px',
    borderTop: '1px solid #e9ecef',
  },
  cancelBtn: {
    padding: '12px 24px',
    borderRadius: '8px',
    border: '2px solid #dee2e6',
    backgroundColor: 'white',
    color: '#6c757d',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'all 0.2s ease',
  },
  submitBtn: {
    padding: '12px 24px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#4361ee',
    color: 'white',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'all 0.2s ease',
  },
  btnIcon: {
    fontSize: '1rem',
  },
  spinner: {
    width: '16px',
    height: '16px',
    border: '2px solid rgba(255,255,255,0.3)',
    borderTop: '2px solid white',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  helperText: {
    fontSize: '0.85rem',
    color: '#6c757d',
    marginTop: '15px',
    textAlign: 'center',
  },
};

// Add spinner animation
const styleSheet = document.styleSheets[0];
styleSheet.insertRule(`
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`, styleSheet.cssRules.length);

export default BookForm;