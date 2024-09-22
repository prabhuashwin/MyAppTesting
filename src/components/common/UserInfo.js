import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthProvider';
import api from '../../services/api';
import { Dropdown, DropdownButton } from 'react-bootstrap';
import './UserInfo.css';

const UserInfo = () => {
    const { user } = useContext(AuthContext);
    const [userInfo, setUserInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (user) {
            const fetchUserInfo = async () => {
                try {
                    // Delay the API call by 5 seconds
                    await new Promise(resolve => setTimeout(resolve, 5000));
                    const username = user.split('\\').pop();
                    console.log('Fetching user info for:', username); // Debug log
                    const response = await api.get(`/user/getuserinfo/${username}`);
                    console.log('User info response:', response.data); // Debug log
                    setUserInfo(response.data);
                } catch (error) {
                    setError('Error fetching user info');
                    console.error('Error fetching user info:', error);
                } finally {
                    setLoading(false);
                }
            };

            fetchUserInfo();
        }
    }, [user]);

    if (loading) {
        return <p>Loading user info...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    if (!userInfo) {
        return <p>No user info available</p>;
    }

    const siteName = userInfo.userSites?.[0]?.siteName;

    return (
        <div className="user-info">
            <DropdownButton className="text-color"
                id="dropdown-basic-button"
                title={`${userInfo.userName}`}
                variant="secondary"
            >
                <Dropdown.Header>
                    <span className="block text-sm">{userInfo.userName}</span>
                </Dropdown.Header>

                <Dropdown.Divider className="divider-color" />

                {/* Roles Section */}
                {/* <Dropdown.ItemText className="roles-header">Roles</Dropdown.ItemText>
                {userInfo.roles.map((role, index) => (
                    <Dropdown.Item key={index} className="dropdown-item">{role}</Dropdown.Item>
                ))} */}

                {/* <Dropdown.Divider className="divider-color" /> */}

                {/* Function Section */}
                <Dropdown.ItemText className="roles-header">Function</Dropdown.ItemText>
                {userInfo.function.map((func, index) => (
                    <Dropdown.Item key={index} className="dropdown-item">{func}</Dropdown.Item>
                ))}

                {/* SiteName Section */}
                {siteName && (
                    <>
                        <Dropdown.Divider className="divider-color" />
                        <Dropdown.ItemText className="roles-header">Site Name</Dropdown.ItemText>
                        <Dropdown.Item className="dropdown-item">{siteName}</Dropdown.Item>
                    </>
                )}


            </DropdownButton>
        </div>
    );
};

export default UserInfo;