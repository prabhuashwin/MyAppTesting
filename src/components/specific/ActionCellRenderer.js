import React, { useContext, useState } from 'react';
import { FaEdit, FaFlag, FaSignature, FaUserPlus } from 'react-icons/fa';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Circles } from 'react-loader-spinner';
import moment from 'moment'; // Import moment for date formatting
import './ActionCellRenderer.css';
import api from '../../services/api'; // Ensure the path is correct
import { AuthContext } from '../../context/AuthProvider'; // Ensure the path is correct
import SignATPModal from './SignATPModal'; // Import the modal component

const ActionCellRenderer = (props) => {
    const { user } = useContext(AuthContext); // Retrieve the user from AuthContext
    const [loading, setLoading] = useState(false); // State for button loading
    const [isSignATPModalOpen, setIsSignATPModalOpen] = useState(false); // State for modal visibility
    const [currentSapQnNumber, setCurrentSapQnNumber] = useState(null); // State to store the sapQnNumber

    const getUserId = async (userId) => {
        try {
            const response = await api.get(`/user/getUserIdByUserId/${userId}`);
            return response.data.id;
        } catch (error) {
            console.error('Error fetching user ID:', error);
            return null;
        }
    };

    const handleAction = async (action) => {
        switch (action) {
            case 'edit':
                props.onEdit(props.data.sapqnNumber); // Pass QN Number to onEdit function
                break;
            case 'setPriority':
                console.log('Set Priority', props.data);
                break;
            case 'signATP':
                console.log('signATP called, sapQnNumber:', props.data.sapqnNumber);
                setCurrentSapQnNumber(props.data.sapqnNumber); // Ensure this is defined
                setIsSignATPModalOpen(true); // Open the modal
                break;
            case 'assignToMe':
                if (props.data.status !== 10) {
                    console.log('Assign to Myself is disabled');
                    return;
                }
                if (window.confirm('Are you sure you want to assign this QN to yourself?')) {
                    setLoading(true); // Set loading state to true
                    try {
                        const userId = await getUserId(user.split('\\').pop()); // Get user ID
                        if (userId) {
                            const response = await api.post('/QnTracker/AssignAnalyst', {
                                qnNumber: props.data.sapqnNumber,
                                userId: userId // Pass user ID to the API
                            });
                            console.log('API response:', response.data);
                            toast.success('QN assigned to yourself successfully!');
                            
                            // Update the specific row
                            const updatedData = { analyst1Name: response.data.analyst1Name, description: 'Work-in-Progress' }; // Adjust description based on your logic
                            props.updateRowData(props.data.sapqnNumber, updatedData);
                            window.location.reload();
                        } else {
                            console.error('User ID not found');
                            toast.error('User ID not found');
                        }
                    } catch (error) {
                        console.error('Error assigning to myself:', error);
                        toast.error('Error assigning to myself');
                    } finally {
                        setLoading(false); // Set loading state to false
                    }
                }
                break;
            default:
                break;
        }
    };

    const handleSaveSignATP = async (date) => {
        setLoading(true); // Set loading state to true
        try {
            const response = await api.post('/QnTracker/SignATP', {
                qnNumber: currentSapQnNumber,
                atpDate: moment(date).toISOString()
            });
            console.log('API response:', response.data);
            toast.success('ATP signed successfully!');
            
            // Update the specific row
            const updatedData = { atpDate: moment(date).format('YYYY-MM-DD') }; // Adjust based on your logic
            props.updateRowData(currentSapQnNumber, updatedData);
            setIsSignATPModalOpen(false); // Close the modal
             
             window.location.reload();

        } catch (error) {
            console.error('Error signing ATP:', error);
            toast.error('Error signing ATP');
        } finally {
            setLoading(false); // Set loading state to false
        }
    };

    // Conditionally render buttons based on activeTab
    const { activeTab } = props; 
    const isAssignedToMe = activeTab === 0; // activeTab === 0 corresponds to "QN's Assigned to Me"

    return (
        <div className="action-icons">
            {/* Show all actions only for "QN's Assigned to Me" */}
            {isAssignedToMe && <FaEdit className="action-icon" onClick={() => handleAction('edit')} title="Edit" />}
            {isAssignedToMe && <FaFlag className="action-icon" onClick={() => handleAction('setPriority')} title="Set Priority" />}
            <FaSignature className="action-icon" onClick={() => handleAction('signATP')} title="Sign ATP" />
            {loading ? (
                <Circles height={20} width={20} color="#4fa94d" ariaLabel="loading" />
            ) : (
                <FaUserPlus
                    className={`action-icon ${props.data.status !== 10 ? 'disabled' : ''}`}
                    onClick={() => handleAction('assignToMe')}
                    title="Assign to Myself"
                    disabled={props.data.status !== 10}
                />
            )}
            <SignATPModal
                isOpen={isSignATPModalOpen}
                onRequestClose={() => setIsSignATPModalOpen(false)}
                onSave={handleSaveSignATP}
                sapQnNumber={currentSapQnNumber} // Pass the sapQnNumber to the modal
            />
        </div>
    );
};

export default ActionCellRenderer;
