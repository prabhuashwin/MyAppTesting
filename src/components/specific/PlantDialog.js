import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import './PlantDialog.css';

const PlantDialog = ({ plant, onClose, onSave }) => {
  const [editedPlant, setEditedPlant] = useState(plant);

  useEffect(() => {
    setEditedPlant(plant);
  }, [plant]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedPlant({ ...editedPlant, [name]: value === 'true' ? true : value === 'false' ? false : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSave = {
        id: editedPlant.id,
        isActive: editedPlant.isActive
      };
      console.log('Data to save:', dataToSave);

            const response = await api.post('/PlantData/updatestatus', dataToSave);
            console.log('API response:', response);
            alert('Data saved successfully');
            window.location.reload();
        } catch (error) {
            console.error('Error saving data:', error);
            alert('Error saving data: ' + error.message);
        }
  };

  return (
    <div className="dialog-backdrop">
      <div className="dialog">
        <h2>Edit Plant</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>ID</label>
            <input
              type="text"
              name="id"
              value={editedPlant.id}
              onChange={handleChange}
              readOnly
            />
          </div>
          <div className="form-group">
            <label>Plant Code</label>
            <input
              type="text"
              name="plantCode"
              value={editedPlant.plantCode}
              onChange={handleChange}
              readOnly
            />
          </div>
          <div className="form-group">
            <label>Plant Name</label>
            <input
              type="text"
              name="plantName"
              value={editedPlant.plantName}
              onChange={handleChange}
              readOnly
            />
          </div>
          <div className="form-group">
            <label>Site Name</label>
            <input
              type="text"
              name="siteName"
              value={editedPlant.siteName}
              onChange={handleChange}
              readOnly
            />
          </div>
          <div className="form-group">
            <label>Status</label>
            <select
              name="isActive"
              value={editedPlant.isActive}
              onChange={handleChange}
            >
              <option value={true}>Active</option>
              <option value={false}>Inactive</option>
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

export default PlantDialog;