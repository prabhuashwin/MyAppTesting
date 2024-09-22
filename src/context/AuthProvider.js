// AuthContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import { fetchUser } from '../services/api'; 

// Create the AuthContext
export const AuthContext = createContext();

// Define the AuthProvider component
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getUserData = async () => {
            try {
                // Fetch user data from the API
                const userData = await fetchUser();
                setUser(userData.user);
                setRoles(userData.roles);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        getUserData();
    }, []);

    return (
        <AuthContext.Provider value={{ user, roles, loading, error }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to use the AuthContext
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export default AuthProvider; // Default export of AuthProvider
