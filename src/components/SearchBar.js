import React from 'react';

const SearchBar = ({ search, setSearch, onSearch  }) => {

  const handleSearch = async (e) => {
    e.preventDefault();
    onSearch(search); // This function will be passed down from the parent component
  };

  return (
    <form className="flex justify-center items-center mx-auto my-4 gap-2 w-full max-w-4xl px-4" onSubmit={handleSearch}>
        <div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search books..."
            className="text-black flex-grow p-2 rounded-full outline-none border border-gray-300 mr-2 w-80"
          />
          <button 
            type="submit"
            className="p-2 rounded-full bg-blue-600 text-white border-none cursor-pointer whitespace-nowrap shrink-0 hover:bg-blue-700">
              Search
          </button>
        </div>
    </form> 
  );
};

export default SearchBar;