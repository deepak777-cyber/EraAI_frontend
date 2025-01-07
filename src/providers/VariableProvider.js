// VariableProvider.js
import React, { useState } from 'react';
import VariableContext from '../contexts/VariableContext';
import config from '../configs/config'; // Adjust the import path as necessary
import axios from 'axios';

const VariableProvider = ({ children }) => {
    const [variables, setVariables] = useState([]);
    const [selectedVariables, setSelectedVariables] = useState([]);
    const [dataGroup, setdataGroup] = useState(null); // Assuming qgroup data is managed here
    const [projectId, setProjectId] = useState(null); // Assuming qgroup data is managed here
    const [banners, setBanners] = useState([]);
    const [frequencyData, setFrequencyData] = useState({});
    const [weightedCounts, setWeightedCounts] = useState({});
    const [currentSelectedVariables, setCurrentSelectedVariables] = useState([]);
    const [selectedClient, setSelectedClient] = useState({});
    const [selectedProject, setSelectedProject] = useState({});
    const [loading, setLoading] = useState(false); // State for loading indicator

    const [currentSelectedVariablesset, setcurrentSelectedVariablesset] = useState([]);
    const [targetPercentages, setTargetPercentages] = useState({});
    const [weightingStats, setWeightingStats] = useState({}); // New state for min, max, and efficiency
    const [savedWeightings, setSavedWeightings] = useState({});
    // Other state and functions
    const retrieveBannersFromBackend = async () => {
        try {
            const response = await fetch(`${config.API_BASE_URL}/retrieve/${projectId}`);
            const data = await response.json();
            if (response.ok) {
                const bannerArray = JSON.parse(data.banner_json); // This line is added to parse the JSON string into an array
                setBanners(bannerArray); // Assuming you have a state setter `setBanners` defined
            } else {
                console.error('Failed to retrieve banners:', data);
            }
        } catch (error) {
            console.error('Error retrieving banners:', error);
        }
    };    

     // Function to load a selected weighting
  const loadWeightingData = (selectedWeighting) => {
    
    if (selectedWeighting) {
        // Clear out any previous frequency data and weighted counts
        setFrequencyData({});
        setWeightedCounts({});

        // Update the selected variables and target percentages
        setCurrentSelectedVariables(Object.keys(selectedWeighting['targetPercentages']));
        setTargetPercentages({...selectedWeighting.targetPercentages}); // Spread into a new object to avoid reference issues
        setWeightedCounts(selectedWeighting.weightedCounts || {});
    
// Update the weighting statistics
setWeightingStats({...selectedWeighting.stats});
// Fetch new frequency data based on the selected variables
        fetchFrequencyDataForVariables(Object.keys(selectedWeighting['targetPercentages']));
    }
};

const fetchWeights = async () => {
    try {
      const response = await axios.get(`${config.API_BASE_URL}/getweightings/${projectId}`);
      const weightingsData = response.data;

      // Assuming weightingsData is an object with a 'weighting_json' property containing the weightings.
      if (weightingsData.weighting_json) {
        const weightingsJson = weightingsData.weighting_json;
        setSavedWeightings(weightingsJson);
        const weightingNames = Object.keys(weightingsJson);

        if (weightingNames.length > 0) {
          loadWeightingData(weightingsJson[weightingNames[0]]);
        } else {
          console.log('No weightings available for this project.');
        }
      }
    } catch (error) {
      console.error("Failed to fetch weightings:", error);
    }
  };
// Assuming you have a function to fetch frequency data for a set of variables
const fetchFrequencyDataForVariables = async (variables) => {
    try {
        debugger;
        const response = await axios.post(config.API_BASE_URL+'/wtfrequency', {
            variables
        });
        
        setFrequencyData(response.data);
    } catch (error) {
        console.error('Error fetching frequency data:', error);
    }
};
const saveCurrentWeighting = (weightingName,weightingStats,weightedCounts,targets) => {
    //const weightingName = prompt("Enter a name for this weighting:");
    debugger;
    if (weightingName) {
        setSavedWeightings(prevSavedWeightings => {
            // Construct the new weighting object with both target percentages and statistics
            const newWeighting = {
                // targetPercentages: currentSelectedVariables.reduce((acc, variable) => {
                //     if (targetPercentages[variable]) {
                //         acc[variable] = targetPercentages[variable];
                //     }
                //     return acc;
                // }, {}),
                targetPercentages:targets,
                stats: { ...weightingStats },
                weightedCounts: { ...weightedCounts }, // Spread into a new object to include statistics
                frequencyData:{...frequencyData}
                
            };

            // Return the updated object with the new weighting added
            return {
                ...prevSavedWeightings,
                [weightingName]: newWeighting
            };
        });
    }
};
return (
        <VariableContext.Provider value={{ banners, setBanners,variables, setVariables, selectedVariables, setSelectedVariables,dataGroup, setdataGroup,projectId,setProjectId,
            retrieveBannersFromBackend,
            fetchWeights,savedWeightings,frequencyData,weightedCounts,targetPercentages,currentSelectedVariables,weightingStats
            ,setFrequencyData,setWeightedCounts,setCurrentSelectedVariables,setTargetPercentages,setWeightingStats,saveCurrentWeighting,setSavedWeightings,currentSelectedVariablesset,setcurrentSelectedVariablesset,
            selectedClient, setSelectedClient,
selectedProject, setSelectedProject,loading, setLoading
         }}>
            {children}
        </VariableContext.Provider>
    );
};

export default VariableProvider;
