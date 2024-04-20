import React, { createContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState(null);

    useEffect(() => {
        checkLoginStatus();
    
    }, []);

    const checkLoginStatus = async () => {
        try {
            const response = await fetch('https://webprojmainserver.vercel.app/api/verify', {
                method: 'GET',
                credentials: 'include' 
            });

            if (!response.ok) {
                throw new Error('Not logged in');
            }
            const data = await response.json(); 
            if (data.isLoggedIn) {
                setAuth(data.user);
            } else {
                setAuth(null);
            }
        } catch (error) {
            console.error('Error during auth verification:', error);
            setAuth(null);
        }
    };

    const updateFavoriteBooks = (newFavoriteBooks) => {
        setAuth(auth => ({ ...auth, favoriteBooks: newFavoriteBooks }));
    };

    const logout = async () => {
        try {
            const response = await fetch('https://webprojmainserver.vercel.app/api/logout', {
                method: 'POST',
                credentials: 'include'
            });

            if (response.ok) {
                setAuth(null);
            }
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <AuthContext.Provider value={{ auth, setAuth, logout, checkLoginStatus, updateFavoriteBooks }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
