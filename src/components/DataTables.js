import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useHistory
import VariableContext from '../contexts/VariableContext';
import FetchingFreq from '../contexts/FetchingFreq';
import config from '../configs/config';
import OpenProperties from './OpenProperties'; // Import the Modal component
import MyChartComponent from './MyChartComponent'; // Import the Modal component
import FrequencyTableComponent from './FrequencyTableComponent'; // Import the Modal component
import HoverDropdown from './HoverDropdown'; // Import the Modal component
import MultiResponse from './MultiResponse'; // Import the Modal component
import DataGrid from './DataGrid'; // Import the Modal component
import MultiDataGrid from './MultiDataGrid'; // Import the Modal component
import Grid3DData from './Grid3DData'; // Import the Modal component
import CrosstabTable from './CrosstabTable';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './styles/DataTables.css';

import { faFolder, faFile,faTable, faChartBar,faArrowLeft,faGear,faDownload,faGauge,faBuilding,faWeightScale,faPeopleRoof,faHouse,faLaptopFile,faChargingStation } from '@fortawesome/free-solid-svg-icons';
import Loader from './Loader';
function DataTables() {
    const { dataGroup,setdataGroup,selectedVariables,banners,setBanners, setSelectedVariables, projectId, savedWeightings, saveCurrentWeighting, currentSelectedVariablesset, setcurrentSelectedVariablesset, setSavedWeightings, weightedCounts, weightingStats, setWeightingStats, setWeightedCounts, targetPercentages, setTargetPercentages, currentSelectedVariables, setCurrentSelectedVariables, frequencyData, setFrequencyData,setSelectedClient, setSelectedProject, selectedProject,selectedClient } = useContext(VariableContext);
    const {setMessage, setActivePage,handleTitleClick,selectedTitle, setSelectedTitle,refreshData, setRefreshData,selectedBanner, setselectedBanner,selectedWeights, setSelectedWeights,selectedVariable, setSelectedVariable,loading, setLoading } = useContext(FetchingFreq);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [exportType, setExportType] = useState('both');
    const [exportOptions, setExportOptions] = useState([{'text':"Export Percentages",'value':"percent"},{'text':"Export Frequencies",'value':"frequency"},{'text':"Export Both",'value':"both"}]);
    
    const [exportfeatures, setExportfeatures] = useState([{'type':"Uncle", 'text':"Uncle Tables"},{'type':"Quantum",'text':"Quantum Tables"}]);
    const [crosstabDisplayData, setCrosstabDisplayData] = useState(null); // State to store the crosstab data for display
    const [activeTab, setActiveTab] = useState(banners && banners.length>0? banners[0]?.name || '':'');
    const weightingNames = savedWeightings ? Object.keys(savedWeightings) : [];
    const [displayMode, setDisplayMode] = useState('table');
    const [isCrossTab, setisCrossTab] = useState(false);
    const [exportOption, setExportOption] = useState(false);
    const [displaySettings, setDisplaySettings] = useState({
        showFrequency: true,
        showPercent: true,
      });
    useEffect(()=>{
        setActivePage("tables");
    },[]);
    const closeModalAndUpdateButtons = () => {
        setIsModalOpen(false);
        handleTitleClick(selectedTitle);
      };
      const WeightingDropdown = ({ weightings }) => {
        return (
          <select onChange={(e) => setSelectedWeights(e.target.value)} value={selectedWeights} style={{ marginLeft: '10px' }}>
            <option value="" >Select Saved Weighting</option>
                                          {Object.keys(savedWeightings).map((name, index) => (
                                              <option key={index} value={name}>{name}</option>
                                          ))}
          </select>
        );
      };
      const BannerDropdown = ({ crossBreaks }) => {
        return (
          <select onChange={(e) => handleTabChange(e.target.value)} value={selectedBanner.name} style={{ marginLeft: '10px' }}>
            <option value="" >Select Saved banner</option>
                                          {crossBreaks.map((b, index) => (
                                              <option key={index} value={b.name}>{b.name}</option>
                                          ))}
          </select>
        );
      };
      
      const handleDisplaySettingsChange = (e) => {
        setDisplaySettings({
          ...displaySettings,
          [e.target.name]: e.target.checked,
        });
      };
      
      const exportFrequencies = async (type = 'both') => {
        const endpoint = type === 'both' ? '/export_both_frequencies' : '/export_frequencies';
        const requestData = { projectId: projectId };
        if (type !== 'both') {
          requestData.type = type;
        }
      
        try {
          const response = await fetch(`${config.API_BASE_URL}${endpoint}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestData)
          });
      
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
      
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = type === 'both' ? `frequency_data_${projectId}.xlsx` : `frequency_data_${projectId}_${type}.xlsx`;
          document.body.appendChild(a);
          a.click();
          a.remove();
          window.URL.revokeObjectURL(url); // Clean up
          
          setMessage('Frequency data exported successfully.');
        } catch (error) {
          setMessage(`An error occurred while exporting ${type} data: ${error.message}`);
        }
      };
      

      const downloadTxtFile = (e) => {
setExportOption(e);

        fetch(`${config.API_BASE_URL}/generate-file`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ projectId,'dataList': dataGroup,banners,'project': JSON.stringify(selectedProject), 'client': JSON.stringify(selectedClient),'type': e })
        })
        .then(response => response.json())
        .then(data => {
          //fetchContents();
            console.log('Success:', data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    };
    const handleTabChange = (tabName) => {
    if(tabName=="")
    {
        setActiveTab("");
        setselectedBanner(null);
    }
    else
    {
        const check = banners.filter(x=> x.name==tabName)[0];
        setActiveTab(check.name);
        setselectedBanner(check);
    }
        
          };
const handleExportTypeChange = (event) => {
    setExportType(event.target.value);
  };
  
const toggleModal = () => {
  
    setIsModalOpen(prev => !prev);
  };
    return (
        <div style={{ overflowX: 'auto' }}>
       <div className='dropdownContainer'>
    <OpenProperties
        isOpen={isModalOpen}
        onClose={closeModalAndUpdateButtons}
        setdataGroup={setdataGroup}
        dataGroup={dataGroup}
        selectedKey={selectedTitle}
        selectedVariable={selectedVariable}
        setSelectedVariable={setSelectedVariable}
        projectId={projectId}
    />
    <button onClick={() => toggleModal()} title='Update Properties'><FontAwesomeIcon icon={faGear} size="lg" /></button>

    <div className="toggle-switch">
        <input 
            type="checkbox" 
            id="toggle" 
            checked={refreshData} 
            onChange={(e) => setRefreshData(e.target.checked)} 
        />
        <label htmlFor="toggle" className="toggle-label"></label>
        <span className="toggle-text">Always refresh data</span>
    </div>

    <HoverDropdown downloadTxtFile={downloadTxtFile} text={"Select Export"} exportfeatures={exportfeatures} feature={1}/>
    <HoverDropdown handleTabChange={handleTabChange} text={"Select Banner"} exportfeatures={banners} feature={2}/>
    <HoverDropdown setSelectedWeights={setSelectedWeights} text={"Select Weights"} exportfeatures={savedWeightings} feature={3}/>  
    <HoverDropdown handleExportTypeChange={handleExportTypeChange} text={"Export tables"} exportfeatures={exportOptions} feature={4}/>

    <div className="three-way-toggle">
        <button 
            className={`toggle-btn ${displaySettings.showFrequency && !displaySettings.showPercent ? 'active' : ''}`} 
            onClick={() => setDisplaySettings({ showFrequency: true, showPercent: false })}
        >
            Frequency
        </button>
        <button 
            className={`toggle-btn ${displaySettings.showPercent && !displaySettings.showFrequency ? 'active' : ''}`} 
            onClick={() => setDisplaySettings({ showFrequency: false, showPercent: true })}
        >
            Percent
        </button>
        <button 
            className={`toggle-btn ${displaySettings.showFrequency && displaySettings.showPercent ? 'active' : ''}`} 
            onClick={() => setDisplaySettings({ showFrequency: true, showPercent: true })}
        >
            Both
        </button>
    </div>
</div>
               <h4>Frequency Data:</h4>
                      {loading?(<Loader loading={loading}/>):
                      (<>
                      <div>
                        {/* <button onClick={toggleDisplayMode} style={{ border: 'none', background: 'none' }}>
                          {displayMode === 'chart'
                            ? <FontAwesomeIcon icon={faTable} size="lg" />
                            : <FontAwesomeIcon icon={faChartBar} size="lg" />
                          }
                        </button> */}
                        {frequencyData && displayMode === 'chart' && Object.entries(frequencyData).map(([varName, freq], index) => (
                          <div key={index}>
                            <h3>{varName}</h3> {/* Display the variable name as a header */}
                            <MyChartComponent frequencyData={freq} /> {/* Pass the frequency data for this variable to the chart */}
                          </div>
                        ))}
                      </div>
                      
                      
                      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start' }}>
                      {
          !isCrossTab && frequencyData && (frequencyData.type=="SingleResponse" || frequencyData.type=="Numeric") && displayMode === 'table' && 
           (
            <FrequencyTableComponent
            freq_table={frequencyData}
              displaySettings={displaySettings}
            />
          )
        }
        {
          !isCrossTab && frequencyData && frequencyData.type=="Multiple2DGrid" && displayMode === 'table' && 
           (
            <MultiResponse
            varProperties={frequencyData}
            displaySettings={displaySettings}
            />
          )
        }
        {
          !isCrossTab && frequencyData && (frequencyData.type=="Single2DGrid" || frequencyData.type=="Numeric2DGrid") && displayMode === 'table' && 
           (
            <DataGrid
            gridData={frequencyData}
            displaySettings={displaySettings}
            />
          )
        }
        {
          !isCrossTab && frequencyData && (frequencyData.type=="Multiple3DGrid" || frequencyData.type=="Single3DGrid") && displayMode === 'table' && 
           (
            <MultiDataGrid
            gridData={frequencyData}
            displaySettings={displaySettings}
            />
          )
        }
        {
          !isCrossTab && frequencyData && (frequencyData.type=="Numeric3DGrid") && displayMode === 'table' && 
           (
            <Grid3DData
            gridData={frequencyData}
            displaySettings={displaySettings}
            />
          )
        }
        
                        {isCrossTab && crosstabDisplayData && (
                          
                <CrosstabTable crosstab={crosstabDisplayData} />
              )}
                      </div>
                      </>)}
                      {JSON.stringify(frequencyData.freq_table)}
                    </div>
                  
    );
}

export default DataTables;
