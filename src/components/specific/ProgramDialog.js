import React, { useState, useEffect } from 'react';
import './ProgramDialog.css';

const ProgramDialog = ({ program, onClose, onSave, isEditMode }) => {
  const [editedProgram, setEditedProgram] = useState(program);

  useEffect(() => {
    setEditedProgram(program);
  }, [program]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedProgram({ ...editedProgram, [name]: value === 'true' ? true : value === 'false' ? false : value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(editedProgram);  // Call the onSave function passed from the parent component
  };

  return (
    <div className="dialog-backdrop">
      <div className="dialog">
        <h2>{isEditMode ? 'Edit Program' : 'Add New Program'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>ID</label>
            <input
              type="text"
              name="id"
              value={editedProgram.id}
              onChange={handleChange}
              readOnly={isEditMode}
              style={{ backgroundColor: '#f0f0f0' }}  // ID is only editable when adding a new program
            />
          </div>
          <div className="form-group">
            <label>Program Name</label>
            <input
              type="text"
              name="programName"
              value={editedProgram.programName}
              onChange={handleChange}
              readOnly={isEditMode}
              style={{ backgroundColor: '#f0f0f0' }}
              required
            />
          </div>
          <div className="form-group">
            <label>Status</label>
            <select
              name="isActive"
              value={editedProgram.isActive}
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
            <button type="submit">
              {isEditMode ? 'Save' : 'Add Program'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProgramDialog;
