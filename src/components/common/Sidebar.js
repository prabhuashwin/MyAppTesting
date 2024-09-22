import React, { useState } from 'react';
import './Sidebar.css';
import logo from '../../assets/images/logo.jpg';
import { Link, useLocation } from 'react-router-dom';
import {
    FaChevronLeft, FaChevronRight, FaHome, FaBell, FaList, FaComments, FaPhone,
    FaQuestionCircle, FaDatabase, FaCogs, FaProjectDiagram, FaRandom
} from 'react-icons/fa';
import Tooltip from '@mui/material/Tooltip'; // Using Material-UI for tooltips

const Sidebar = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isQualityNotificationOpen, setIsQualityNotificationOpen] = useState(false);
    const [isLOVOpen, setIsLOVOpen] = useState(false);
    const [isComponentsOpen, setIsComponentsOpen] = useState(false);
    const [isProgramsOpen, setIsProgramsOpen] = useState(false);
    const location = useLocation();
    const currentPath = location.pathname;

    // Retrieve the registration status from localStorage
    const isRegistered = localStorage.getItem('isUserRegistered') === 'true';

    function toggleSidebar() {
        setIsCollapsed(!isCollapsed);
    }

    const toggleQualityNotification = () => {
        setIsQualityNotificationOpen(!isQualityNotificationOpen);
    };

    const toggleLOV = () => {
        setIsLOVOpen(!isLOVOpen);
    };

    const toggleComponents = () => {
        setIsComponentsOpen(!isComponentsOpen);
    };

    const togglePrograms = () => {
        setIsProgramsOpen(!isProgramsOpen);
    };

    return (
        <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
            <div className="sidebar-logo">
                <img src={logo} alt="Collins Aerospace" className="logo" />
                <button className="toggle-button" onClick={toggleSidebar}>
                    {isCollapsed ? <FaChevronRight /> : <FaChevronLeft />}
                </button>
            </div>
            <nav className="sidebar-nav">
                <ul>
                    <li className={currentPath === '/' ? 'active' : ''}>
                        <Tooltip title="Home" placement="right" disableHoverListener={!isCollapsed}>
                            <Link to="/">
                                <FaHome className="icon" />
                                <span className="nav-text">Home</span>
                            </Link>
                        </Tooltip>
                    </li>

                    {/* Conditionally render Quality Notification section based on registration status */}
                    {isRegistered && (
                        <li className={currentPath.startsWith('/qndata') ? 'active' : ''}>
                            <a href="#" onClick={toggleQualityNotification}>
                                <FaBell className="icon" />
                                <span className="nav-text">Quality Notification</span>
                                <span className={`arrow ${isQualityNotificationOpen ? 'open' : ''}`}></span>
                            </a>
                            {isQualityNotificationOpen && !isCollapsed && (
                                <ul className="nested">
                                    <li className={currentPath === '/qndata' ? 'active' : ''}>
                                        <Link to="/qndata">
                                            <FaDatabase className="icon nested-icon" />
                                            <span className="nav-text">QN Data</span>
                                        </Link>
                                    </li>
                                </ul>
                            )}
                        </li>
                    )}

                    {/* Conditionally render LOV section based on registration status */}
                    {isRegistered && (
                        <li className={currentPath.startsWith('/lov') ? 'active' : ''}>
                            <a href="#" onClick={toggleLOV}>
                                <FaList className="icon" />
                                <span className="nav-text">List Of Values (LOV)</span>
                                <span className={`arrow ${isLOVOpen ? 'open' : ''}`}></span>
                            </a>
                            {isLOVOpen && !isCollapsed && (
                                <ul className="nested">
                                    <li className={currentPath === '/components' ? 'active' : ''}>
                                        <Link to="/component">
                                            <FaCogs className="icon nested-icon" />
                                            <span className="nav-text">Components</span>
                                        </Link>
                                    </li>
                                    <li className={currentPath === '/programs' ? 'active' : ''}>
                                        <Link to="/program">
                                            <FaProjectDiagram className="icon nested-icon" />
                                            <span className="nav-text">Programs</span>
                                        </Link>
                                    </li>
                                    <li className={currentPath === '/plantdata' ? 'active' : ''}>
                                        <Link to="/plantdata">
                                            <FaRandom className="icon" />
                                            <span className="nav-text">Plant Details</span>
                                        </Link>
                                    </li>
                                    <li className={currentPath === '/analyst' ? 'active' : ''}>
                                        <Link to="/analyst">
                                            <FaBell className="icon" />
                                            <span className="nav-text">Delegate Analyst</span>
                                        </Link>
                                    </li>
                                    <li className={currentPath === '/review' ? 'active' : ''}>
                                        <Link to="/review">
                                            <FaList className="icon" />
                                            <span className="nav-text">Delegate Reviewer</span>
                                        </Link>
                                    </li>
                                </ul>
                            )}
                        </li>
                    )}
                </ul>
                <div className="sidebar-section">OTHER</div>
                <ul>
                    <li className={currentPath === '/feedback' ? 'active' : ''}>
                        <Tooltip title="Feedback" placement="right" disableHoverListener={!isCollapsed}>
                            <a href="#">
                                <FaComments className="icon" />
                                <span className="nav-text">Feedback</span>
                            </a>
                        </Tooltip>
                    </li>
                    <li className={currentPath === '/contact' ? 'active' : ''}>
                        <Tooltip title="Contact Us" placement="right" disableHoverListener={!isCollapsed}>
                            <a href="#">
                                <FaPhone className="icon" />
                                <span className="nav-text">Contact Us</span>
                            </a>
                        </Tooltip>
                    </li>
                    <li className={currentPath === '/help' ? 'active' : ''}>
                        <Tooltip title="Help" placement="right" disableHoverListener={!isCollapsed}>
                            <a href="#">
                                <FaQuestionCircle className="icon" />
                                <span className="nav-text">Help</span>
                            </a>
                        </Tooltip>
                    </li>
                </ul>
            </nav>
        </aside>
    );
};

export default Sidebar;
