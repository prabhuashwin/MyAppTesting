import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import api from '../../services/api';
import { checkUser } from '../../services/api';
import { fetchUser, fetchUserInfo } from '../../services/api';
//checkUser

const UserProfile = () => {
    const { user, loading, error } = useAuth();
    const [userExists, setUserExists] = useState(false);
    const [checkingUser, setCheckingUser] = useState(true);    
    const navigate = useNavigate();

    useEffect(() => {
        const checkUserInDatabase = async () => {
            if (user) {
                // Assuming user object contains a username property
                const username = user.split('\\').pop(); // If user is a string, this will work too

                try {
                    const response = await checkUser(username);
                    
                    //const response = await api.get(`User/CheckUser/${username}`);
                    if (response.data.exists) {
                        const userInfoResponse = await fetchUserInfo(username);
                        //setRoles(userInfoResponse.roles || []);
                        localStorage.setItem('isUserRegistered', 'true');
                        localStorage.setItem('isRegistered', 'true');
                        setUserExists(true);
                    } else {
                        const { displayName, email } = response.data;
                        navigate('/register', { state: { user: username, displayName, email } });
                    }
                } catch (error) {
                    console.error('Error checking user in database:', error);
                } finally {
                    setCheckingUser(false);
                }
            } else {
                setCheckingUser(false);
            }
        };

        checkUserInDatabase();
    }, [user, navigate]);

    if (loading || checkingUser) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error fetching user data: {error}</p>;
    }

    if (!userExists) {
        return null;  // This ensures that nothing is rendered while the redirect is happening.
    }

    return (
        <div>
            <h2>Authenticated User:</h2>
            {user ? <p>{user.username || user}</p> : <p>No user data available</p>}
        </div>
    );
};

export default UserProfile;
