import React, { useRef, useState, useEffect, useContext } from 'react';
import AuthContext from "../context/AuthProvider";
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import Cookies from 'js-cookie';

const LOGIN_URL = 'https://bookclubserver.vercel.app/api/login';

const Login = ({ isDarkMode }) => {
    const navigate = useNavigate();
    const { setAuth } = useContext(AuthContext);
    const userRef = useRef();
    const errRef = useRef();

    const [user, setUser] = useState('');
    const [pwd, setPwd] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        userRef.current.focus();
    }, []);

    useEffect(() => {
        setErrMsg('');
    }, [user, pwd]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(LOGIN_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ username: user, password: pwd })
            });
            if (!response.ok) {
                throw new Error('Login Failed');
            }
            
            const { user: userData } = await response.json();
            // After successful login, set cookies and auth state
            setAuth(userData);
            console.log(userData);
            Cookies.set('isLoggedIn', 'true', { 
                expires: 1, // Expires in 1 day
                sameSite: 'None', // Allow cross-site requests
                secure: true // Cookie sent only over HTTPS
            });
            Cookies.set('username', userData.username, { 
                expires: 1, // Expires in 1 day
                sameSite: 'None', // Allow cross-site requests
                secure: true // Cookie sent only over HTTPS
            });
            navigate('/'); // Redirect to home after successful login
        } catch (err) {
            setErrMsg('Login Failed');
            errRef.current.focus();
        }
    };

    const formSectionStyle = `mt-6 p-10 rounded-lg shadow-md ${isDarkMode ? 'bg-gray-700' : 'bg-white'}`;
    const labelStyle = `block text-xl font-bold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`;
    const inputStyle = `w-full px-4 py-2 rounded border focus:outline-none ${isDarkMode ? 'bg-gray-600 border-gray-600 text-white' : 'border-gray-300 text-gray-700'}`;
    const buttonStyle = `block text-xl w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline`;


    return (
        <div>
            <Header header="Sign In" isDarkMode={isDarkMode} />   
            <div className={`min-h-screen flex flex-col items-center justify-center ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
               
                <section className={`${formSectionStyle} w-full max-w-md`} style={{ minHeight: '50vh' }}>
                    {success ? (
                        <div className={`text-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            <h1 className="text-xl">You are logged in!</h1>
                            <p>
                                <a href="/" className="text-blue-500 hover:text-blue-700">Go to Home</a>
                            </p>
                        </div>
                    ) : (
                        <>
                            <p ref={errRef} className={`mb-4 text-center text-sm ${errMsg ? (isDarkMode ? 'text-red-300' : 'text-red-700') : 'invisible'}`} aria-live="assertive">{errMsg}</p>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label htmlFor="username" className={labelStyle}>Username:</label>
                                    <input 
                                        type="text"
                                        id="username"
                                        ref={userRef}
                                        autoComplete="off"
                                        onChange={(e) => setUser(e.target.value)}
                                        value={user}
                                        required
                                        className={inputStyle}
                                    />
                                </div>     
                                <div>
                                    <label htmlFor="password" className={labelStyle}>Password:</label>
                                    <input 
                                        type="password"
                                        id="password"
                                        onChange={(e) => setPwd(e.target.value)}
                                        value={pwd}
                                        required
                                        className={inputStyle}
                                    />
                                </div>    
                                <div>
                                    <button type="submit" className={buttonStyle}>Sign In</button>
                                </div>
                                <div className="text-center">
                                    <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                        Need an Account?
                                        <a href="/signup" className="text-blue-500 hover:text-blue-700"> Sign Up</a>
                                    </p>
                                </div>
                            </form>
                        </>
                    )}
                </section>
            </div>
        </div>
    );
};

export default Login;
