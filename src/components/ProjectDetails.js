import React,{ useState, useContext,useEffect } from 'react';
import './styles/ProjectDetails.css';
import { Link } from 'react-router-dom';
import VariableContext from '../contexts/VariableContext';

const ProjectDetails = ({ project }) => {
    const {banners, weights, setProjectId,savedWeightings, setVariables,setSelectedClient, setSelectedProject, selectedProject,selectedClient } = useContext(VariableContext);    
    
    if (!project) {
        return <div className="project-details">Please select a project to view its details.</div>;
    }


    const { client, project: proj, filename, uploaded_time, qgroup_json,banner_data,weighting } = project;
    const numberOfQuestions = Object.keys(qgroup_json).length;
    
  
    
    return (
        
        <div className="project-details">
        
            <h2>Project Details</h2>
            <div className="details-container">
                <div className="detail-item">
                    <span className="detail-title">Client Name:</span>
                    <span className="detail-value">{client.name}</span>
                </div>
                <div className="detail-item">
                    <span className="detail-title">Project Name:</span>
                    <span className="detail-value">{proj.name}</span>
                </div>
                <div className="detail-item">
                    <span className="detail-title">File Name:</span>
                    <span className="detail-value">{filename}</span>
                </div>
                <div className="detail-item">
                    <span className="detail-title">Upload Time:</span>
                    <span className="detail-value">{new Date(uploaded_time).toLocaleString()}</span>
                </div>
                <div className="detail-item">
                    <span className="detail-title">Number of Questions:</span>
                    <span className="detail-value">{numberOfQuestions}</span>
                </div>
                <div className="detail-item">
                    <span className="detail-title">Weighting:</span>
                    <span className="detail-value">{savedWeightings? 'yes': 'NA'}</span>
                </div>
                <div className="detail-item">
                    <span className="detail-title">Banner:</span>
                    <span className="detail-value">{banners? banners.length: 'NA'}</span>
                </div>
            </div>
            <div className="project-links">
                <Link to="/datatables" className="project-link">Data Tables</Link>
                <Link to="/weighting" className="project-link">Weighting</Link>
                <Link to="/banner" className="project-link">Banner</Link>
                <Link to="/dataanalysis" className="project-link">Data Analysis</Link>
                <Link to="/dashboard" className="project-link">Dashboard</Link>
            </div>
        </div>
    );
};

export default ProjectDetails;
