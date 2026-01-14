import { useState, useEffect } from 'react';
import { FaBook, FaDatabase, FaServer, FaCheckCircle } from 'react-icons/fa';
import { bookService } from '../services/api';

export default function Home() {
  const [stats, setStats] = useState({ totalBooks: 0, apiStatus: 'checking' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [booksData, statusData] = await Promise.all([
          bookService.getAll(1, 1),
          bookService.getStatus()
        ]);
        
        setStats({
          totalBooks: booksData.paginacao?.total || 0,
          apiStatus: statusData.status || 'online'
        });
      } catch (error) {
        setStats(prev => ({ ...prev, apiStatus: 'offline' }));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const features = [
    {
      icon: <FaBook className="text-3xl text-blue-600" />,
      title: 'CRUD Completo',
      description: 'Crie, leia, atualize e delete livros com interface intuitiva'
    },
    {
      icon: <FaDatabase className="text-3xl text-green-600" />,
      title: 'MongoDB Atlas',
      description: 'Banco de dados em nuvem com alta disponibilidade'
    },
    {
      icon: <FaServer className="text-3xl text-purple-600" />,
      title: 'API RESTful',
      description: 'Endpoints bem documentados com validações'
    },
    {
      icon: <FaCheckCircle className="text-3xl text-teal-600" />,
      title: 'Pronto para Produção',
      description: 'Tratamento de erros, logs e segurança implementados'
    }
  ];

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="text-center py-12">
        <h1 className="text-5xl font-bold text-gray-800 mb-6">
          Bem-vindo à <span className="text-blue-600">Livraria API</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10">
          Uma aplicação completa de gerenciamento de livros com backend em Node.js 
          e frontend moderno em React.
        </p>
        
        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto mb-12">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500">Livros Cadastrados</p>
                <p className="text-3xl font-bold text-gray-800">
                  {loading ? '...' : stats.totalBooks}
                </p>
              </div>
              <FaBook className="text-3xl text-blue-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500">Status da API</p>
                <p className="text-3xl font-bold text-gray-800">
                  {stats.apiStatus === 'online' ? (
                    <span className="text-green-600">Online</span>
                  ) : stats.apiStatus === 'checking' ? (
                    <span className="text-yellow-600">Verificando...</span>
                  ) : (
                    <span className="text-red-600">Offline</span>
                  )}
                </p>
              </div>
              <div className={`w-4 h-4 rounded-full ${stats.apiStatus === 'online' ? 'bg-green-500' : 'bg-red-500'}`}></div>
            </div>
          </div>
        </div>

        <a 
          href="/books" 
          className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition transform hover:-translate-y-1"
        >
          🔍 Explorar Livros
        </a>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map((feature, index) => (
          <div key={index} className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition">
            <div className="mb-4">
              {feature.icon}
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              {feature.title}
            </h3>
            <p className="text-gray-600">
              {feature.description}
            </p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Comece Agora
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <a 
            href="/books"
            className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition text-center group"
          >
            <div className="text-4xl mb-4 group-hover:scale-110 transition">📖</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              Ver Livros
            </h3>
            <p className="text-gray-600">
              Explore todos os livros cadastrados
            </p>
          </a>
          
          <a 
            href="/add-book"
            className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition text-center group"
          >
            <div className="text-4xl mb-4 group-hover:scale-110 transition">➕</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              Adicionar Livro
            </h3>
            <p className="text-gray-600">
              Cadastre um novo livro no sistema
            </p>
          </a>
          
          <div className="bg-white p-6 rounded-xl shadow-lg text-center">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              API Endpoints
            </h3>
            <p className="text-gray-600">
              Backend disponível em localhost:3000
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}