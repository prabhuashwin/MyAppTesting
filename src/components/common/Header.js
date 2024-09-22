import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthProvider';
import UserInfo from './UserInfo'; // Import UserInfo component
import './Header.css';

const Header = () => {
    const { user } = useContext(AuthContext);
    const [isRegistered, setIsRegistered] = useState(false);

    useEffect(() => {
        // Check if the user is registered
        const registered = localStorage.getItem('isUserRegistered');
        setIsRegistered(registered === 'true');
        console.log('isRegistered:', registered);
        console.log('user:', user);
    }, []);

    return (
        <header className="header">
            <div className="logo">
                <h1>EPS Global Tracker</h1>
            </div>
            <div className="center-text">
                <h2>NO EXPORT CONTROLLED TECHNICAL DATA
               </h2>
            </div>
            <div className="user-info">
                {isRegistered && user ? <UserInfo /> : <p>No user info available</p>}
            </div>
        </header>
    );
};

export default Header;
