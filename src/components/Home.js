import React, { useState, useContext,useEffect } from 'react';
import './styles/Home.css';
import axios from 'axios';
import { useAuth } from '../providers/AuthProvider';
import VariableContext from '../contexts/VariableContext';
import config from '../configs/config';
import ProjectDetails from './ProjectDetails';
import Loader from './Loader';
import { useLocation,useNavigate  } from 'react-router-dom';

// Import the spinner
import ClipLoader from "react-spinners/ClipLoader";
import FreqProvider from '../providers/FreqProvider';
function Home() {
    const navigate = useNavigate(); // useNavigate hook for navigation
    const [showForm, setShowForm] = useState(false);
    const [clientName, setClientName] = useState('');
    const [projectName, setProjectName] = useState('');
    const [file, setFile] = useState(null);
    const [clients, setClients] = useState([]);
    const [projects, setProjects] = useState([]);
    const [message, setMessage] = useState('');
    const [contents, setContents] = useState([]);
    const [error, setError] = useState(null);
    const [selectedProjectDetails, setSelectedProjectDetails] = useState(null);
    const [includeExtraData, setIncludeExtraData] = useState(false); // Checkbox state
    const [titles, setTitles] = useState([]);
    const {loading, setLoading,setBanners, setdataGroup,dataGroup, setProjectId,setWeightingStats,setcurrentSelectedVariablesset,setSavedWeightings, setVariables,setSelectedClient, setSelectedProject, selectedProject,selectedClient } = useContext(VariableContext);
    
    const {setUser, user } = useAuth();
    
    // Check if user is available before accessing properties
  if (!user || !user.user || !user.user.projects) {

    return <div>Loading...</div>; // or a message indicating the user has no projects
}

const fetchContents = async () => {
    try {
      const response = await fetch(`${config.API_BASE_URL}/getListFolder`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({'project': JSON.stringify(selectedProject), 'client': JSON.stringify(selectedClient)})
      });
  
      const result = await response.json();
      setContents(result.value); // Adjust according to your response structure
    } catch (error) {
      setError(error.message);
    }
  };
  const handleUpload = async () => {
    if (!file) {
      setMessage('Please select a file before uploading.');
      return;
    }
    if (!selectedProject) {
        setMessage('Please Select a Project.');
        return;
    }
    const formData = new FormData();
    formData.append('file', file);
    formData.append('user', JSON.stringify(user)); // Add user details
    formData.append('project', JSON.stringify(selectedProject)); // Add project name
    formData.append('client', JSON.stringify(selectedClient)); // Add project name
    formData.append('includeExtraData', includeExtraData); // Send checkbox state
    setLoading(true);

    try {
      const response = await fetch(`${config.API_BASE_URL}/upload`, {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
        setLoading(false);

      }
      const data = await response.json();

      const sortedKeys =Object.keys(data.qgroup).sort((a, b) => data.qgroup[a].order - data.qgroup[b].order);
      const sortedGroup = sortedKeys.reduce((acc, key) => {
        acc[key] = data.qgroup[key];
        return acc;
      }, {});
      const extractedTitles = Object.keys(sortedGroup);
      
      setProjectId(data.project_id);
      setTitles(extractedTitles);
      setVariables(extractedTitles);
      setSelectedProjectDetails({qgroup_json:sortedGroup,id:data.project_id,client:selectedClient,project:selectedProject});
      setdataGroup(sortedGroup);
      setShowForm(false);
      setMessage(data.message);
      fetchContents();
    } catch (error) {
      setMessage('An error occurred while uploading the file.');
      setLoading(false);

    } finally {
        setLoading(false);
    }
  };
 
  
const handleSurvey = async () => {
    if (!file) {
      setMessage('Please select a file before uploading.');
      return;
    }
    if (!selectedProject) {
        setMessage('Please Select a Project.');
        return;
    }
    const formData = new FormData();
    formData.append('file', file);
    formData.append('user', JSON.stringify(user)); // Add user details
    formData.append('project', JSON.stringify(selectedProject)); // Add project name
    formData.append('client', JSON.stringify(selectedClient)); // Add client name
    formData.append('includeExtraData', includeExtraData); // Send checkbox state
    setLoading(true);

    try {
      const response = await fetch(`${config.API_BASE_URL}/surveyupload`, {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
        setLoading(false);

      }
      const data = await response.json();
      setdataGroup(data.qgroup);
      navigate('/surveybuilder');      
    } catch (error) {
      setMessage('An error occurred while uploading the file.');
      setLoading(false);

    } finally {
        setLoading(false);      
    }
  };
 
const handleClientChange = (e) => {
    const client=clients.filter(x=> x.id==e.target.value);
    if(client.length>0)
    {
      setSelectedClient(client[0]);
    
      setSelectedProject(''); // Reset project selection when client changes
      getProjectList(client[0]);
    }
    
  };
  const handleProjectChange = (e) => {
    const project=projects.filter(x=> x.id==e.target.value);
    if(project.length>0)
      {
        setSelectedProject(project[0]);
      }
  };
  
  const getProjectList = async (client) => {
    try {
        const response = await fetch(`${config.API_BASE_URL}/projects`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ clientId: client})
        });
  
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
  
        const data = await response.json();
        setProjects(data);
    
    } catch (error) {
        setMessage('An error occurred while fetching ProjectList.');
    }
  };
  
