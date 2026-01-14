// src/components/BookCard.jsx
import { FaEdit, FaTrash, FaEye, FaBookOpen } from 'react-icons/fa';

const BookCard = ({ book, onView, onEdit, onDelete }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price || 0);
  };

  return (
    <div className="card fade-in" style={styles.card}>
      {/* Book Cover */}
      <div style={styles.cover}>
        <FaBookOpen style={styles.coverIcon} />
      </div>

      {/* Book Info */}
      <div style={styles.content}>
        <h3 style={styles.title} title={book.titulo}>
          {book.titulo}
        </h3>
        
        <div style={styles.meta}>
          <span style={styles.author}>
            {book.autor || 'Autor não informado'}
          </span>
          <span style={styles.publisher}>
            {book.editora || 'Editora não informada'}
          </span>
        </div>

        <div style={styles.details}>
          <div style={styles.detailItem}>
            <span style={styles.detailLabel}>Páginas:</span>
            <span style={styles.detailValue}>{book.paginas || 'N/A'}</span>
          </div>
          
          {book.anoPublicacao && (
            <div style={styles.detailItem}>
              <span style={styles.detailLabel}>Ano:</span>
              <span style={styles.detailValue}>{book.anoPublicacao}</span>
            </div>
          )}
        </div>

        {/* Price */}
        <div style={styles.priceContainer}>
          <span style={styles.price}>{formatPrice(book.preco)}</span>
        </div>

        {/* Actions */}
        <div style={styles.actions}>
          <button 
            onClick={() => onView(book)}
            style={styles.actionBtn}
            title="Ver detalhes"
          >
            <FaEye style={styles.actionIcon} />
            <span style={styles.actionText}>Ver</span>
          </button>
          
          <button 
            onClick={() => onEdit(book)}
            style={{...styles.actionBtn, ...styles.editBtn}}
            title="Editar livro"
          >
            <FaEdit style={styles.actionIcon} />
            <span style={styles.actionText}>Editar</span>
          </button>
          
          <button 
            onClick={() => onDelete(book)}
            style={{...styles.actionBtn, ...styles.deleteBtn}}
            title="Excluir livro"
          >
            <FaTrash style={styles.actionIcon} />
            <span style={styles.actionText}>Excluir</span>
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  card: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    overflow: 'hidden',
    position: 'relative',
  },
  cover: {
    height: '180px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
  },
  coverIcon: {
    fontSize: '4rem',
    opacity: 0.9,
  },
  content: {
    padding: '20px',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  title: {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: '#212529',
    marginBottom: '10px',
    lineHeight: '1.4',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
  meta: {
    marginBottom: '15px',
  },
  author: {
    display: 'block',
    fontSize: '0.9rem',
    color: '#495057',
    marginBottom: '4px',
  },
  publisher: {
    display: 'block',
    fontSize: '0.85rem',
    color: '#6c757d',
    fontStyle: 'italic',
  },
  details: {
    display: 'flex',
    gap: '15px',
    marginBottom: '15px',
    paddingBottom: '15px',
    borderBottom: '1px solid #e9ecef',
  },
  detailItem: {
    display: 'flex',
    flexDirection: 'column',
  },
  detailLabel: {
    fontSize: '0.75rem',
    color: '#6c757d',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  detailValue: {
    fontSize: '0.9rem',
    fontWeight: '500',
    color: '#212529',
  },
  priceContainer: {
    marginTop: 'auto',
    marginBottom: '15px',
  },
  price: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#4361ee',
    display: 'block',
  },
  actions: {
    display: 'flex',
    gap: '8px',
    marginTop: 'auto',
  },
  actionBtn: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    padding: '10px',
    borderRadius: '6px',
    border: '1px solid #dee2e6',
    background: 'white',
    color: '#6c757d',
    cursor: 'pointer',
    fontSize: '0.85rem',
    fontWeight: '500',
    transition: 'all 0.2s ease',
  },
  editBtn: {
    borderColor: '#4cc9f0',
    color: '#4cc9f0',
  },
  deleteBtn: {
    borderColor: '#f72585',
    color: '#f72585',
  },
  actionIcon: {
    fontSize: '0.9rem',
  },
  actionText: {
    display: 'none',
    '@media (min-width: 480px)': {
      display: 'inline',
    },
  },
};

export default BookCard;