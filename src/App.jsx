import { useState, useEffect } from 'react'

function App() {
  const [status, setStatus] = useState('Testando conexão...')

  useEffect(() => {
    fetch('http://localhost:3000/')
      .then(res => {
        if (res.ok) {
          setStatus('✅ API Conectada com Sucesso!')
        } else {
          setStatus('❌ API não respondeu corretamente')
        }
      })
      .catch(() => setStatus('❌ Não foi possível conectar à API'))
  }, [])

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#1a1a1a',
      color: 'white',
      padding: '20px',
      textAlign: 'center'
    }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '20px' }}>
        🚀 Frontend Livraria
      </h1>
      
      <div style={{
        backgroundColor: '#2d2d2d',
        padding: '30px',
        borderRadius: '10px',
        marginBottom: '30px',
        maxWidth: '600px',
        width: '100%'
      }}>
        <p style={{ fontSize: '1.2rem', marginBottom: '15px' }}>
          Status: <strong>{status}</strong>
        </p>
        
        <div style={{ 
          display: 'flex', 
          gap: '10px', 
          justifyContent: 'center',
          marginTop: '20px'
        }}>
          <button 
            onClick={() => window.open('http://localhost:3000/livros', '_blank')}
            style={{
              backgroundColor: '#3b82f6',
              color: 'white',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Testar API Livros
          </button>
          
          <button 
            onClick={() => window.location.reload()}
            style={{
              backgroundColor: '#6b7280',
              color: 'white',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Recarregar
          </button>
        </div>
      </div>
      
      <div style={{ color: '#9ca3af' }}>
        <p>Frontend: http://localhost:5173</p>
        <p>Backend: http://localhost:3000</p>
      </div>
    </div>
  )
}

export default App