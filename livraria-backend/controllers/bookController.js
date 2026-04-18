const Book = require('../models/Book');

const bookController = {
    // GET /livros
    getBooks: async (req, res) => {
        try {
            const books = await Book.find().sort({ createdAt: -1 });
            res.json(books);
        } catch (error) {
            res.status(500).json({ mensagem: 'Erro ao buscar livros', erro: error.message });
        }
    },

    // GET /livros/:id
    getBookById: async (req, res) => {
        try {
            const book = await Book.findById(req.params.id);
            if (!book) return res.status(404).json({ mensagem: 'Livro não encontrado' });
            res.json(book);
        } catch (error) {
            res.status(500).json({ mensagem: 'Erro ao buscar livro', erro: error.message });
        }
    },

    // POST /livros
    createBook: async (req, res) => {
        try {
            const newBook = new Book(req.body);
            await newBook.save();
            res.status(201).json(newBook);
        } catch (error) {
            res.status(400).json({ mensagem: 'Erro ao criar livro', erro: error.message });
        }
    },

    // PUT /livros/:id
    updateBook: async (req, res) => {
        try {
            const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
            if (!updatedBook) return res.status(404).json({ mensagem: 'Livro não encontrado' });
            res.json(updatedBook);
        } catch (error) {
            res.status(400).json({ mensagem: 'Erro ao atualizar livro', erro: error.message });
        }
    },

    // DELETE /livros/:id
    deleteBook: async (req, res) => {
        try {
            const deletedBook = await Book.findByIdAndDelete(req.params.id);
            if (!deletedBook) return res.status(404).json({ mensagem: 'Livro não encontrado' });
            res.json({ mensagem: 'Livro deletado com sucesso' });
        } catch (error) {
            res.status(500).json({ mensagem: 'Erro ao deletar livro', erro: error.message });
        }
    }
};

module.exports = bookController;