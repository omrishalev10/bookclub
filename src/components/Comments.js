import React, { useState, useEffect } from 'react';

const Comments = ({ bookId, isDarkMode }) => {
  // State to store comments
  const [comments, setComments] = useState([]);

  // Function to fetch comments
  const fetchComments = async () => {
    try {
      const response = await fetch(`https://bookclubserver.vercel.app/api/books/${bookId}/comments`);
      if (!response.ok) {
        throw new Error('Failed to fetch comments');
      }
      const data = await response.json();
      setComments(data);
    } catch (error) {
      console.error('Failed to fetch comments:', error);
    }
  };

  // Fetch comments initially and start polling for updates when the component mounts
  useEffect(() => {
    fetchComments(); // Fetch comments initially

    const interval = setInterval(fetchComments, 2000); // Poll for updates every 5 seconds

    // Clean up function to clear the interval when the component unmounts
    return () => clearInterval(interval);
  }, [bookId]); // Depend on the bookId prop

  return (
    <div>
      <h1 className={`text-center text-xl lg:text-2xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'}`} >Comments</h1>
      {/* Render comments */}
      {comments.map(comment => (
        <div
          key={comment._id}
          style={{
            display: 'flex',
            marginBottom: '20px',
            backgroundColor: '#f0f0f0', // Example background color for comment
          }}
          className="comment-container"
        >
          <div
            style={{
              flex: 1,
              padding: '10px',
              fontSize: '20px',
              marginBottom: '5px',
              color: 'black',
              fontFamily: 'Tahoma, sans-serif', // Example font family
            }}
            className="comment"
          >
            {comment.text}
          </div>
          <div
            style={{
              flex: 1,
              padding: '10px',
              fontStyle: 'italic',
              color: 'black',
              backgroundColor: '#e0e0e0', // Example background color for poster
            }}
            className="poster"
          >
            Posted by: {comment.author}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Comments;
