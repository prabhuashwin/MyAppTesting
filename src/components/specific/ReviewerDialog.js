import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { updateReviewer } from '../../services/api';
import './ReviewerDialog.css';

const ReviewerDialog = ({ reviewer, onClose, onSave }) => {
  const [editedReviewer, setEditedReviewer] = useState(reviewer);
  const [reviewers, setReviewers] = useState([]);

  console.log('editedReviewer', editedReviewer);
  console.log('reviewers', reviewers);

  useEffect(() => {
    setEditedReviewer(reviewer);
  }, [reviewer]);

  useEffect(() => {
    const fetchReviewers = async () => {
      try {
        const response = await api.get('/User/GetAllUsers');
        setReviewers(response.data);
      } catch (error) {
        console.error('Error fetching reviewers:', error);
      }
    };

    fetchReviewers(); 
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedReviewer({ ...editedReviewer, [name]: value === 'true' ? true : value === 'false' ? false : value });
  };


  const handleReviewer2Change = (e) => {
    const { value } = e.target;
    setEditedReviewer({ ...editedReviewer, userId: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      const response = await updateReviewer(editedReviewer.sapqnNumber, editedReviewer.userId);

      alert('Data saved successfully');
      onClose(); 
    window.location.reload();
    } catch (error) {
      console.error('Error saving data:', error);
      alert('Error saving data: ' + error.message);
    }
  };

  return (
    <div className="dialog-backdrop">
      <div className="dialog">
        <h2>Edit Delegate Reviewer</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>QN Number</label>
            <input
              type="text"
              name="sapqnNumber"
              value={editedReviewer.sapqnNumber}
              onChange={handleChange}
              readOnly
              style={{ backgroundColor: '#f0f0f0' }}
            />
          </div>
          <div className="form-group">
            <label>Part Number</label>
            <input
              type="text"
              name="sapPartNumber"
              value={editedReviewer.sapPartNumber}
              onChange={handleChange}
              readOnly
              style={{ backgroundColor: '#f0f0f0' }}
            />
          </div>
          <div className="form-group">
            <label>Delegate Reviewer</label>
            <select
              name="reviewername"
              value={editedReviewer.userId || ''}
              onChange={handleReviewer2Change}
            >
              <option value="">Select Delegate Reviewer</option>
              {reviewers.map((reviewer) => (
                <option key={reviewer.id} value={reviewer.id}>
                  {reviewer.userName}
                </option>
              ))}
            </select>
          </div>
          
          <div className="dialog-actions">
            <button type="button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default ReviewerDialog;
