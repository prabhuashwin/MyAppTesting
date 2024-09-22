import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { updateAnalyst } from '../../services/api';
import './AnalystDialog.css';

const AnalystDialog = ({ analyst, onClose, onSave }) => {
  const [editedAnalyst, setEditedAnalyst] = useState(analyst);
  const [analysts, setAnalysts] = useState([]);

  console.log('editedAnalyst', editedAnalyst);
  console.log('analysts', analysts);

  useEffect(() => {
    setEditedAnalyst(analyst);
  }, [analyst]);

  useEffect(() => {
    const fetchAnalysts = async () => {
      try {
        const response = await api.get('/User/GetAllUsers');
        setAnalysts(response.data);
      } catch (error) {
        console.error('Error fetching analysts:', error);
      }
    };

    fetchAnalysts();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedAnalyst({ ...editedAnalyst, [name]: value === 'true' ? true : value === 'false' ? false : value });
  };


  const handleAnalyst2Change = (e) => {
    const { value } = e.target;
    setEditedAnalyst({ ...editedAnalyst, userId: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      const response = await updateAnalyst(editedAnalyst.sapqnNumber, editedAnalyst.userId);

      alert('Data saved successfully');
      onClose(); // Close the modal after successful save
    window.location.reload();
    } catch (error) {
      console.error('Error saving data:', error);
      alert('Error saving data: ' + error.message);
    }
  };

  return (
    <div className="dialog-backdrop">
      <div className="dialog">
        <h2>Edit Delegate Analyst</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>QN Number</label>
            <input
              type="text"
              name="sapqnNumber"
              value={editedAnalyst.sapqnNumber}
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
              value={editedAnalyst.sapPartNumber}
              onChange={handleChange}
              readOnly
              style={{ backgroundColor: '#f0f0f0' }}
            />
          </div>
          <div className="form-group">
            <label>Responsible Analyst 1</label>
            <input
              type="text"
              name="analyst1Name"
              value={editedAnalyst.analyst1Name}
              onChange={handleChange}
              readOnly
              style={{ backgroundColor: '#f0f0f0' }}
            />
          </div>
          <div className="form-group">
            <label>Responsible Analyst 2</label>
            <select
              name="analyst2Name"
              value={editedAnalyst.userId || ''}
              onChange={handleAnalyst2Change}
            >
              <option value="">Select Analyst 2</option>
              {analysts.map((analyst) => (
                <option key={analyst.id} value={analyst.id}>
                  {analyst.userName}
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

export default AnalystDialog;
