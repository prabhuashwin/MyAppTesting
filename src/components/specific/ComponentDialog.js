import React, { useState, useEffect } from 'react';
import './ComponentDialog.css'; // Link to your custom CSS

const ComponentDialog = ({ component, onClose, onSave, isEditMode }) => {
  const [updatedComponent, setUpdatedComponent] = useState({
    id: '',
    componentName: '',
    isActive: true
  });

  useEffect(() => {
    if (isEditMode) {
      setUpdatedComponent(component); // Pre-fill with component data for editing
    } else {
      setUpdatedComponent({
        id: '',
        componentName: '',
        isActive: true
      }); // Default empty values for adding a new component
    }
  }, [component, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedComponent({ ...updatedComponent, [name]: value });
  };

  const handleSaveClick = () => {
    onSave(updatedComponent);
  };

  return (
    <div className="dialog-overlay">
      <div className="dialog-container">
        <div className="dialog-title">{isEditMode ? 'Edit Component' : 'Add New Component'}</div>
        <div className="dialog-content">
          <div className="dialog-field">
            <label htmlFor="id">ID</label>
            <input
              id="id"
              name="id"
              type="text"
              value={updatedComponent.id}
              onChange={handleChange}
              disabled={isEditMode}
              style={{ backgroundColor: '#f0f0f0' }}
              className="dialog-input"
            />
          </div>
          <div className="dialog-field">
            <label htmlFor="componentName">Component Name</label>
            <input
              id="componentName"
              name="componentName"
              type="text"
              value={updatedComponent.componentName}
              onChange={handleChange}
              disabled={isEditMode}
              style={{ backgroundColor: '#f0f0f0' }}
              className="dialog-input"
            />
          </div>
          <div className="dialog-field">
            <label htmlFor="isActive">Status</label>
            <select
              id="isActive"
              name="isActive"
              value={updatedComponent.isActive ? 'true' : 'false'}
              onChange={(e) => setUpdatedComponent({ ...updatedComponent, isActive: e.target.value === 'true' })}
              className="dialog-select"
            >
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>
        </div>
        <div className="dialog-actions">
          <button onClick={onClose} className="dialog-button">Cancel</button>
          <button onClick={handleSaveClick} className="dialog-button save-button">
            {isEditMode ? 'Save Changes' : 'Add Component'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ComponentDialog;
