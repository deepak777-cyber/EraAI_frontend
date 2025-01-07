import React from 'react';
import { NavLink,useLocation } from 'react-router-dom';
import './styles/Navbar.css';
import { useAuth } from '../providers/AuthProvider';

function Navbar() {
    const { logout } = useAuth();
    const location = useLocation(); // Get the current location
// Define the routes where the navigation links should be hidden
const hideLinksOnPaths = ['/home', '/login'];

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <img src='https://excavateresearch.com/static/media/logo-small.89d00b404bbe8926034f.png' alt="Excavate Research" className="logo" />
                <div className="nav-links">
                {!hideLinksOnPaths.includes(location.pathname) && (<> <NavLink to="/datatables" className="nav-item">
                        <div className="icon"></div>
                        <span>Data Tables</span>
                    </NavLink>
                    <NavLink to="/weighting" className="nav-item">
                        <div className="icon"></div>
                        <span>Weighting</span>
                    </NavLink>
                    <NavLink to="/banner" className="nav-item">
                        <div className="icon"></div>
                        <span>Banner</span>
                    </NavLink>
                    <NavLink to="/dataanalysis" className="nav-item">
                        <div className="icon"></div>
                        <span>Data Analysis</span>
                    </NavLink>
                    <NavLink to="/dashboard" className="nav-item">
                        <div className="icon"></div>
                        <span>Dashboard</span>
                    </NavLink>
                    <NavLink to="/home" className="nav-item">
                        <div className="icon"></div>
                        <span>Home</span>
                    </NavLink></>)}
                </div>
                <div className="logout-container">
                    <button className="logout-button" onClick={logout}>Log Out</button>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
