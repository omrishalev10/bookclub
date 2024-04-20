  import React, { useState, useEffect, useContext } from 'react';
  import { useNavigate } from 'react-router-dom';
  import MyCarousel from './MyCarousel';
  import Header from './Header';
  import SearchBar from './SearchBar';
  import { faHeart } from "@fortawesome/free-solid-svg-icons";
  import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
  import AuthContext from "../context/AuthProvider";


  const Home = ({ isDarkMode }) => {
    const [search, setSearch] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [searchInitiated, setSearchInitiated] = useState(false);
    const [booksDataBySubject, setBooksDataBySubject] = useState({
       romance: [],
       love: [],
       kids: [],
       fantasy: [],
       magic: [],
       horror: [],
       humor: [],
       thriller: [],
       psychology: [],
       archaeology: []
    });
    const [favoriteBooks, setFavoriteBooks] = useState([]);
    const [successMessage, setSuccessMessage] = useState('');

    const subjects = ['romance', 'love', 'kids', 'fantasy', 'magic', 'horror', 'humor', 'thriller','psychology', 'archaeology'];

    const navigate = useNavigate();

    const { auth } = useContext(AuthContext);

    useEffect(() => {
      subjects.forEach(subject => fetchBooksAndStoreData(subject));
    }, [auth]);
  

    const fetchBooksAndStoreData = async (subject) => {
      try {
        const response = await fetch(`https://webprojmainserver.vercel.app/api/books?subject=${subject}`);
        if (!response.ok) {
          throw new Error('Failed to fetch');
        }
        const books = await response.json();
        setBooksDataBySubject(prevState => ({ ...prevState, [subject]: books }));
      } catch (error) {
        console.error(`Failed to fetch books for ${subject}:`, error);
      }
    };

    const handleSearch = async (query) => {
      const trimmedQuery = query.trim();

      if (trimmedQuery === '') {
        setSearchResults([]);
        setSearchInitiated(false);
        return;
      }

      try {
        const response = await fetch(`https://webprojmainserver.vercel.app/api/search-books?query=${trimmedQuery}`);
        if (!response.ok) {
          throw new Error('Failed to search');
        }
        const results = await response.json();

        if (results.length === 0) {
          setSearchInitiated(true);
        } else {
          const updatedBooksDataBySubject = subjects.reduce((acc, subject) => {
            acc[subject] = results.filter(book => book.subject.toLowerCase() === subject.toLowerCase());
            return acc;
          }, {});
          setBooksDataBySubject(updatedBooksDataBySubject);
          setSearchResults(results);
          setSearchInitiated(true);
        }
      } catch (error) {
        console.error('Failed to search books:', error);
        setSearchInitiated(true);
      }
    };

    const ViewBooks = (bookId) => {
      console.log(`Navigating to /books/${bookId}`);
      navigate(`/books/${bookId}`);
    };

    const addBookToFavorites = async (bookId) => {
      console.log('check: ', auth._id);
      if (!auth || !auth._id) {
        console.error('User ID is missing or user is not logged in');
        return;
      }

      console.log(`Adding book ${bookId} to favorites for user ${auth._id}`);
      try {
        const response = await fetch('https://webprojmainserver.vercel.app/api/update-favorite-books', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId: auth._id, bookId: bookId }), // Send userId and bookId in the request body
          credentials: 'include',
        });
        const data = await response.json();
        
        if (response.ok) {
          setSuccessMessage('Favorite books updated successfully!');
          setFavoriteBooks([...favoriteBooks, bookId]); // Update local state
        } else {
          throw new Error(data.message);
        }
      } catch (error) {
        console.error('Failed to update favorite books:', error);
        setSuccessMessage('Failed to update favorite books. Please try again.');
      }
  };


    const renderBookItem = (book) => {
      const isFavorite = favoriteBooks.includes(book._id);
      const heartIconColor = isFavorite ? 'text-green-500' : 'text-red-500';

      return (
        <div key={book._id} className="book flex flex-col items-center justify-center p-4 bg-white rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg">
          <div className="relative group">
            <img src={book.coverImageUrl} alt={book.title} className="w-full h-auto md:h-80 object-cover rounded-t-lg" />
            {auth && (
              <button
                onClick={() => addBookToFavorites(book._id)}
                className={`absolute top-2 right-2 transform transition duration-500 ease-in-out group-hover:scale-110 bg-white p-2 rounded-full shadow-lg ${heartIconColor} text-2xl`}
                aria-label="Add to favorites"
              >
                <FontAwesomeIcon icon={faHeart} />
              </button>
            )}
          </div>
          <div className="text-center mt-2 w-full px-4">
            <h3 className="text-lg font-semibold truncate">{book.title}</h3>
            <p className="text-sm truncate">{book.author}</p>
          </div>
          <button onClick={() => ViewBooks(book._id)} className="mt-4 transition duration-300 ease-in-out text-gray-800 bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-opacity-50 rounded-full px-6 py-2 text-sm font-medium uppercase tracking-wider shadow-sm hover:shadow-md">
            View Book
          </button>
        </div>
      );
    };

    return (
      <div>
        <Header header='Magic Books Club' isDarkMode={isDarkMode} />
        <SearchBar
          search={search}
          setSearch={(value) => {
            setSearch(value);
            handleSearch(value);
          }}
          onSearch={handleSearch}
        />

        {subjects.map(subject => (
          <div key={subject} className="subject-section mb-10 px-4 lg:px-8">
            {/* Added padding with px-4 for smaller screens and lg:px-8 for larger screens */}
            <h2 className={`text-2xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-black'}`}>
              {searchInitiated && searchResults.length > 0 ? `Search Results for "${subject}"` : `Books of ${subject.charAt(0).toUpperCase() + subject.slice(1)}`}
            </h2>
            <MyCarousel
              items={booksDataBySubject[subject].map(book => renderBookItem(book))}
            />
          </div>
        ))}
      </div>
    );
  };

  export default Home;
