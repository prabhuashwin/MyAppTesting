import React from 'react';
import UserProfile from '../components/specific/UserProfile';
import Dashboard from '../components/specific/Dashboard';

const HomePage = () => {
    return (
        <div>
            <UserProfile />
            <Dashboard />
        </div>
    );
};

export default HomePage;
