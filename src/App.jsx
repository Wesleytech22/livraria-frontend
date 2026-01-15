import { Outlet } from 'react-router-dom'
import Header from './components/Header'
import { Toaster } from 'react-hot-toast'

function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <Outlet />
      </main>
      
      <footer className="mt-12 py-6 border-t border-gray-200 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-center md:text-left">
              <p className="text-gray-800 font-medium">Livraria Frontend</p>
              <p className="text-sm text-gray-600">
                Sistema de gerenciamento de livros • {new Date().getFullYear()}
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600">
                Conectado à API: 
                <span className="ml-2 font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                  {import.meta.env.VITE_API_URL || 'http://localhost:3000'}
                </span>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>API Online</span>
              </div>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-100 text-center">
            <p className="text-xs text-gray-500">
              Desenvolvido por Wesley Rodrigues • v{import.meta.env.VITE_APP_NAME || '1.0.0'}
            </p>
          </div>
        </div>
      </footer>
      
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1F2937',
            color: '#fff',
            borderRadius: '0.5rem',
            padding: '16px',
          },
          success: {
            style: {
              background: '#10B981',
            },
            iconTheme: {
              primary: '#fff',
              secondary: '#10B981',
            },
          },
          error: {
            style: {
              background: '#EF4444',
            },
            iconTheme: {
              primary: '#fff',
              secondary: '#EF4444',
            },
          },
        }}
      />
    </div>
  )
}

export default App