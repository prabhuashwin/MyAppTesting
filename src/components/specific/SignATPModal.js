import React, { useState } from 'react';
import Modal from 'react-modal';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';
import { saveATPDate } from '../../services/api';
import './SignATPModal.css';

const SignATPModal = ({ isOpen, onRequestClose, onSave, sapQnNumber }) => {    
    const [selectedDate, setSelectedDate] = useState(null);
    const [loading, setLoading] = useState(false);

    // Define handleDateChange function
    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    const handleSave = async () => {
        if (selectedDate) {
            setLoading(true);
            try {
                const formattedDate = moment(selectedDate).format('YYYY-MM-DD');
                const response = await saveATPDate(sapQnNumber, formattedDate);
                if (response) {
                    onSave(formattedDate);
                    alert('ATP date saved successfully');
                    onRequestClose(); // Close the modal after successful save
                    window.location.reload();
                } else {
                    alert('Failed to save ATP date');
                }
            } catch (error) {
                console.error('Error saving ATP date:', error);
                alert('An error occurred while saving the ATP date');
            } finally {
                setLoading(false);
            }
        } else {
            alert('Please select a date');
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel="Sign ATP"
            className="custom-modal"
            overlayClassName="custom-overlay"
        >
            <h2>Sign ATP</h2>
            <div className="form-group">
                <label>Select ATP Date:</label>
                <DatePicker
                    selected={selectedDate}
                    onChange={handleDateChange}
                    minDate={new Date()}
                    dateFormat="yyyy-MM-dd"
                    className="form-control"
                />
            </div>
            <div className="modal-footer">
                <button className="btn btn-secondary" onClick={onRequestClose} disabled={loading}>
                    Cancel
                </button>
                <button className="btn btn-primary" onClick={handleSave} disabled={loading}>
                    {loading ? 'Saving...' : 'Save'}
                </button>
            </div>
        </Modal>
    );
};

export default SignATPModal;
