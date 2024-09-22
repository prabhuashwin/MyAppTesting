import React, { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import api from '../../services/api';
import PlantDialog from './PlantDialog'; 
import './PlantDataTable.css';

const PlantDataTable = () => {
  const [plantData, setPlantData] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedPlant, setSelectedPlant] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/PlantData/getallplantdata');
        console.log('API Response:', response.data);
        setPlantData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleClickOpen = (plant) => {
    setSelectedPlant(plant);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedPlant(null);
  };

  const handleSave = (updatedPlant) => {
    const updatedData = plantData.map((plant) =>
      plant.id === updatedPlant.id ? updatedPlant : plant
    );
    setPlantData(updatedData);
    handleClose();
  };

  const statusCellRenderer = (params) => {
    return params.value ? 'Active' : 'Inactive';
  };

  const columns = [
    { headerName: 'ID', field: 'id', flex: 1, headerClass: 'header-cell', cellClass: 'cell' },
    { headerName: 'Plant Code', field: 'plantCode', flex: 1, headerClass: 'header-cell', cellClass: 'cell' },
    { headerName: 'Plant Name', field: 'plantName', flex: 1, headerClass: 'header-cell', cellClass: 'cell' },
    { headerName: 'Site Name', field: 'siteName', flex: 1, headerClass: 'header-cell', cellClass: 'cell' },
    {
      headerName: 'Status',
      field: 'isActive',
      flex: 1,
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
  };

  return (
    <div className="container">
      <div className="grid-container ag-theme-alpine" style={{ width: '100%', backgroundColor: 'transparent', fontFamily: 'Roboto' }}>
        <AgGridReact
          columnDefs={columns}
          rowData={plantData}
          defaultColDef={defaultColDef}
          pagination
          paginationPageSize={10}
        />
      </div>
      {open && (
        <PlantDialog
          plant={selectedPlant}
          onClose={handleClose}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default PlantDataTable;
