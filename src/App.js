import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import Sidebar from './components/common/Sidebar';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import UserRegistration from './components/specific/UserRegistration';
import AuthProvider from './context/AuthProvider';
import UserProfile from './components/specific/UserProfile';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import QNDataGrid from './components/specific/QNDataGrid';
import PlantDataTable from './components/specific/PlantDataTable';
import ProgramDataTable from './components/specific/ProgramDataTable';
import ComponentDataTable from './components/specific/ComponentDataTable';
import PlantDialog from './components/specific/PlantDialog';
import ComponentDialog from './components/specific/ComponentDialog';
import ProgramDialog from './components/specific/ProgramDialog';
import AnalystDialog from './components/specific/AnalystDialog';
import ReviewerDialog from './components/specific/ReviewerDialog';
import DelegateAnalystDataTable from './components/specific/DelegateAnalystDataTable';
import DelegateReviewerDataTable from './components/specific/DelegateReviewerDataTable';
import './App.css';

function App() {
    return (
        <Router>
            <AuthProvider>
                <div className="App">
                    <Header />
                    <div className="main-content">
                        <Sidebar />
                        <main className="content">
                            <Layout>
                                <Routes>
                                <Route path="/" element={<HomePage />} />
                                    <Route path="/about" element={<AboutPage />} />
                                    <Route path="/contact" element={<ContactPage />} />
                                    <Route path="/qndata" element={<QNDataGrid />} />
                                    <Route path="/register" element={<UserRegistration />} />
                                    <Route path="/user-profile" element={<UserProfile />} />
                                    <Route path="/plantdata" element={<PlantDataTable />} />
                                    <Route path="/program" element={<ProgramDataTable />} />
                                    <Route path="/component" element={<ComponentDataTable />} />
                                    <Route path="/plantdig" element={<PlantDialog />} />
                                    <Route path="/compdig" element={<ComponentDialog />} />
                                    <Route path="/progdig" element={<ProgramDialog />} />
                                    <Route path="/analyst" element={<DelegateAnalystDataTable />} />
                                    <Route path="/review" element={<DelegateReviewerDataTable />} />
                                    <Route path="/analystdig" element={<AnalystDialog />} />
                                    <Route path="/reviewerdig" element={<ReviewerDialog />} />
                                </Routes>
                            </Layout>
                        </main>
                    </div>
                    <Footer />
                </div>
            </AuthProvider>
        </Router>
    );
}

export default App;