const fetchClientsProjects = async () => {
    try {
        setLoading(true);
      
      const response = await fetch(`${config.API_BASE_URL}/clients`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setClients(data);
      setLoading(false);
    } catch (error) {
        console.error('Failed to fetch clients and projects:', error);
        setLoading(false);
    }
}

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('clientName', clientName);
        formData.append('projectName', projectName);
        formData.append('file', file);

        try {
            const response = await axios.post('/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log('File uploaded successfully:', response.data);
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    function handleProjectClick(project) {
        setLoading(true); // Start loading
        fetch(`${config.API_BASE_URL}/project/${project.id}/files`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                if (data.length > 0 && data[0].qgroup_json) {
                    setProjectId(project.id);
                    setdataGroup(data[0].qgroup_json);
                    setSelectedClient(data[0].client);
                    setSelectedProject(data[0].project);
                    setBanners(JSON.parse(data[0].banner_data));
                    setSavedWeightings(data[0].weighting); 
                    if(data[0].weighting)
                    {
                        setWeightingStats({...data[0].weighting['weight'].stats});
                        setcurrentSelectedVariablesset(Object.keys(data[0].weighting['weight']['weightedCounts']))
                    }
                    
                    setShowForm(false);
                    setSelectedProjectDetails(data[0]);
                }
            })
            .catch(error => {
                console.error('There has been a problem with your fetch operation:', error);
            }).finally(() => {
                setLoading(false); // End loading
            });
    }

    return (
        <div className="home-container">
            <div className="sidebar">
                <h2>My Projects</h2>
                <div className="project-list">
                    {user.user.projects.map((project, index) => (
                        <button 
                            key={index}
                            className="project-button"
                            onClick={() => handleProjectClick(project)}>
                            {project.project_name}{project.id}
                        </button>
                    ))}
                </div>
            </div>
            <div className="content">
            {loading ? (
                <Loader loading={loading}/>
                    
                ) : (
                    <>
                        <h1>Welcome to the Dashboard</h1>
                        <p>Select a project or create a new one to get started.</p>
                        <button className="create-project-btn" onClick={() =>{fetchClientsProjects();
                             setShowForm(!showForm);}}>
                            {showForm ? 'Close' : 'Create New Project'}
                        </button>
                        {showForm && (
                            <form className="project-form" onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label htmlFor="clientName">Client Name</label>
                                    <select
                                        id="clientName"
                                        value={selectedClient.id}
                                        onChange={handleClientChange}
                                        
                                    >
                                        <option value="">--Select a Client--</option>
                                        {clients.map((client) => (
                          <option key={client.id} value={client.id}>
                            {client.name}
                          </option>
                        ))}
                                        {/* Replace with your dynamic clients list */}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="projectName">Project Name</label>
                                    <select
                                        id="projectName"
                                        value={selectedProject.id}
                                        onChange={handleProjectChange}
                                        
                                    >
                                        <option value="">--Select a Project--</option>
            {projects.length > 0 ? (
              projects.map(project => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))
            ) : (
              <option value="">No projects available.</option>
            )}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="file">Upload Data</label>
                                    <input
                                        type="file"
                                        id="file"
                                        onChange={handleFileChange}
                                        required
                                    />
                                </div>
                                <button type="submit" className="submit-btn" onClick={handleUpload}>Submit</button>
                                <button type="submit" className="submit-btn" onClick={handleSurvey}>Create Survey</button>
                            </form>
                        )}
                        {!showForm && (
                            <ProjectDetails project={selectedProjectDetails} />
                        )}
                    </>
                )}            </div>

        </div>
    );
}

export default Home;
