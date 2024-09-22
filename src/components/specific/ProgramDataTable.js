import React, { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import api from '../../services/api'; 
import ProgramDialog from './ProgramDialog'; 
import './ProgramDataTable.css';

const ProgramDataTable = () => {
  const [programData, setProgramData] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/QnProgram/GetAllPrograms');
        setProgramData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleClickOpen = (program) => {
    setSelectedProgram(program);
    setIsEditMode(true);  
    setOpen(true);
  };

  const handleAddNewProgramOpen = () => {
    setSelectedProgram({ id: '', programName: '', isActive: true }); 
    setIsEditMode(false);  
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedProgram(null);
  };

  const handleSave = async (program) => {
    try {
      if (isEditMode) {
        const response = await api.post('/QnProgram/updateProgramStatus', program);
        if (response.status === 200) {
          const updatedData = programData.map((p) =>
            p.id === program.id ? program : p
          );
          setProgramData(updatedData);
        } else {
          console.error('Failed to update program');
        }
      } else {
        const response = await api.post('/QnProgram/AddProgram', program);  
        if (response.status === 200) {
          const newProgram = response.data;  
          setProgramData([...programData, newProgram]);
        } else {
          console.error('Failed to add new program');
        }
      }
    } catch (error) {
      console.error('Error saving data:', error);
    } finally {
      handleClose();
    }
  };

  const statusCellRenderer = (params) => {
    return params.value ? 'Active' : 'Inactive';
  };

  const columns = [
    { headerName: 'ID', field: 'id', flex: 1, filter: true, headerClass: 'header-cell', cellClass: 'cell' },
    { headerName: 'Program Name', field: 'programName', flex: 1, filter: true, headerClass: 'header-cell', cellClass: 'cell' },
    {
      headerName: 'Status',
      field: 'isActive',
      flex: 1,
      filter: true,
      headerClass: 'header-cell',
      cellClass: 'cell',
      cellRenderer: statusCellRenderer,
    },
    {
      headerName: 'Action',
      field: 'action',
      flex: 1,
      headerClass: 'header-cell',
      cellClass: 'cell',
      cellRendererFramework: (params) => (
        <button onClick={() => handleClickOpen(params.data)} className="edit-button">
          Edit
        </button>
      ),
    },
  ];

  const defaultColDef = {
    sortable: true,
    filter: true,
    resizable: true,
    floatingFilter: true,
  };

  return (
    <div className="container">
      <div className="grid-container ag-theme-alpine" style={{ width: '100%', backgroundColor: 'transparent', fontFamily: 'Roboto' }}>
        <AgGridReact
          columnDefs={columns}
          rowData={programData}
          defaultColDef={defaultColDef}
          pagination
          paginationPageSize={10}
        />
      </div>
      <div className="add-button-container">
        <button className="add-button" onClick={handleAddNewProgramOpen}>
          ADD NEW PROGRAM
        </button>
      </div>
      {open && (
        <ProgramDialog
          program={selectedProgram}
          onClose={handleClose}
          onSave={handleSave}
          isEditMode={isEditMode}
        />
      )}
    </div>
  );
};

export default ProgramDataTable;
