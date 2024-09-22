import React, { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import api from '../../services/api'; 
import AnalystDialog from './AnalystDialog'; 
import './DelegateAnalystDataTable.css';

const DelegateAnalystDataTable = () => {
  const [analystData, setAnalystData] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedAnalyst, setSelectedAnalyst] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/QnTracker');
        console.log('API Response:', response.data);
        setAnalystData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleClickOpen = (analyst) => {
    setSelectedAnalyst(analyst);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedAnalyst(null);
  };

  const handleSave = (updatedAnalyst) => {
    const updatedData = analystData.map((analyst) =>
      analyst.qnNumber === updatedAnalyst.qnNumber ? updatedAnalyst : analyst
    );
    setAnalystData(updatedData);
    handleClose();
  };

  const columns = [
    { headerName: 'QN Number', field: 'sapqnNumber', flex: 1, headerClass: 'header-cell', cellClass: 'cell' },
    { headerName: 'Part Number', field: 'sapPartNumber', flex: 1, headerClass: 'header-cell', cellClass: 'cell' },
    { headerName: 'Responsible Analyst 1', field: 'analyst1Name', flex: 1, headerClass: 'header-cell', cellClass: 'cell' },
    { headerName: 'Responsible Analyst 2', field: 'analyst2Name', flex: 1, headerClass: 'header-cell', cellClass: 'cell' },
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
      <div className="grid-container ag-theme-alpine">
        <AgGridReact
          columnDefs={columns}
          rowData={analystData}
          defaultColDef={defaultColDef}
          pagination
          paginationPageSize={10}
        />
      </div>
      {open && (
        <AnalystDialog
          analyst={selectedAnalyst}
          onClose={handleClose}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default DelegateAnalystDataTable;
