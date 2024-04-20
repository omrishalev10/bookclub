import React, { useState, useEffect } from 'react';

const MyComponent = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/notes'); // Assuming your backend API endpoint is '/api/notes'
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const notes = await response.json();
        setData(notes);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>Notes</h1>
      <ul>
        {data.map((note) => (
          <li key={note._id}>{note.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default MyComponent;