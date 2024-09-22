import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import './UserRegistration.css';

const UserRegistration = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const user = location.state?.user || ''; // Provide a fallback if user is undefined
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    const [sites, setSites] = useState([]);
    const [selectedSite, setSelectedSite] = useState('');
    const [siteError, setSiteError] = useState(false);

    const [functions, setFunctions] = useState([]);
    const [selectedFunction, setSelectedFunction] = useState('');
    const [functionError, setFunctionError] = useState(false);
    
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            if (!user) {
                console.error('User not provided.');
                return;
            }

            setLoading(true);
            try {
                const userResponse = await api.get(`/user/checkuser/${user}`);
                console.log('Full User API Response:', userResponse.data); 
                if (!userResponse.data.exists) {
                    console.log('Setting Name:', userResponse.data.displayName);
                    console.log('Setting Email:', userResponse.data.email);
                    setName(userResponse.data.displayName || '');
                    setEmail(userResponse.data.email || '');
                }

                const sitesResponse = await api.get('/site/getallsites');
                console.log('Sites API Response:', sitesResponse.data);
                setSites(sitesResponse.data || []);

                const functionsResponse = await api.get('/User/GetAllFunctions');
                console.log('Functions API Response:', functionsResponse.data);
                setFunctions(functionsResponse.data || []);

            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedSite) {
            setSiteError(true);
            return;
        }

        setLoading(true); // Start loading animation
        try {
            const userData = {
                UserId: user,
                UserName: name,
                UserEmail: email,
                SiteId: sites.find(site => site.siteName === selectedSite)?.id,
                FunctionId: functions.find(func => func.functionName === selectedFunction)?.id // Added FunctionId
            };

            const response = await api.post('/user/registeruser', userData);
            console.log(response.data.message);
            localStorage.setItem('isUserRegistered', 'true');
            navigate('/qndata');
        } catch (error) {
            console.error('Error registering user:', error);
        } finally {
            setLoading(false); // End loading animation
        }
    };

    return (
        <div className="user-registration">
            <h2>User Registration</h2>
            {loading ? (
                // Loading spinner while data is being submitted
                <div className="loading-spinner">
                    <img src="https://i.gifer.com/ZZ5H.gif" alt="Loading..." />
                    {/* You can use any spinner GIF or CSS animation here */}
                    <p>Registering user...</p>
                </div>
            ) : (
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input type="text" id="username" value={user} readOnly />
                    </div>
                    <div className="form-group">
                        <label htmlFor="name">Name</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            readOnly
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            readOnly
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="site">Site</label>
                        <select
                            className="form-select"
                            id="site"
                            value={selectedSite}
                            onChange={(e) => {
                                setSelectedSite(e.target.value);
                                setSiteError(false);
                            }}
                            required
                        >
                            <option value="">Select a site</option>
                            {sites.map((site) => (
                                <option key={site.id} value={site.siteName}>
                                    {site.siteName}
                                </option>
                            ))}
                        </select>
                        {siteError && <span className="error-message">Please select a site.</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="function">Function</label>
                        <select
                            className="form-select"
                            id="function"
                            value={selectedFunction}
                            onChange={(e) => {
                                setSelectedFunction(e.target.value);
                                setFunctionError(false);
                            }}
                            required
                        >
                            <option value="">Select a function</option>
                            {functions.map((func) => (
                                <option key={func.id} value={func.functionName}>
                                    {func.functionName}
                                </option>
                            ))}
                        </select>
                        {functionError && <span className="error-message">Please select a function.</span>}
                    </div>

                    <button type="submit" disabled={loading}>Register</button>
                </form>
            )}
        </div>
    );
};

export default UserRegistration;
