import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthProvider';

const SecondHeader = ({isDarkMode}) => {
  const { auth, logout } = useContext(AuthContext);
  const isLoggedIn = !!auth; 
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); 
    navigate('/'); 
  };
  
  const handleProfile = () => {
    navigate('/profile'); 
    window.location.reload();
  };

  const capitalizeFirstLetter = (string) => {
    if (!string) return ''; // Return an empty string if not provided
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  return (
    <div className={`flex justify-start items-center py-3 ${isDarkMode ? 'bg-white text-black' : 'bg-gray-800 text-white'}`}>
      <Link to="/" className="px-4 py-2 text-sm font-semibold rounded-lg hover:bg-white hover:text-blue-500 transition-colors mr-4">Home</Link>
      <Link to="/about" className="px-4 py-2 text-sm font-semibold rounded-lg hover:bg-white hover:text-blue-500 transition-colors mr-4">About</Link>
      <Link to="/contactus" className="px-4 py-2 text-sm font-semibold rounded-lg hover:bg-white hover:text-blue-500 transition-colors mr-4">Contact Us</Link>
      {isLoggedIn ? (
        <>
          <button onClick={handleLogout} className="px-4 py-2 text-sm font-semibold rounded-lg hover:bg-white hover:text-blue-500 transition-colors">Sign Out</button>
          <button onClick={handleProfile} className="px-4 py-2 text-sm font-semibold rounded-lg hover:bg-white hover:text-blue-500 transition-colors">Profile</button>
        <span className="mr-4 text-sm font-semibold">Welcome, {capitalizeFirstLetter(auth.username)}</span>
        </>
      ) : (
        <>
          <Link to="/signup" className="px-4 py-2 text-sm font-semibold rounded-lg hover:bg-white hover:text-blue-500 transition-colors mr-4">Sign Up</Link>
          <Link to="/signin" className="px-4 py-2 text-sm font-semibold rounded-lg hover:bg-white hover:text-blue-500 transition-colors">Sign In</Link>
        </>
      )}
    </div>
    
  );
};

export default SecondHeader;