  import React, { useState } from 'react';
  import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
  import { AuthProvider } from './context/AuthProvider'; // Import the AuthProvider
  import Home from './components/Home';
  import Login from './components/Login';
  import Register from './components/Register';
  import ContactUs from './components/ContactUs';
  import ViewBook from './components/ViewBook';
  import About from './components/About';
  import DarkSide from './components/DarkSide'; 
  import Profile from './components/Profile';
  import SecondHeader from './components/SecondHeader';
  import logo from './images/bookclub_logo.png';
  import Cookies from 'js-cookie';

  function App() {
    const [isDarkMode, setIsDarkMode] = useState(() => {
      return Cookies.get('isDarkMode') === 'true';
    });

    const toggleDarkMode = () => {
    setIsDarkMode(prevMode => {
      const newMode = !prevMode;
      Cookies.set('isDarkMode', newMode, { expires: 7 }); // Expires in 7 days
      return newMode;
    });
  };

    return (
      <AuthProvider>
        <Router>
          <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
          <SecondHeader isDarkMode={isDarkMode} />
          <img src={logo} alt="Logo" className="mx-auto mt-4 w-25" /> 
            <Routes>
              <Route exact path="/" element={<Home isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />} />
              <Route path="/signup" element={<Register isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode}/>} />
              <Route path="/signin" element={<Login isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />} />
              <Route path="/about" element={<About isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode}/>} />
              <Route path="/contactus" element={<ContactUs isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode}/>} />
              <Route path="/profile" element={<Profile isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />} /> 
              <Route path="/books/:id" element={<ViewBook isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode}/>} />
            </Routes>
            <div className="bg-gray-200 dark:bg-gray-900 text-black dark:text-white">
              <DarkSide toggleDarkMode={toggleDarkMode} /> {/* Include the DarkSide component */}
            </div>
          </div>
        </Router>
      </AuthProvider>
    );
  }

  export default App;
