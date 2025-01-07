// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Navbar from './navBars/Navbar';
import Home from './components/Home';
import Login from './components/Login';
import { AuthProvider } from './providers/AuthProvider';
import { MsalProvider, useIsAuthenticated } from "@azure/msal-react"; // Import MsalProvider and useIsAuthenticated
import { msalInstance } from './configs/authConfig'; // Import your MSAL configuration
import VariableProvider from './providers/VariableProvider';
import DataTables from './components/DataTables';
import Weighting from './components/Weighting';
import Banner from './components/Banner';
import DataAnalysis from './components/DataAnalysis';
import Dashboard from './components/Dashboard';
import Sidebar from './navBars/Sidebar';
import FreqProvider from './providers/FreqProvider';
import SurveyElements from './components/SurveyElements';
import SurveyBuilder from './components/SurveyBuilder';
function App() {
    return (
        
          <AuthProvider>
        <Router>
            <AppContent />
        </Router>
        </AuthProvider>
        
    );
}


function AppContent() {
    const location = useLocation();
    const hideNavbarRoutes = ['/login','/']; // Add any other routes where the Navbar should be hidden

    return (
        <VariableProvider>
            <FreqProvider>
        <>
        

            {!hideNavbarRoutes.includes(location.pathname) && <Navbar />}
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/login" element={<Login />} />
                <Route path="/home" element={<Home />} />
                <Route path="/datatables" element={<WithSidebar component={DataTables} />} />
                        <Route path="/weighting" element={<WithSidebar component={Weighting} />} />
                        <Route path="/banner" element={<WithSidebar component={Banner} />} />
                        <Route path="/dataanalysis" element={<WithSidebar component={DataAnalysis} />} />
                        <Route path="/dashboard" element={<WithSidebar component={Dashboard} />} />
                        <Route path="/surveyelement" element={<SurveyElements />} />
                        <Route path="/surveybuilder" element={<WithSidebar component={SurveyBuilder} />} />
              
            </Routes>
        </></FreqProvider>
        </VariableProvider>
    );
}
function WithSidebar({ component: Component }) {
    return (
        <div className="page-with-sidebar">
            <Sidebar />
            <div className="main-content">
                <Component />
            </div>
        </div>
    );
}
export default App;
