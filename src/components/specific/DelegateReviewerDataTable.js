import React, { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import api from '../../services/api'; 
import ReviewerDialog from './ReviewerDialog'; 
import './DelegateReviewerDataTable.css';

const DelegateReviewerDataTable = () => {
  const [reviewerData, setReviewerData] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedReviewer, setSelectedReviewer] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/QnTracker');
        console.log('API Response:', response.data);
        setReviewerData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleClickOpen = (reviewer) => {
    setSelectedReviewer(reviewer);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedReviewer(null);
  };

  const handleSave = (updatedReviewer) => {
    const updatedData = reviewerData.map((reviewer) =>
      reviewer.qnNumber === updatedReviewer.qnNumber ? updatedReviewer : reviewer
    );
    setReviewerData(updatedData);
    handleClose();
  };

  const columns = [
    { headerName: 'QN Number', field: 'sapqnNumber', flex: 1, headerClass: 'header-cell', cellClass: 'cell' },
    { headerName: 'Part Number', field: 'sapPartNumber', flex: 1, headerClass: 'header-cell', cellClass: 'cell' },
    { headerName: 'Exisitng Reviewer', field: 'reviewerName', flex: 1, headerClass: 'header-cell', cellClass: 'cell' },
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
          rowData={reviewerData}
          defaultColDef={defaultColDef}
          pagination
          paginationPageSize={10}
        />
      </div>
      {open && (
        <ReviewerDialog
          reviewer={selectedReviewer}
          onClose={handleClose}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default DelegateReviewerDataTable;
