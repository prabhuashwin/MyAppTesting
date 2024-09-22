import React, { useState, useEffect, useRef } from 'react';
import moment from 'moment';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-balham.css';
import { Tabs, Tab, Box, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import api from '../../services/api';
import ActionCellRenderer from './ActionCellRenderer';
import QNDetailsModal from './QNDetailsModal';
import SignATPModal from './SignATPModal';
import './QNDataGrid.css';
import { getUserId, fetchUser, fetchUserInfo } from '../../services/api'; // Import necessary API functions

const QNDataGrid = () => {
    const [rowData, setRowData] = useState([]);
    const [assignedRowData, setAssignedRowData] = useState([]);
    const [selectedQN, setSelectedQN] = useState(null);
    const [qnDetails, setQNDetails] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showATPModal, setShowATPModal] = useState(false);
    const gridApiRef = useRef(null);
    const [activeTab, setActiveTab] = useState(0);
    const [sites, setSites] = useState([]);
    const [selectedSite, setSelectedSite] = useState('');
    const [loading, setLoading] = useState(true); // Local loading state
    const [error, setError] = useState(null); // Error state
    const [userInfo, setUserInfo] = useState(null); // Store userInfo

    // Fetch user and userInfo on component mount
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userData = await fetchUser(); // Fetch the current user
                if (userData?.user) {
                    const username = userData.user.split('\\').pop(); // Extract username
                    const userInfoResponse = await fetchUserInfo(username); // Fetch userInfo
                    console.log('Userinfo QN Page', userInfoResponse);
    
                    // Extract defaultSiteId from userInfoResponse
                    const defaultSiteId = userInfoResponse?.userSites?.[0]?.siteId;
    
                    // Set the userInfo in state
                    setUserInfo(userInfoResponse);
    
                    // Use userInfo.id and defaultSiteId to fetch assigned QNs
                    fetchAssignedQNData(userInfoResponse.id, defaultSiteId);
    
                    // Fetch all QNs based on default site ID
                    fetchAllQNData(defaultSiteId);
    
                    // Fetch site data
                    fetchSites();
                } else {
                    setError('User not found');
                }
            } catch (err) {
                setError('Error fetching user information');
            } finally {
                setLoading(false); // Ensure loading stops after the fetch
            }
        };
    
        fetchUserData(); // Invoke fetch function
    }, []);
    

    // Fetch all QN data
    const fetchAllQNData = async (siteId) => {
        api.get(`/QnTracker/getAllQnBySiteId/${siteId}`)
            .then(response => {
                const formattedData = response.data.map(item => ({
                    ...item,
                    sapCreatedOn: item.sapCreatedOn ? moment(item.sapCreatedOn).format('YYYY-MM-DD HH:mm:ss') : '',
                    sapTaskedOn: item.sapTaskedOn ? moment(item.sapTaskedOn).format('YYYY-MM-DD HH:mm:ss') : '',
                    atpDate: item.atpDate ? moment(item.atpDate).format('YYYY-MM-DD') : ''
                }));
                setRowData(formattedData); // Set rowData for All QNs
            })
            .catch(error => console.error('Error fetching all QN data:', error));
    };

    // Fetch QNs assigned to the current user
    // Fetch QNs assigned to the current user
