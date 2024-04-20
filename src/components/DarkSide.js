import React, { useState } from 'react';

const DarkSide = ({ toggleDarkMode }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleDarkModeToggle = () => {
    setIsDarkMode(prevMode => !prevMode);
    toggleDarkMode(); // Call the toggleDarkMode function passed as props
  };

  return (
    <button 
      onClick={handleDarkModeToggle} 
      className="fixed top-4 right-4 bg-gray-300 dark:bg-gray-800 px-4 py-2 rounded"
    >
      {isDarkMode ? 'Light Mode' : 'Dark Mode'}
    </button>
  );
};

export default DarkSide;
