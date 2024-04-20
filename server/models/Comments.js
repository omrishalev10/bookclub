const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true }, // Reference to the Book collection
  text: { type: String, required: true },
  author: { type: String, required: true }
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;