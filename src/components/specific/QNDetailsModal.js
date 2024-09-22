import React, { useState, useEffect, useContext } from 'react';
import Modal from 'react-modal';
import { Tabs, Tab } from 'react-bootstrap';
import moment from 'moment';
import api from '../../services/api';
import { AuthContext } from '../../context/AuthProvider'; // Ensure this path is correct
import './QNDetailsModal.css';

// Set the app element for accessibility
Modal.setAppElement('#root');

const QNDetailsModal = ({ show, onHide, qnDetails }) => {

    // Initializing states for metrics fields
    const [totalExecutionTime, setTotalExecutionTime] = useState(qnDetails.totalExecutionTime || 0);
    const [totalRWIPTime, setTotalRWIPTime] = useState(qnDetails.totalRWIPTime || 0);
    const [totalCheckerTime, setTotalCheckerTime] = useState(qnDetails.totalCheckerTime || 0);
    const [sapSignOffDate, setSapSignOffDate] = useState(qnDetails.sapSignOffDate || moment().toISOString());
    const [rawSAPDTP, setRawSAPDTP] = useState(qnDetails.rawSAPDTP || moment().toISOString());
    const [totalTime, setTotalTime] = useState(qnDetails.totalTime || 0);
    const [logDTP, setLogDTP] = useState(qnDetails.logDTP || moment().toISOString());

    const { user } = useContext(AuthContext); // Retrieve the user from AuthContext
    const [userInfo, setUserInfo] = useState(null); // State to hold user info
    const [roleId, setRoleId] = useState(null); // State to hold role ID

    // State and useEffect for Programs
    const [programs, setPrograms] = useState([]);
    const [selectedProgram, setSelectedProgram] = useState('');

    // State and useEffect for Components
    const [components, setComponents] = useState([]);
    const [selectedComponent, setSelectedComponent] = useState('');

    // State and useEffect for PlantData
    const [plantData, setPlantData] = useState([]);
    const [selectedPlantCode, setSelectedPlantCode] = useState('');
    const [selectedPlantName, setSelectedPlantName] = useState('');

    // State and useEffect for Reviewers
    const [reviewers, setReviewers] = useState([]);
    const [selectedReviewer, setSelectedReviewer] = useState('');

    // State and useEffect for Analysts
    const [analysts, setAnalysts] = useState([]); // Ensure analysts is initialized as an empty array
    const [selectedAnalyst, setSelectedAnalyst] = useState('');

    // State and useEffect for Statuses
    const [selectedPreStatus, setSelectedPreStatus] = useState('');
    const [postStatuses, setPostStatuses] = useState([]);

    // Fetch user info based on the username
    useEffect(() => {
        const fetchUserInfo = async () => {
            if (user) {
                const username = user.split('\\').pop();
                try {
                    const userInfoResponse = await api.get(`/user/getuserinfo/${username}`);
                    setUserInfo(userInfoResponse.data);

                    const roleIdResponse = await api.get(`/user/${userInfoResponse.data.userId}/role`);
                    setRoleId(roleIdResponse.data);
                } catch (error) {
                    console.error('Error fetching user info or role ID:', error);
                }
            }
        };

        fetchUserInfo();
    }, [user]);

    useEffect(() => {
        const fetchPrograms = async () => {
            try {
                const response = await api.get('/QnProgram/GetAllPrograms');
                setPrograms(response.data);
                if (qnDetails.programId) {
                    setSelectedProgram(qnDetails.programId);
                }
            } catch (error) {
                console.error('Error fetching programs:', error);
            }
        };

        fetchPrograms();
    }, [qnDetails.programId]);

    useEffect(() => {
        const fetchComponents = async () => {
            try {
                const response = await api.get('/QnComponent/GetAllComponents');
                setComponents(response.data);
                if (qnDetails.componentId) {
                    setSelectedComponent(qnDetails.componentId);
                }
            } catch (error) {
                console.error('Error fetching components:', error);
            }
        };

        fetchComponents();
    }, [qnDetails.componentId]);

    useEffect(() => {
        const fetchPlantData = async () => {
            try {
                const response = await api.get('/PlantData/getallplantdata');
                setPlantData(response.data);
                if (qnDetails.plantId) {
                    setSelectedPlantCode(qnDetails.plantId);
                    setSelectedPlantName(qnDetails.plantName);
                }
            } catch (error) {
                console.error('Error fetching plant data:', error);
            }
        };

        fetchPlantData();
    }, [qnDetails.plantId, qnDetails.plantName]);

    useEffect(() => {
        const fetchReviewers = async () => {
            try {
                const response = await api.get('/User/GetAllUsers');
                const filteredReviewers = response.data.filter(user => user.roles.includes('Reviewer'));
                setReviewers(filteredReviewers);
                const matchedReviewer = filteredReviewers.find(reviewer => reviewer.id === String(qnDetails.reviewer));

                if (matchedReviewer) {
                    console.log('Matched Reviewer:', matchedReviewer);
                    setSelectedReviewer(qnDetails.reviewer);
                } else {
                    console.log('No match found for reviewer:', qnDetails.reviewer);
                }

                // Ensure the reviewer from qnDetails matches the reviewers list
                if (qnDetails.reviewer && filteredReviewers.some(reviewer => reviewer.userId === qnDetails.reviewer)) {
                    setSelectedReviewer(qnDetails.reviewer);
                }
            } catch (error) {
                console.error('Error fetching reviewers:', error);
            }
        };

        fetchReviewers();
    }, [qnDetails.reviewer]);

    useEffect(() => {
        const fetchAnalysts = async () => {
            try {
                const response = await api.get('/User/GetAllUsers');
                const filteredAnalysts = response.data.filter(user => user.roles.includes('Analyst'));
                setAnalysts(filteredAnalysts);

                // Ensure the analyst2 is selected if present in qnDetails
                if (qnDetails.analyst2) {
                    setSelectedAnalyst(qnDetails.analyst2);
                }
            } catch (error) {
                console.error('Error fetching analysts:', error);
            }
        };

        fetchAnalysts();
    }, [qnDetails.analyst2]);

    // Set initial selectedPreStatus and postStatuses
    useEffect(() => {
        if (qnDetails.status) {
            setSelectedPreStatus(qnDetails.status);
        }
        if (qnDetails.postStatuses) {
            setPostStatuses(qnDetails.postStatuses);
        }
    }, [qnDetails.status, qnDetails.postStatuses]);

    const handleProgramChange = (e) => {
        setSelectedProgram(e.target.value);
    };

    const handleComponentChange = (e) => {
        setSelectedComponent(e.target.value);
    };

    const handlePlantCodeChange = (e) => {
        setSelectedPlantCode(e.target.value);
    };

    const handlePlantNameChange = (e) => {
        setSelectedPlantName(e.target.value);
    };

    const handleReviewerChange = (e) => {
        setSelectedReviewer(e.target.value);
    };

    const handleAnalystChange = (e) => {
        setSelectedAnalyst(e.target.value);
    };

    const handlePreStatusChange = (e) => {
        setSelectedPreStatus(e.target.value);
    };

    const handleSave = async () => {
        console.log('Save button clicked');

        const dataToSave = {
            sapqnNumber: qnDetails.sapqnNumber || 'N/A',
            plantId: selectedPlantCode || 0,
            plantName: selectedPlantName || 'N/A',
            programId: selectedProgram || 0,
            componentId: selectedComponent || 0,
            sapPartNumber: qnDetails.sapPartNumber || 'N/A',
            sapDefectData: qnDetails.sapDefectData || 'N/A',
            sapCreatedOn: qnDetails.sapCreatedOn ? moment(qnDetails.sapCreatedOn).toISOString() : moment().toISOString(),
            sapTaskedOn: qnDetails.sapTaskedOn ? moment(qnDetails.sapTaskedOn).toISOString() : moment().toISOString(),
            lastModifiedBy: userInfo?.userId?.toString() || '0',
            analyst1: qnDetails.analyst1?.toString() || '0',
            analyst2: selectedAnalyst?.toString() || '0',
            reviewer: selectedReviewer?.toString() || '0',
            status: selectedPreStatus || 0,
            description: qnDetails.description || 'N/A',
            startedOn: qnDetails.startedOn ? moment(qnDetails.startedOn).toISOString() : moment().toISOString(),
            atpDate: qnDetails.atpdate ? moment(qnDetails.atpdate).toISOString() : moment().toISOString(),
            turnBack: qnDetails.turnBack || 0,
            totalExecutionTime: totalExecutionTime || 0,
            totalRWIPTime: totalRWIPTime || 0,
            totalCheckerTime: totalCheckerTime || 0,
            sapSignOffDate: sapSignOffDate ? moment(sapSignOffDate).toISOString() : moment().toISOString(),
            rawSAPDTP: rawSAPDTP ? moment(rawSAPDTP).toISOString() : moment().toISOString(),
            totalTime: totalTime || 0,
            logDTP: logDTP ? moment(logDTP).toISOString() : moment().toISOString(),
            comments: qnDetails.comments || 'N/A',
            turnbacks: qnDetails.turnbacks || 'N/A'
        };

        console.log('Data to save:', dataToSave);

        try {
            const response = await api.post('/QnTracker/SaveTrackerData', dataToSave);
            console.log('API response:', response);
            alert('Data saved successfully');

            // Close the modal and refresh the page
            onHide();
            window.location.reload();
        } catch (error) {
            console.error('Error saving data:', error);
            alert('Error saving data: ' + error.message);
        }
    };

    // Format dates
    const formattedCreatedOn = qnDetails.sapCreatedOn ? moment(qnDetails.sapCreatedOn).format('YYYY-MM-DD HH:mm:ss') : '';
    const formattedTaskedOn = qnDetails.sapTaskedOn ? moment(qnDetails.sapTaskedOn).format('YYYY-MM-DD HH:mm:ss') : '';
    const formattedATPDate = qnDetails.atpdate ? moment(qnDetails.atpdate).format('YYYY-MM-DD HH:mm:ss') : '';

    // Filter analysts for Responsible 2 dropdown to exclude the selected Responsible 1
    const filteredAnalystsForResponsible2 = analysts.filter(analyst => userInfo && analyst.userId !== userInfo.userId);

    return (
        <Modal
            isOpen={show}
            onRequestClose={onHide}
            contentLabel="QN Details"
            className="custom-modal"
            overlayClassName="custom-overlay"
        >
            <h2>QN Details</h2>
            <Tabs defaultActiveKey="details" id="qn-details-tabs">
                <Tab eventKey="details" title="QN Details">
                    <div className="qn-details">
                        <div className="row">
                            <div className="form-group col">
                                <label>QN Number:</label>
                                <input type="text" value={qnDetails.sapqnNumber} readOnly />
                            </div>
                            <div className="form-group col">
                                <label>Program:</label>
                                <select
                                    value={selectedProgram}
                                    onChange={handleProgramChange}
                                    className="form-select"
                                    style={{ backgroundColor: 'white' }}
                                >
                                    <option value="">Select a program</option>
                                    {programs.map(program => (
                                        <option key={program.id} value={program.id}>
                                            {program.programName}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group col">
                                <label>Component:</label>
                                <select
                                    value={selectedComponent}
                                    onChange={handleComponentChange}
                                    className="form-select"
                                    style={{ backgroundColor: 'white' }}
                                >
                                    <option value="">Select a component</option>
                                    {components.map(component => (
                                        <option key={component.id} value={component.id}>
                                            {component.componentName}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="row">
                            <div className="form-group col">
                                <label>Plant Details:</label>
                                <div className="select-container">
                                    <select
                                        value={selectedPlantCode}
                                        onChange={handlePlantCodeChange}
                                        className="form-select"
                                        style={{ width: '50%' }}
                                    >
                                        <option value="">Select a Plant Code</option>
                                        {plantData.map(plant => (
                                            <option key={plant.id} value={plant.id}>
                                                {plant.plantCode}
                                            </option>
                                        ))}
                                    </select>
                                    <select
                                        value={selectedPlantName}
                                        onChange={handlePlantNameChange}
                                        className="form-select"
                                        style={{ width: '50%' }}>
                                        <option value="">Select a Plant Name</option>
                                        {plantData.map(plant => (
                                            <option key={plant.id} value={plant.plantName}>
                                                {plant.plantName}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="form-group col">
                                <label>Part Number:</label>
                                <input type="text" value={qnDetails.sapPartNumber} readOnly style={{ backgroundColor: 'white' }} />
                            </div>
                            <div className="form-group col">
                                <label>Defect:</label>
                                <input type="text" value={qnDetails.sapDefectData} readOnly />
                            </div>
                        </div>
                        <div className="row">
                            <div className="form-group col">
                                <label>Created On:</label>
                                <input type="text" value={formattedCreatedOn} readOnly />
                            </div>
                            <div className="form-group col">
                                <label>FID:</label>
                                <input type="text" value={formattedATPDate} readOnly />
                            </div>
                        </div>
                        <div className="row">
                            <div className="form-group col">
                                <label>Comments:</label>
                                <input type="text" value={qnDetails.comments} readOnly />
                            </div>
                            <div className="form-group col">
                                <label>Turnbacks:</label>
                                <input type="text" value={qnDetails.turnbacks} readOnly />
                            </div>
                        </div>
                    </div>
                </Tab>
                <Tab eventKey="assign" title="Assign Responsible">
                    <div className="qn-details">
                        <div className="row">
                            <div className="form-group col">
                                <label>Responsible 1:</label>
                                <input
                                    type="text"
                                    value={userInfo ? userInfo.userName : ''}
                                    readOnly
                                    className="form-control"
                                />
                            </div>
                            <div className="form-group col">
                                <label>Responsible 2:</label>
                                <select
                                    value={selectedAnalyst}  // Ensure the value is correct
                                    onChange={handleAnalystChange}
                                    className="form-select"
                                    style={{ backgroundColor: 'white' }}
                                >
                                    <option value="">Select a Responsible 2</option>
                                    {filteredAnalystsForResponsible2.map(analyst => (
                                        <option key={analyst.userId} value={analyst.userId}>
                                            {analyst.userName}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="row">
                            <div className="form-group col">
                                <label>Status:</label>
                                <select
                                    value={selectedPreStatus}
                                    onChange={handlePreStatusChange}
                                    className="form-select"
                                    style={{ backgroundColor: 'white' }}
                                >
                                    <option value="">Select a Status</option>
                                    {postStatuses.map(status => (
                                        <option key={status.statusId} value={status.statusId}>
                                            {status.description}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group col">
                                <label>Reviewer:</label>
                                <select
                                    value={selectedReviewer}
                                    onChange={handleReviewerChange}
                                    className="form-select"
                                    style={{ backgroundColor: 'white' }}>
                                    <option value="">Select a Reviewer</option>
                                    {reviewers.map(reviewer => (
                                        <option key={reviewer.userId} value={reviewer.userId}>
                                            {reviewer.userName}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group col">
                                <label>Complexity:</label>
                                <input type="text" value={qnDetails.complexity} readOnly />
                            </div>
                        </div>
                    </div>
                </Tab>
                <Tab eventKey="metrics" title="Effort and Metrics">
                    <div className="qn-details">
                        <div className="row">
                            <div className="form-group col">
                                <label>Total Execution Time:</label>
                                <input
                                    type="number"
                                    value={totalExecutionTime}
                                    onChange={(e) => setTotalExecutionTime(e.target.value)}
                                    style={{ backgroundColor: 'white' }}
                                />
                            </div>
                        </div>
                        <div className="row">
                            <div className="form-group col">
                                <label>Total RWIP Time:</label>
                                <input
                                    type="number"
                                    value={totalRWIPTime}
                                    onChange={(e) => setTotalRWIPTime(e.target.value)}
                                    style={{ backgroundColor: 'white' }}
                                />
                            </div>
                            <div className="form-group col">
                                <label>Total Checker Time:</label>
                                <input
                                    type="number"
                                    value={totalCheckerTime}
                                    onChange={(e) => setTotalCheckerTime(e.target.value)}
                                    style={{ backgroundColor: 'white' }}
                                />
                            </div>
                        </div>
                        <div className="row">
                            <div className="form-group col">
                                <label>SAP Sign Off Date:</label>
                                <input
                                    type="datetime-local"
                                    value={moment(sapSignOffDate).format('YYYY-MM-DDTHH:mm')}
                                    onChange={(e) => setSapSignOffDate(e.target.value)}
                                    style={{ backgroundColor: 'white' }}
                                />
                            </div>
                            <div className="form-group col">
                                <label>RAW SAP DTP:</label>
                                <input
                                    type="datetime-local"
                                    value={moment(rawSAPDTP).format('YYYY-MM-DDTHH:mm')}
                                    onChange={(e) => setRawSAPDTP(e.target.value)}
                                    style={{ backgroundColor: 'white' }}
                                />
                            </div>
                        </div>
                        <div className="row">
                            <div className="form-group col">
                                <label>Total Time:</label>
                                <input
                                    type="number"
                                    value={totalTime}
                                    onChange={(e) => setTotalTime(e.target.value)}
                                    style={{ backgroundColor: 'white' }}
                                />
                            </div>
                            <div className="form-group col">
                                <label>Log DTP:</label>
                                <input
                                    type="datetime-local"
                                    value={moment(logDTP).format('YYYY-MM-DDTHH:mm')}
                                    onChange={(e) => setLogDTP(e.target.value)}
                                    style={{ backgroundColor: 'white' }}
                                />
                            </div>
                        </div>
                    </div>
                </Tab>
            </Tabs>
            <div className="modal-footer">
                <button className="btn btn-primary" onClick={handleSave}>Save</button>
            </div>
        </Modal>
    );
};

export default QNDetailsModal;
