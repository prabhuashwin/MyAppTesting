// withRegistrationCheck.js
import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import api from '../../services/api';

const withRegistrationCheck = (WrappedComponent) => {
    return (props) => {
        const { user, loading, error } = useContext(AuthContext);
        const [userExists, setUserExists] = useState(false);
        const [checkingUser, setCheckingUser] = useState(true);
        const navigate = useNavigate();

        useEffect(() => {
            const checkUserInDatabase = async () => {
                if (user) {
                    const username = user.split('\\').pop();

                    try {
                        const response = await api.get(`User/CheckUser/${username}`);
                        if (response.data.exists) {
                            setUserExists(true);
                        } else {
                            navigate('/register', { state: { user: username } });
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

        return <WrappedComponent {...props} />;
    };
};

export default withRegistrationCheck;
