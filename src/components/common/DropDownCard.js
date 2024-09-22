import React from 'react';
import './DropDownCard.css';

const DropDownCard = ({ data, setOpen }) => {
    return (
        <div className="dropdown-card">
            <div className="dropdown-header">
                <span className="block text-sm">{data.userName}</span>
                {/* { <span className="block truncate text-sm font-medium">{data.userEmail}</span> } */}
            </div>
            <div className="dropdown-body">
                <div className="dropdown-header">Roles</div>
                {data.roles.map((role, index) => (
                    <div key={index} className="dropdown-item">{role}</div>
                ))}
                {/* {<div className="dropdown-item logout" onClick={() => setOpen(false)}>
                    Logout
                </div> } */}
            </div>
        </div>
    );
};

export default DropDownCard;