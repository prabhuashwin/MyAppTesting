import React, { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import api from '../../services/api'; 
import ComponentDialog from './ComponentDialog'; 
import './ComponentDataTable.css';

const ComponentDataTable = () => {
  const [componentData, setComponentData] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/QnComponent/GetAllComponents');
        setComponentData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleClickOpen = (component) => {
    setSelectedComponent(component);
    setIsEditMode(true);  // Set to edit mode
    setOpen(true);
  };

  const handleAddNewComponentOpen = () => {
    setSelectedComponent({
      id: '',
      componentName: '',
      isActive: true
    }); // Empty object for new component
    setIsEditMode(false);  // Set to add mode
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedComponent(null);
  };

  const handleSave = async (updatedComponent) => {
    try {
      if (isEditMode) {
        // Call the API to update component status
        const response = await api.post('/QnComponent/updateComponentStatus', updatedComponent);
        if (response.status === 200) {
          // Update componentData with the edited component
          const updatedData = componentData.map((component) =>
            component.id === updatedComponent.id ? updatedComponent : component
          );
          setComponentData(updatedData);
        } else {
          console.error('Failed to update component');
        }
      } else {
        // Adding new component logic using a different POST API
        const response = await api.post('/QnComponent/AddComponent', updatedComponent);
        if (response.status === 200) {
          // Fetch the newly created component from the server, assuming the response contains the added component
          const newComponent = response.data;
          setComponentData([...componentData, newComponent]);  // Add new component to the state
        } else {
          console.error('Failed to add new component');
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
    { headerName: 'Component Name', field: 'componentName', flex: 1, filter: true, headerClass: 'header-cell', cellClass: 'cell' },
    {
      headerName: 'Status',
      field: 'isActive',
      flex: 1,
      filter: true,
      headerClass: 'header-cell',
      cellClass: 'cell',
      cellRenderer: statusCellRenderer
    },
    {
      headerName: 'Action',
      field: 'action',
      flex: 1,
      headerClass: 'header-cell',
      cellClass: 'cell',
      cellRendererFramework: (params) => (
        <button
          onClick={() => handleClickOpen(params.data)}
          className="edit-button"
        >
          Edit
        </button>
      ),
    },
  ];

  const defaultColDef = {
    sortable: true,
    filter: true,
    resizable: true,
    cellStyle: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    floatingFilter: true, // Ensure floating filters are enabled
  };

  return (
    <div className="container">
      <div className="grid-container ag-theme-alpine" style={{ width: '100%', backgroundColor: 'transparent', fontFamily: 'Roboto' }}>
        <AgGridReact
          columnDefs={columns}
          rowData={componentData}
          defaultColDef={defaultColDef}
          pagination
          paginationPageSize={10}
        />
      </div>
      <div className="add-button-container">
        <button
          className="add-button"
          onClick={handleAddNewComponentOpen}
        >
          ADD NEW COMPONENT
        </button>
      </div>
      {open && (
        <ComponentDialog
          component={selectedComponent}
          onClose={handleClose}
          onSave={handleSave}
          isEditMode={isEditMode}  
        />
      )}
    </div>
  );
};

export default ComponentDataTable;
