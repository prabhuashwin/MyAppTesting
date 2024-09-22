import axios from 'axios';

const API_URL = 'https://localhost:7070/api';
//const API_URL = 'http://blr1wwebts1.utcapp.com:8087/api'; // Update to your API URL

//https://localhost:7070/api
//http://blr1wwebts1.utcapp.com:8087/api

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true, // Ensure credentials are sent with the request
    headers: {
        'Content-Type': 'application/json',
    },
});

export const fetchUser = async () => {
    try {
        const response = await api.get('/Authentication');
        return response.data;
    } catch (error) {
        throw new Error('Failed to fetch user data');
    }
};

export const fetchUserInfo = async (username) => {
    try {
        const response = await api.get(`/user/getuserinfo/${username}`);
        const userInfo = response.data;
        localStorage.setItem("UserInfo", JSON.stringify(userInfo));
        return userInfo;
    } catch (error) {
        if (error.response && error.response.status === 404) {
            throw new Error('User not found');
        } else {
            throw new Error('Failed to fetch user info');
        }
    }
};

export const fetchPrograms = async () => {
    try {
        const response = await api.get('/QnProgram/GetAllPrograms');
        return response.data;
    } catch (error) {
        throw new Error('Failed to fetch programs');
    }
};

export const checkUser = async (username) => {
    try {
        const response = await api.get(`/User/CheckUser/${username}`);
        console.log('userdata', response);
        return response; // Adjust based on your API response structure
    } catch (error) {
        throw new Error('Failed to check user in database');
    }
};

export const assignAnalyst = async (qnNumber, userId) => {
    try {
        const response = await api.post('/QnTracker/AssignAnalyst', { qnNumber, userId });
        return response.data;
    } catch (error) {
        throw new Error('Failed to assign analyst');
    }
};

export const saveQnData = async (qnData) => {
    try {
        const response = await api.post('/QnTracker/SaveTrackerData', qnData);
        return response.data;
    } catch (error) {
        throw new Error('Failed to save QN Data');
    }
};

// New method to save ATP Date
export const saveATPDate = async (sapQnNumber, atpDate) => {
    try {
        const response = await api.post(`/QnTracker/SaveATPDate/${sapQnNumber}`, atpDate);
        return response.data;
    } catch (error) {
        throw new Error('Failed to save ATP date');
    }
};

export const updateAnalyst = async (qnNumber, userId) => {
    try {
        const response = await api.post(`/QnTracker/delegateAnalyst/${qnNumber}`, userId);
        return response.data;
    } catch (error) {
        throw new Error('Failed to update Analyst data');
    }
};

export const updateReviewer = async (qnNumber, userId) => {
    try {
        const response = await api.post(`/QnTracker/delegateReviewer/${qnNumber}`, userId);
        return response.data;
    } catch (error) {
        throw new Error('Failed to update Reviewer data');
    }
};

export const getUserId = async (username) => {
    try {
        const response = await api.get(`/User/getUserIdByUserId/${username}`);
        console.log('userdata', response);
        return response.data.id; // Assuming the user ID is within `data.userId`
    } catch (error) {
        throw new Error('Failed to check user in database');
    }
};



export default api;
