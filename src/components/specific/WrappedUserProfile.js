// WrappedUserProfile.js
import React from 'react';
import UserProfile from './UserProfile';
import withRegistrationCheck from './withRegistrationCheck';

const WrappedUserProfile = withRegistrationCheck(UserProfile);

export default WrappedUserProfile;
