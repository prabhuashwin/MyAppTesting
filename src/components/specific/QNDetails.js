import React from 'react';

const QNDetails = ({ qnDetails }) => {
    return (
        <div className="qn-details">
            <h2>QN Details</h2>
            <div>
                <label>QN Number:</label>
                <span>{qnDetails.qnNumber}</span>
            </div>
            <div>
                <label>Program:</label>
                <span>{qnDetails.programName}</span>
            </div>
            <div>
                <label>Component:</label>
                <span>{qnDetails.componentName}</span>
            </div>
            <div>
                <label>Plant Details:</label>
                <span>{qnDetails.plantName}</span>
            </div>
            <div>
                <label>Part Number:</label>
                <span>{qnDetails.partNo}</span>
            </div>
            <div>
                <label>Defect:</label>
                <span>{qnDetails.defect}</span>
            </div>
            <div>
                <label>Created On:</label>
                <span>{qnDetails.createdOn}</span>
            </div>
            <div>
                <label>Comments:</label>
                <span>{qnDetails.comments}</span>
            </div>
            <div>
                <label>Turnbacks:</label>
                <span>{qnDetails.turnbacks}</span>
            </div>
        </div>
    );
};

export default QNDetails;
