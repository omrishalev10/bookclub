const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  coverImageUrl: { type: String, required: true },
  subject: { type: String, required: true } 
});

// Correct placement: Define indexes before creating the model
bookSchema.index({ title: 'text', author: 'text' });

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;