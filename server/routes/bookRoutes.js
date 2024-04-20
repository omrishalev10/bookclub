// routes/bookRoutes.js
const express = require('express');
const Book = require('../models/Book');
const Comments = require('../models/Comments');
const router = express.Router();

// Function to fetch and store books by subject
const fetchAndStoreBooks = async () => {
    try {
      const subjects = ['romance', 'love', 'kids', 'fantasy', 'magic', 'horror', 'humor', 'thriller','psychology', 'archaeology'];     
      for (const subject of subjects) {
        const url = `https://openlibrary.org/subjects/${subject}.json?limit=15`;
        const response = await fetch(url);
        const booksData = await response.json();
  
        const books = booksData.works.map(work => ({
          title: work.title,
          author: work.authors.map(author => author.name).join(', '),
          coverImageUrl: work.cover_id ? `https://covers.openlibrary.org/b/id/${work.cover_id}-L.jpg` : null,
          subject: subject // Store the subject with each book
        }));
  
        // Save each book in MongoDB
        for (const bookData of books) {
          // Update the book if it exists, otherwise add a new one
          await Book.findOneAndUpdate(
            { title: bookData.title, author: bookData.author },
            bookData,
            { upsert: true, new: true, setDefaultsOnInsert: true }
          );
        }
      }
      console.log('Books fetched and stored successfully');
    } catch (error) {
      console.error('Failed to fetch and store books', error);
    }
  };

// Call fetchAndStoreBooks function when the server starts
fetchAndStoreBooks();

//******************************* */
// Fetch a single book by ID from MongoDB

router.get('/books/:id', async (req, res) => {
  console.log(req.body);
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.status(200).json(book);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to get book', error: error.message });
  }
});

// Add a comment to a book
router.post('/books/:id/comments', async (req, res) => {
  try {
    const { id } = req.params;

    const { text, author } = req.body;

    // Create a new comment instance
    const newComment = new Comments({
      text,
      author,
      bookId: id,
    });

    // Save the comment to the database
    const savedComment = await newComment.save();

    res.status(201).json(savedComment); // Respond with the saved comment
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to add comment', error: error.message });
  }
});
// Route to fetch comments for a specific book
router.get('/books/:id/comments', async (req, res) => {
  try {
    const { id } = req.params;

    // If the request includes a `since` query parameter, it means the client is polling for updates
    const since = req.query.since;

    // If `since` is provided, find comments updated since that timestamp
    // Otherwise, find all comments associated with the book ID
    const query = since ? { bookId: id, updatedAt: { $gt: new Date(since) } } : { bookId: id };

    // Find comments based on the query
    const comments = await Comments.find(query);

    // If `since` is provided, respond immediately with any updates
    if (since) {
      res.status(200).json(comments);
    } else {
      // Otherwise, if `since` is not provided, wait for updates before responding
      // For simplicity, let's just wait for a short time before responding
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Then return the current comments
      res.status(200).json(comments);
    }
  } catch (error) {
    console.error('Failed to fetch comments:', error);
    res.status(500).json({ message: 'Failed to fetch comments', error: error.message });
  }
});

//******************************* */

// Route to fetch and store books by subject
router.get('/fetch-books', async (req, res) => {
  res.status(200).json({ message: 'Fetching and storing books automatically triggered' });
});

// Fetch the books by subject from mongoDB
router.get('/books', async (req, res) => {
  try {
    let query = {};
    if (req.query.subject) {
      query.subject = req.query.subject; // Add filtering by subject
    }
    const books = await Book.find(query);
    res.status(200).json(books);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to get books', error: error.message });
  }
});

// Get router for Seach Books
router.get('/search-books', async (req, res) => {
  try {
    const query = req.query.query;
    const books = await Book.find({
      $or: [
        { title: { $regex: query, $options: 'i' } }, // Partial text search on title
        { author: { $regex: query, $options: 'i' } }, // Partial text search on author
      ]
    });
    res.status(200).json(books);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to search books', error: error.message });
  }
});



// Add a comment to a book
router.post('/books/:id/comments', async (req, res) => {
  try {
    const { id } = req.params;

    const { text, author } = req.body;

    // Create a new comment instance
    const newComment = new Comments({
      text,
      author,
      bookId: id,
    });

    // Save the comment to the database
    const savedComment = await newComment.save();

    res.status(201).json(savedComment); // Respond with the saved comment
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to add comment', error: error.message });
  }
});

// Route to fetch comments for a specific book
router.get('/books/:id/comments', async (req, res) => {
  try {
    // Find all comments associated with the book ID
    const comments = await Comments.find({ bookId: req.params.id });
    res.status(200).json(comments);
  } catch (error) {
    console.error('Failed to fetch comments:', error);
    res.status(500).json({ message: 'Failed to fetch comments', error: error.message });
  }
});

//******************************* */

module.exports = router;
