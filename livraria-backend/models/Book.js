const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    titulo: { type: String, required: true },
    autor: { type: String, required: true },
    ano: { type: Number, default: null },
    preco: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Sem pre-save, deixa o MongoDB gerenciar

module.exports = mongoose.model('Book', bookSchema);