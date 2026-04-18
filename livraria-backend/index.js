require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const bookRoutes = require('./routes/bookRoutes');

const app = express();

// Middleware - CORREÇÃO IMPORTANTE
app.use(cors({
    origin: '*', // Permite todas as origens (para produção, especifique a URL do frontend)
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json()); // Para parsing do JSON
app.use(express.urlencoded({ extended: true }));

// Conexão MongoDB
const mongoURI = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_CLUSTER}/?appName=Livraria`;

mongoose.connect(mongoURI)
    .then(() => console.log('✅ Conectado ao MongoDB'))
    .catch(err => console.error('❌ Erro ao conectar:', err));

// Rotas
app.use('/livros', bookRoutes);

app.get('/', (req, res) => {
    res.json({
        mensagem: 'API de Livraria funcionando!',
        endpoints: {
            livros: 'GET /livros',
            livro: 'GET /livros/:id',
            criar: 'POST /livros',
            atualizar: 'PUT /livros/:id',
            deletar: 'DELETE /livros/:id'
        }
    });
});

app.get('/status', (req, res) => {
    res.json({
        status: 'online',
        mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
        timestamp: new Date()
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
});