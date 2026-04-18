import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, PlusCircle, Search, TrendingUp, Sparkles, Library, ArrowRight } from 'lucide-react';

const Home = () => {
  const features = [
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: 'Catálogo Completo',
      description: 'Gerencie todos os seus livros em um só lugar',
      color: 'from-blue-500 to-blue-600',
      link: '/livros'
    },
    {
      icon: <PlusCircle className="w-8 h-8" />,
      title: 'Adição Rápida',
      description: 'Adicione novos livros em segundos',
      color: 'from-green-500 to-green-600',
      link: '/adicionar'
    },
    {
      icon: <Search className="w-8 h-8" />,
      title: 'Busca Inteligente',
      description: 'Encontre livros por título ou autor',
      color: 'from-purple-500 to-purple-600',
      link: '/livros'
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: 'Estatísticas',
      description: 'Acompanhe métricas da sua biblioteca',
      color: 'from-orange-500 to-orange-600',
      link: '/livros'
    }
  ];

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600"></div>
        <div className="relative px-8 py-16 md:py-20 text-center text-white">
          <div className="inline-flex items-center justify-center p-3 bg-white/20 rounded-2xl backdrop-blur-sm mb-6">
            <Library size={40} />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Sua Biblioteca Digital
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Organize, gerencie e descubra novos livros de forma simples e elegante
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              to="/livros"
              className="inline-flex items-center gap-2 bg-white text-blue-600 font-semibold px-8 py-3 rounded-xl hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <BookOpen size={20} />
              Explorar Livros
              <ArrowRight size={16} />
            </Link>
            <Link
              to="/adicionar"
              className="inline-flex items-center gap-2 bg-blue-800/50 backdrop-blur-sm text-white font-semibold px-8 py-3 rounded-xl hover:bg-blue-800/70 transition-all duration-200 border border-white/20"
            >
              <PlusCircle size={20} />
              Adicionar Livro
            </Link>
          </div>
        </div>
      </div>

      {/* Features */}
      <div>
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Recursos que você vai amar
          </h2>
          <p className="text-gray-500">
            Tudo que você precisa para gerenciar seus livros
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Link
              key={index}
              to={feature.link}
              className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className={`p-3 rounded-xl bg-gradient-to-br ${feature.color} w-fit mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <div className="text-white">{feature.icon}</div>
              </div>
              <h3 className="font-bold text-lg text-gray-800 mb-2">{feature.title}</h3>
              <p className="text-gray-500 text-sm">{feature.description}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* CTA Final */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-8 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Sparkles className="text-yellow-500" size={24} />
          <h3 className="text-2xl font-bold text-gray-800">Pronto para começar?</h3>
        </div>
        <p className="text-gray-600 mb-6">
          Adicione seu primeiro livro e comece a construir sua biblioteca digital
        </p>
        <Link
          to="/adicionar"
          className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md hover:shadow-lg"
        >
          <PlusCircle size={18} />
          Adicionar Primeiro Livro
        </Link>
      </div>
    </div>
  );
};

export default Home;