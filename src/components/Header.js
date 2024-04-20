import React from 'react';

const Header = ({ header, isDarkMode }) => {
  return (
    <div className={`text-gray-900 py-4 px-8 flex justify-between items-center ${isDarkMode ? 'text-white' : 'text-black'}`}>
      <div className="flex-grow text-center">
        {/* Increase text size using Tailwind text size classes */}
        <h1 className={`${isDarkMode ? 'text-white' : 'text-black'} text-3xl md:text-4xl lg:text-5xl font-semibold`}>{header}</h1>
      </div>
    </div>
  );
};

export default Header;

