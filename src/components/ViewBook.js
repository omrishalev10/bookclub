import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Comments from './Comments';
import Header from './Header';

const ViewBook = ({isDarkMode}) => {
  const { id } = useParams(); // Extract the book ID from the URL
  const [book, setBook] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [authorName, setAuthorName] = useState('');

  useEffect(() => {
    const fetchBook = async () => {
      try {
        console.log(id);
        const response = await fetch(`https://webprojmainserver.vercel.app/api/books/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch book');
        }
        const data = await response.json();
        console.log(data._id); // Log the response data
        setBook(data); // Set the fetched book data to state
      } catch (error) {
        console.error('Failed to fetch book:', error);
      }
    };

    fetchBook(); // Call the fetchBook function
  }, [id]); // Depend on the book ID

  const handleCommentSubmit = async (event) => {
    event.preventDefault();
    try {
      if (!commentText.trim() || !authorName.trim()) {
        // Check if either the comment text or author name is empty
        console.error('Comment text and author name are required');
        return;
      }
      const response = await fetch(`https://webprojmainserver.vercel.app/api/books/${id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: commentText, author: authorName }),
      });
      if (!response.ok) {
        throw new Error('Failed to submit comment');
      }
      // Reset the comment text and author name after submission
      setCommentText('');
      setAuthorName('');
    } catch (error) {
      console.error('Failed to submit comment:', error);
    }
  };

  if (!book) {
    return <div>Loading...</div>; // Render a loading message while fetching book details
  }

  return (
    <div className="p-4">
      <Header header={book ? book.title : 'Loading...'} isDarkMode={isDarkMode} />
      <h2 className={`text-center text-xl lg:text-2xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{book.author}</h2>
      <div className="flex flex-col items-center">
        <div className="mb-4">
          {book && (
            <img
              src={book.coverImageUrl}
              alt={`Cover of ${book.title}`}
              className="mx-auto w-full max-w-md object-contain"
            />
          )}
        </div>
        <div className="w-full max-w-md px-4">
          <form onSubmit={handleCommentSubmit} className="space-y-4">
            <input
              type="text"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              placeholder="Your Name"
              className={`w-full p-2 rounded border focus:outline-none focus:ring-2 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-700'}`}
            />
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write your comment here..."
              className={`w-full p-2 h-40 rounded border focus:outline-none focus:ring-2 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-700'}`}
            ></textarea>
            <button
              type="submit"
              className={`w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300 ease-in-out`}
            >
              Submit Comment
            </button>
          </form>
        </div>
        {/* Ensure Comments component is passing necessary props */}
        <div className="w-full max-w-md px-4 mt-4">
          <Comments bookId={id} isDarkMode={isDarkMode} />
        </div>
      </div>
    </div>
  );
};

export default ViewBook;
