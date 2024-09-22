import React, { createContext, useState, useEffect, useContext } from 'react';
import { fetchUser, fetchUserInfo } from '../services/api'; // Import fetchUserInfo

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [roles, setRoles] = useState([]);
    const [userInfo, setUserInfo] = useState(null); // Add userInfo state
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getUserData = async () => {
            try {
                const userData = await fetchUser();
                setUser(userData.user);

                if (userData.user) {
                    const username = userData.user.split('\\').pop();
                    const userInfoResponse = await fetchUserInfo(username); // Fetch user info
                    setRoles(userInfoResponse.roles || []);
                    setUserInfo(userInfoResponse); // Set full userInfo
                    localStorage.setItem('isRegistered', 'true');
                } else {
                    localStorage.setItem('isRegistered', 'false');
                }
            } catch (err) {
                setError(err.message);
                localStorage.setItem('isRegistered', 'false');
            } finally {
                setLoading(false);
            }
        };

        getUserData();
    }, []);

    return (
        <AuthContext.Provider value={{ user, roles, userInfo, loading, error }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
