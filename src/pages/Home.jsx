import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, PlusCircle, Search, BarChart, 
  Shield, Zap, Users, TrendingUp, ArrowRight,
  Library, Clock, CheckCircle
} from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import bookService from '../services/bookService';

const Home = () => {
  const [stats, setStats] = useState(null);
  const [recentBooks, setRecentBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiInfo, setApiInfo] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [booksResponse, infoResponse] = await Promise.all([
        bookService.getBooks(1, 4),
        bookService.getApiInfo()
      ]);
      
      setStats({
        totalBooks: booksResponse.paginacao?.total || 0,
        totalPages: booksResponse.paginacao?.totalPaginas || 0,
        itemsPerPage: booksResponse.paginacao?.limite || 12,
      });
      
      setApiInfo(infoResponse);
      setRecentBooks(booksResponse.dados || []);
    } catch (error) {
      console.error('Erro ao carregar dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      icon: <BookOpen className="w-10 h-10" />,
      title: 'Catálogo Completo',
      description: 'Gerencie todos os livros em um só lugar com busca avançada',
      color: 'from-blue-500 to-blue-600',
      iconColor: 'text-blue-500',
    },
    {
      icon: <PlusCircle className="w-10 h-10" />,
      title: 'Adição Rápida',
      description: 'Adicione novos livros em segundos com formulário intuitivo',
      color: 'from-green-500 to-green-600',
      iconColor: 'text-green-500',
    },
    {
      icon: <Search className="w-10 h-10" />,
      title: 'Busca Inteligente',
      description: 'Encontre livros por título, autor, editora ou ISBN',
      color: 'from-purple-500 to-purple-600',
      iconColor: 'text-purple-500',
    },
    {
      icon: <BarChart className="w-10 h-10" />,
      title: 'Estatísticas',
      description: 'Acompanhe métricas e relatórios do seu acervo',
      color: 'from-orange-500 to-orange-600',
      iconColor: 'text-orange-500',
    },
  ];

  if (loading) {
    return <LoadingSpinner text="Carregando dashboard..." />;
  }

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-primary-800"></div>
        <div className="relative px-8 py-12 md:py-16">
          <div className="max-w-3xl mx-auto text-center text-white">
            <div className="inline-flex items-center justify-center p-3 bg-white/10 rounded-2xl backdrop-blur-sm mb-6">
              <Library size={32} />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Sistema de Gerenciamento de Livros
            </h1>
            <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
              Interface moderna conectada à API RESTful completa para gerenciamento do seu acervo literário.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                to="/livros"
                className="inline-flex items-center gap-2 bg-white text-primary-700 font-semibold px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <BookOpen size={20} />
                Ver Catálogo
                <ArrowRight size={16} />
              </Link>
              <Link
                to="/adicionar"
                className="inline-flex items-center gap-2 bg-primary-800 text-white font-semibold px-6 py-3 rounded-lg hover:bg-primary-900 transition-colors"
              >
                <PlusCircle size={20} />
                Adicionar Livro
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total de Livros</p>
              <p className="text-3xl font-bold text-gray-800">{stats?.totalBooks || 0}</p>
            </div>
            <div className="p-3 bg-primary-50 rounded-lg">
              <BookOpen className="text-primary-600" size={24} />
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">API Status</p>
              <p className="text-3xl font-bold text-green-600">Online</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <CheckCircle className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Versão API</p>
              <p className="text-3xl font-bold text-gray-800">{apiInfo?.versao || '1.0.0'}</p>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <Zap className="text-purple-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Recursos Principais</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="card p-6 hover:transform hover:-translate-y-1 transition-all duration-300"
            >
              <div className={`p-3 rounded-lg bg-gradient-to-br ${feature.color} w-fit mb-4`}>
                <div className="text-white">{feature.icon}</div>
              </div>
              <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Books */}
      {recentBooks.length > 0 && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Livros Recentes</h2>
            <Link 
              to="/livros" 
              className="text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
            >
              Ver todos <ArrowRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {recentBooks.slice(0, 4).map((book) => (
              <Link
                key={book._id}
                to={`/livros/${book._id}`}
                className="card p-4 hover:shadow-lg transition-shadow"
              >
                <h3 className="font-bold text-gray-800 truncate mb-2">{book.titulo}</h3>
                <p className="text-sm text-gray-600 truncate">{book.autor}</p>
                <div className="flex justify-between items-center mt-3">
                  <span className="text-sm font-medium text-primary-600">
                    R$ {parseFloat(book.preco || 0).toFixed(2)}
                  </span>
                  <span className="text-xs text-gray-500">{book.anoPublicacao || 'N/A'}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* API Info */}
      {apiInfo && (
        <div className="card p-6">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="text-primary-600" size={24} />
            <h2 className="text-xl font-bold text-gray-800">Informações da API</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Desenvolvedor</p>
              <p className="font-medium">{apiInfo.desenvolvedor || 'Wesley Rodrigues'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Endpoints Disponíveis</p>
              <p className="font-medium">{Object.keys(apiInfo.endpoints?.livros || {}).length}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Status</p>
              <p className="font-medium text-green-600">{apiInfo.status || 'Operacional'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">URL Base</p>
              <p className="font-mono text-sm bg-gray-50 p-2 rounded">
                {import.meta.env.VITE_API_URL}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="text-center">
        <div className="inline-flex flex-col items-center gap-4 bg-gradient-to-r from-primary-50 to-blue-50 rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-gray-800">Pronto para começar?</h3>
          <p className="text-gray-600 max-w-md">
            Adicione seu primeiro livro ou explore o catálogo completo.
          </p>
          <div className="flex gap-3">
            <Link
              to="/adicionar"
              className="btn btn-primary px-6"
            >
              <PlusCircle size={18} className="mr-2" />
              Adicionar Livro
            </Link>
            <Link
              to="/livros"
              className="btn btn-secondary px-6"
            >
              <BookOpen size={18} className="mr-2" />
              Explorar Catálogo
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;