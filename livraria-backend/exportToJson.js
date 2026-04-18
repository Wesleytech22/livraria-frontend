const mongoose = require('mongoose');
const fs = require('fs');
const Book = require('./models/Book');
require('dotenv').config();

async function exportToJson() {
    try {
        const mongoURI = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_CLUSTER}/?appName=Livraria`;
        await mongoose.connect(mongoURI);
        console.log('✅ Conectado ao MongoDB');

        const books = await Book.find();

        // Salvar no formato correto
        const booksData = books.map(book => ({
            titulo: book.titulo,
            autor: book.autor,
            ano: book.ano,
            preco: book.preco || 0
        }));

        fs.writeFileSync('./books.json', JSON.stringify(booksData, null, 2));
        console.log(`✅ ${books.length} livros exportados para books.json`);

        await mongoose.disconnect();
        process.exit();
    } catch (error) {
        console.error('❌ Erro:', error);
        process.exit(1);
    }
}

exportToJson();