const fetchAssignedQNData = async (userId, defaultSiteId) => {
    try {
        const response = await api.get(`/QnTracker/assignedToMe/${userId}/${defaultSiteId}`);
        const formattedData = response.data.map(item => ({
            ...item,
            sapCreatedOn: item.sapCreatedOn ? moment(item.sapCreatedOn).format('YYYY-MM-DD HH:mm:ss') : '',
            sapTaskedOn: item.sapTaskedOn ? moment(item.sapTaskedOn).format('YYYY-MM-DD HH:mm:ss') : '',
            atpDate: item.atpDate ? moment(item.atpDate).format('YYYY-MM-DD') : ''
        }));
        setAssignedRowData(formattedData); // Set rowData for assigned QNs
    } catch (error) {
        console.error('Error fetching assigned QN data:', error);
    }
};


    // Fetch all sites
    const fetchSites = async () => {
        try {
            const sitesResponse = await api.get('/site/getallsites');
            setSites(sitesResponse.data || []);
        } catch (error) {
            console.error('Error fetching site data:', error);
        }
    };

    // Fetch QN details for editing
    const fetchQNDetails = async (qnNumber) => {
        try {
            const qnResponse = await api.get(`/QnTracker/${qnNumber}`);
            if (qnResponse.data.status) {
                const statusResponse = await api.get(`/QnStatusWorkflow/GetPostStatusDescriptionByPreStatus/${qnResponse.data.status}`);
                setQNDetails({ ...qnResponse.data, postStatuses: statusResponse.data });
            } else {
                setQNDetails(qnResponse.data);
            }
            setShowModal(true); // Show QN details modal
        } catch (error) {
            console.error('Error fetching QN details or post statuses:', error);
        }
    };

    const handleEdit = (qnNumber) => {
        setSelectedQN(qnNumber);
        fetchQNDetails(qnNumber);
    };

    const handleSignATP = (qnNumber) => {
        setSelectedQN(qnNumber);
        setShowATPModal(true);
    };

    const updateRowData = (qnNumber, updatedData) => {
        setRowData(prevRowData =>
            prevRowData.map(row => (row.sapqnNumber === qnNumber ? { ...row, ...updatedData } : row))
        );
        if (gridApiRef.current) {
            gridApiRef.current.refreshCells();
        }
    };

    // Define grid options
    const gridOptions = {
        components: {
            actionCellRenderer: ActionCellRenderer
        },
        defaultColDef: {
            filter: true,  // Enable filtering on all columns
            sortable: true // Enable sorting on all columns
        }
    };

    const columns = [
        { headerName: 'ID', field: 'id', pinned: 'left', width: 100, hide: true, filter: 'agTextColumnFilter' },
        { headerName: 'QN', field: 'sapqnNumber', pinned: 'left', width: 150, filter: 'agTextColumnFilter' },
        { headerName: 'Program', field: 'programName', width: 120, filter: 'agTextColumnFilter' },
        { headerName: 'Component', field: 'componentName', width: 120, filter: 'agTextColumnFilter' },
        { headerName: 'Plant Code', field: 'plantCode', width: 150, filter: 'agTextColumnFilter' },
        { headerName: 'Plant Name', field: 'plantName', width: 150, filter: 'agTextColumnFilter' },
        { headerName: 'Part No', field: 'sapPartNumber', width: 150, filter: 'agTextColumnFilter' },
        { headerName: 'Defect', field: 'sapDefectData', width: 250, filter: 'agTextColumnFilter' },
        { headerName: "Created On", field: "sapCreatedOn", cellFormatter: data => moment(data.value).format('L'), filter: 'agTextColumnFilter' },
        { headerName: 'Start Date', field: 'sapTaskedOn', width: 150, filter: 'agDateColumnFilter' },
        { headerName: 'Comments', field: 'comments', width: 120, filter: 'agTextColumnFilter' },
        { headerName: 'Responsible1', field: 'analyst1Name', width: 150, filter: 'agTextColumnFilter' },
        { headerName: 'Responsible2', field: 'analyst2Name', width: 150, filter: 'agTextColumnFilter' },
        { headerName: 'Status', field: 'description', width: 150, filter: 'agTextColumnFilter' },
        { headerName: 'Reviewer', field: 'reviewerName', width: 100, filter: 'agTextColumnFilter' },
        { headerName: 'ATP Date', field: 'atpDate', cellFormatter: data => moment(data.value).format('L'), filter: 'agTextColumnFilter' },
        {
            headerName: 'Actions',
            field: 'actions',
            cellRenderer: 'actionCellRenderer',
            cellRendererParams: {
                onEdit: handleEdit,
                onSignATP: handleSignATP,
                updateRowData: updateRowData,
                activeTab, // Pass activeTab as a parameter
            },
            width: 200,
            pinned: 'right',
            filter: false,
        },
    ];
    

    const onGridReady = (params) => {
        gridApiRef.current = params.api;
    };

    // Define the rest of your component code...
    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    
        // Use the selected site if it exists, otherwise fall back to defaultSiteId from userInfo
        const siteId = selectedSite || userInfo?.userSites?.[0]?.siteId; // Either selected site or default site ID
        const userId = userInfo?.id; // User ID
    
        // Call different API based on the selected tab
        if (newValue === 0) {
            // QN's Assigned to Me
            fetchAssignedQNData(userId, siteId);
        } else if (newValue === 1) {
            // All QN's
            fetchAllQNData(siteId);
        }
    };
    
    

    const handleSiteChange = (event) => {
        const selectedSiteId = event.target.value;
        setSelectedSite(selectedSiteId);
    
        const defaultSiteId = userInfo?.userSites?.[0]?.siteId; // Default site ID from userInfo
        const siteIdToUse = selectedSiteId || defaultSiteId; // Use the selected site or default site ID
        const userId = userInfo?.id; // User ID
    
        if (activeTab === 0) {
            // If the active tab is "QN's Assigned to Me", fetch assigned QNs for the selected site
            console.log(`Fetching QNs Assigned to Me for site ID: ${siteIdToUse}`);
            api.get(`/QnTracker/assignedToMe/${userId}/${siteIdToUse}`)
                .then(response => {
                    const formattedData = response.data.map(item => ({
                        ...item,
                        sapCreatedOn: item.sapCreatedOn ? moment(item.sapCreatedOn).format('YYYY-MM-DD HH:mm:ss') : '',
                        sapTaskedOn: item.sapTaskedOn ? moment(item.sapTaskedOn).format('YYYY-MM-DD HH:mm:ss') : '',
                        atpDate: item.atpDate ? moment(item.atpDate).format('YYYY-MM-DD') : ''
                    }));
                    setAssignedRowData(formattedData); // Update data for "Assigned to Me" tab
                })
                .catch(error => {
                    console.error('Error fetching QNs Assigned to Me:', error);
                });
        } else if (activeTab === 1) {
            // If the active tab is "All QN's", fetch all QNs for the selected site
            console.log(`Fetching All QNs for site ID: ${siteIdToUse}`);
            api.get(`/QnTracker/getAllQnBySiteId/${siteIdToUse}`)
                .then(response => {
                    const formattedData = response.data.map(item => ({
                        ...item,
                        sapCreatedOn: item.sapCreatedOn ? moment(item.sapCreatedOn).format('YYYY-MM-DD HH:mm:ss') : '',
                        sapTaskedOn: item.sapTaskedOn ? moment(item.sapTaskedOn).format('YYYY-MM-DD HH:mm:ss') : '',
                        atpDate: item.atpDate ? moment(item.atpDate).format('YYYY-MM-DD') : ''
                    }));
                    setRowData(formattedData); // Update data for "All QN's" tab
                })
                .catch(error => {
                    console.error('Error fetching All QNs:', error);
                });
        }
    };
    
    

    if (loading) {
        return <p>Loading...</p>; // Show a loading indicator while fetching data
    }

    if (error) {
        return <p>{error}</p>; // Display error message
    }

    return (
        <div>
            {/* Dropdown for site selection */}
            <FormControl variant="outlined" size="small" style={{ position: 'absolute', top: '131px', right: 20, width: '200px' }}>
                <InputLabel id="site-select-label">Select Site</InputLabel>
                <Select
                    labelId="site-select-label"
                    id="site-select"
                    value={selectedSite}
                    onChange={handleSiteChange}
                    label="Select Site"
                >
                    {/* Default MenuItem to reset the selection */}
                    <MenuItem value="">
                        <em>Select Site</em> {/* Italicized default option */}
                    </MenuItem>

                    {/* Map through the sites and render them as options */}
                    {sites.map((site) => (
                        <MenuItem key={site.id} value={site.id}>
                            {site.siteName}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>


            <Tabs value={activeTab} onChange={handleTabChange} centered>
                <Tab label="QN's Assigned to Me" />
                <Tab label="All QN's" />
            </Tabs>

            <Box mt={2}>
                {/* Grid for Assigned QNs */}
                {activeTab === 0 && (
                    <div className="ag-theme-balham" style={{ height: '100%', width: '100%' }}>
                        <AgGridReact
                            rowData={assignedRowData}
                            columnDefs={columns}
                            gridOptions={gridOptions}
                            onGridReady={onGridReady}
                            domLayout="autoHeight"
                            defaultColDef={{
                                flex: 1,
                                minWidth: 150,
                                resizable: true,
                                sortable: true,
                                filter: true,
                                floatingFilter: true,
                            }}
                        />
                    </div>
                )}

                {/* Grid for All QNs */}
                {activeTab === 1 && (
                    <div className="ag-theme-balham" style={{ height: '100%', width: '100%' }}>
                        <AgGridReact
                            rowData={rowData}
                            columnDefs={columns}
                            gridOptions={gridOptions}
                            onGridReady={onGridReady}
                            domLayout="autoHeight"
                            defaultColDef={{
                                flex: 1,
                                minWidth: 150,
                                resizable: true,
                                sortable: true,
                                filter: true,
                                floatingFilter: true,
                            }}
                        />
                    </div>
                )}
            </Box>

            {/* Render QNDetailsModal and SignATPModal based on the component state */}
            {qnDetails && (
                <QNDetailsModal
                    show={showModal}
                    onHide={() => setShowModal(false)}
                    qnDetails={qnDetails}
                />
            )}

            {selectedQN && (
                <SignATPModal
                    isOpen={showATPModal}
                    onRequestClose={() => setShowATPModal(false)}
                    qnNumber={selectedQN}
                    updateRowData={updateRowData}
                />
            )}
        </div>
    );
};

export default QNDataGrid;
