import React, { useContext, useState, useEffect } from 'react';
import AuthContext from "../context/AuthProvider";
import Header from './Header';
import Select from 'react-select';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook for navigation

const Profile = ({ isDarkMode }) => {
  
  const { auth, updateFavoriteBooks } = useContext(AuthContext);
  const [favoriteSubjects, setFavoriteSubjects] = useState([]);
  const [initialFavoriteSubjects, setInitialFavoriteSubjects] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [selectedBook, setSelectedBook] = useState(null); // Track selected book
  const [favoriteBooks, setFavoriteBooks] = useState(auth?.favoriteBooks || []); // Track favorite books
  const navigate = useNavigate(); // Initialize navigate function

  const [availableSubjects] = useState([
    { label: 'Romance', value: 'Romance' },
    { label: 'Love', value: 'Love' },
    { label: 'Kids', value: 'Kids' },
    { label: 'Fantasy', value: 'Fantasy' },
    { label: 'Magic', value: 'Magic' },
    { label: 'Horror', value: 'Horror' },
    { label: 'Humor', value: 'Humor' },
    { label: 'Thriller', value: 'Thriller' },
    { label: 'Psychology', value: 'Psychology' },
    { label: 'Archaeology', value: 'Archaeology' },
   
  ]);
/* 
 { label: 'Historical Fiction', value: 'Historical Fiction' },
    { label: 'Mystery and detective stories', value: 'Mystery and detective stories' },
*/
  useEffect(() => {
    // This will update the local state when the global state changes
    if (auth?.favoriteBooks) {
      setFavoriteBooks(auth.favoriteBooks);
    }
    if (auth?.favoriteSubjects) {
      setFavoriteSubjects(auth.favoriteSubjects);
    }
  }, [auth]); 
  

  const handleSubjectChange = (selectedOptions) => {
    setFavoriteSubjects(selectedOptions.map(option => option.value));
  };

  const handleSaveSubjects = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch('https://webprojmainserver.vercel.app/api/update-favorite-subjects', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subjects: favoriteSubjects }),
        credentials: 'include', // This is important to include the session cookie
      });
      if (response.ok) {
        const data = await response.json();
        setSuccessMessage(data.message);
        setFavoriteSubjects(favoriteSubjects); // Update the favoriteSubjects state to trigger re-render
        console.log(data);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }
    } catch (error) {
      console.error('Failed to update favorite subjects:', error);
      setSuccessMessage('Failed to update favorite subjects. Please try again.');
    }
  };

  const removeBookFromFavorites = async (e, bookId) => {
    e.preventDefault();
    try {
        
        const response = await fetch(`https://webprojmainserver.vercel.app/api/remove-favorite-book/${bookId}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: auth._id }),
            credentials: 'include',
        });
         
        if (response.ok) {
          const data = await response.json();
          const updatedFavorites = favoriteBooks.filter(book => book.id !== bookId);
          //setFavoriteBooks(prevState => prevState.filter(book => book.id !== bookId));
          //updateFavoriteBooks(prevState => prevState.filter(book => book.id !== bookId));
          setFavoriteBooks(updatedFavorites); 
          updateFavoriteBooks(updatedFavorites);
          window.location.reload();
          console.log(data); 
          console.log('Book removed from favorites:', bookId);
        }
      } catch (error) {
          console.error('Failed to remove favorite book:', error);
      }
  };

  if (!auth) {
    return <div>Please log in to view this page.</div>;
  }

  const { username, email } = auth; 
  const isFavoriteSubjectsChanged = JSON.stringify(favoriteSubjects) !== JSON.stringify(initialFavoriteSubjects);  // Check if there are any changes in favoriteSubjects
  const saveButtonDisabled = !isFavoriteSubjectsChanged;  // Disable button if no changes made

  // Function to handle selecting a book
  const handleBookSelect = (book) => {
    console.log(book);
    setSelectedBook(book);
    navigate(`/books/${book._id}`); // Navigate to the book ID page
  };

  const selectStyles = {
    option: (provided, state) => ({
      ...provided,
      color: isDarkMode ? 'black' : provided.color,
    }),
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-800 border-gray-600' : 'bg-gray-100 border-gray-300'}`}>
      <Header header='Profile' isDarkMode={isDarkMode} />
      <div className="flex flex-col items-center p-4">
        <div className={`w-full max-w-2xl p-6 rounded-lg shadow-md ${isDarkMode ? 'text-white' : 'text-gray-700 '}`}>
          <h1 className="text-2xl font-bold mb-4">User Profile</h1>
          <p className="text-lg"><strong>Username:</strong> {username}</p>
          <p className="text-lg"><strong>Email:</strong> {email}</p>
          <div>
            <h2 className="text-lg mb-2"><strong>Favorite Subjects:</strong></h2>
            <Select
              isMulti
              value={availableSubjects.filter(option => favoriteSubjects.includes(option.value))}
              onChange={handleSubjectChange}
              options={availableSubjects}
              styles={selectStyles}
            />
            <button 
              onClick={handleSaveSubjects} 
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:shadow-outline"
              disabled={saveButtonDisabled}
            >
              Save Favorite Subjects
            </button>
            {successMessage && <p className="text-green-600">{successMessage}</p>}
          </div>
          <div className="text-lg mt-4">
            <strong>Favorite Books:</strong>
            <div className="flex flex-col gap-4 mt-2">
              {favoriteBooks && favoriteBooks.length > 0 ? (
                favoriteBooks.map(book => (
                  <li key={book._id} className="border p-2 rounded flex items-center">
                    <div onClick={() => handleBookSelect(book)}>
                      {book.title} by {book.author}
                    </div>
                    <button 
                      onClick={(e) => removeBookFromFavorites(e,book._id)} 
                      className="ml-auto text-red-500 hover:text-red-700"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                    {/* Change View Book to a button */}
                    <button 
                      onClick={() => handleBookSelect(book)} 
                      className="ml-2 px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:shadow-outline"
                    >
                      View Book
                    </button>
                  </li>
                ))
              ) : (
                <p>No favorite books added.</p>
              )}
            </div>
            {selectedBook && (
              <div className="mt-4">
                <img src={selectedBook.coverImageUrl} alt={selectedBook.title} className="w-16 h-24 object-cover" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
