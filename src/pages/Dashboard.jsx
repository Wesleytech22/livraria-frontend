import { useEffect, useState } from 'react';
import { 
  FaBook, FaUsers, FaShoppingCart, FaChartLine, 
  FaArrowUp, FaArrowDown, FaDatabase, FaServer 
} from 'react-icons/fa';
import { bookService } from '../services/api';
import toast from 'react-hot-toast';
import BookChart from '../components/BookChart';
import RecentBooks from '../components/RecentBooks';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalPrice: 0,
    avgPrice: 0,
    apiStatus: 'checking'
  });
  const [loading, setLoading] = useState(true);
  const [recentBooks, setRecentBooks] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      const [booksData, statusData] = await Promise.all([
        bookService.getAll(),
        bookService.getStatus()
      ]);
      
      const books = booksData.dados || [];
      const totalPrice = books.reduce((sum, book) => sum + (book.preco || 0), 0);
      const avgPrice = books.length > 0 ? totalPrice / books.length : 0;
      
      setStats({
        totalBooks: books.length,
        totalPrice,
        avgPrice,
        apiStatus: statusData.status || 'online'
      });
      
      // Últimos 5 livros (ordenados por data de criação)
      const sortedBooks = [...books]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);
      setRecentBooks(sortedBooks);
      
    } catch (error) {
      toast.error('Erro ao carregar dados do dashboard');
      setStats(prev => ({ ...prev, apiStatus: 'offline' }));
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total de Livros',
      value: stats.totalBooks,
      icon: <FaBook />,
      color: 'var(--primary)',
      change: '+12%',
      trend: 'up'
    },
    {
      title: 'Valor Total',
      value: `R$ ${stats.totalPrice.toFixed(2)}`,
      icon: <FaShoppingCart />,
      color: 'var(--secondary)',
      change: '+8%',
      trend: 'up'
    },
    {
      title: 'Preço Médio',
      value: `R$ ${stats.avgPrice.toFixed(2)}`,
      icon: <FaChartLine />,
      color: 'var(--warning)',
      change: '-3%',
      trend: 'down'
    },
    {
      title: 'Status API',
      value: stats.apiStatus === 'online' ? 'Online' : 'Offline',
      icon: <FaServer />,
      color: stats.apiStatus === 'online' ? 'var(--secondary)' : 'var(--danger)',
      change: '',
      trend: 'none'
    }
  ];

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Carregando dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>📊 Dashboard</h1>
        <p>Visão geral da sua livraria em tempo real</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <div key={index} className="card">
            <div className="stat-card">
              <div className="stat-header">
                <div 
                  className="stat-icon"
                  style={{ backgroundColor: `${stat.color}20`, color: stat.color }}
                >
                  {stat.icon}
                </div>
                <div className={`trend ${stat.trend}`}>
                  {stat.trend === 'up' && <FaArrowUp />}
                  {stat.trend === 'down' && <FaArrowDown />}
                  {stat.change}
                </div>
              </div>
              <div className="stat-content">
                <h3 className="stat-value">{stat.value}</h3>
                <p className="stat-title">{stat.title}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts and Recent Books */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Chart */}
        <div className="card">
          <div className="card-header">
            <h2>📈 Distribuição de Preços</h2>
            <p>Análise dos preços dos livros</p>
          </div>
          <BookChart books={recentBooks} />
        </div>

        {/* Recent Books */}
        <div className="card">
          <div className="card-header">
            <h2>🆕 Livros Recentes</h2>
            <p>Últimos livros adicionados</p>
          </div>
          <RecentBooks books={recentBooks} />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card mt-8">
        <div className="card-header">
          <h2>⚡ Ações Rápidas</h2>
          <p>Gerencie sua livraria rapidamente</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="btn btn-primary">
            <FaBook /> Ver Todos
          </button>
          <button className="btn btn-secondary">
            <FaBook /> Novo Livro
          </button>
          <button className="btn btn-outline">
            <FaDatabase /> Exportar
          </button>
          <button className="btn btn-outline">
            <FaChartLine /> Relatório
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;