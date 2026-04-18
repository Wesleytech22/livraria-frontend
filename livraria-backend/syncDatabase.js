const mongoose = require('mongoose');
const fs = require('fs');
const Book = require('./models/Book');
require('dotenv').config();

async function syncDatabases() {
    try {
        // Conectar ao MongoDB
        const mongoURI = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_CLUSTER}/?appName=Livraria`;
        await mongoose.connect(mongoURI);
        console.log('✅ Conectado ao MongoDB');

        // Verificar e ler books.json
        let booksData = [];
        try {
            const fileContent = fs.readFileSync('./books.json', 'utf8');
            if (fileContent && fileContent.trim()) {
                booksData = JSON.parse(fileContent);
                console.log(`📖 Lidos ${booksData.length} livros do books.json`);
            } else {
                console.log('⚠️ books.json está vazio, criando array vazio');
                fs.writeFileSync('./books.json', '[]');
                booksData = [];
            }
        } catch (error) {
            console.log('⚠️ books.json não encontrado ou inválido, criando novo arquivo');
            fs.writeFileSync('./books.json', '[]');
            booksData = [];
        }

        // Opção 1: Exportar MongoDB -> books.json
        const mongoBooks = await Book.find();
        fs.writeFileSync('./books-backup.json', JSON.stringify(mongoBooks, null, 2));
        console.log(`💾 Backup do MongoDB salvo em books-backup.json (${mongoBooks.length} livros)`);

        // Opção 2: Importar books.json -> MongoDB (apenas se tiver dados)
        if (booksData.length > 0) {
            let imported = 0;
            for (const book of booksData) {
                await Book.updateOne(
                    { titulo: book.titulo, autor: book.autor },
                    {
                        titulo: book.titulo,
                        autor: book.autor,
                        ano: book.ano,
                        preco: book.preco || 0
                    },
                    { upsert: true }
                );
                imported++;
            }
            console.log(`📥 ${imported} livros importados do books.json para MongoDB`);
        } else {
            console.log('⚠️ Nenhum dado para importar do books.json');
        }

        console.log('✅ Sincronização concluída!');
        process.exit();
    } catch (error) {
        console.error('❌ Erro:', error.message);
        process.exit(1);
    }
}

syncDatabases();