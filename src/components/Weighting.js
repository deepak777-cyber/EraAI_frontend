import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useHistory
import VariableContext from '../contexts/VariableContext';
import FetchingFreq from '../contexts/FetchingFreq';
import config from '../configs/config';
import OpenProperties from './OpenProperties'; // Import the Modal component
import './styles/Weighting.css';

function Weighting() {
    const navigate = useNavigate(); // Initialize useNavigate hook
    const { dataGroup, projectId, savedWeightings, saveCurrentWeighting, currentSelectedVariablesset, setcurrentSelectedVariablesset, setSavedWeightings, weightedCounts, weightingStats, setWeightingStats, setWeightedCounts, targetPercentages, setTargetPercentages, currentSelectedVariables, setCurrentSelectedVariables, frequencyData, setFrequencyData } = useContext(VariableContext);
    const { handleTitleClick,setActivePage } = useContext(FetchingFreq);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    useEffect(()=>{
        setActivePage("Weighting");
    },[]);

    const saveCurrentWeightingBackend = async () => {
        try {
            // Ensure savedWeightings includes all the weightings you want to save
            const weightingData = {
                project_id: projectId,
                savedWeightings: savedWeightings, // This sends the entire object as it is
            };

            // Make sure your API can handle the 'savedWeightings' structure
            const response = await axios.post(`${config.API_BASE_URL}/saveweightings/${projectId}`, weightingData);

            // Check for a successful response
            if (response.status === 200) {
                console.log("Weightings saved successfully!");

                alert("Weightings saved successfully!");

            } else {
                console.error("Failed to save weightings:", response.data);
                alert("Failed to save weightings.");
            }
        } catch (error) {
            console.error("Error occurred while saving weightings:", error);
            alert("Error occurred while saving weightings.");
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
            setTargetPercentages({ ...selectedWeighting.targetPercentages }); // Spread into a new object to avoid reference issues
            setWeightedCounts(selectedWeighting.weightedCounts || {});

            // Update the weighting statistics
            setWeightingStats({ ...selectedWeighting.stats });
            // Fetch new frequency data based on the selected variables
            fetchFrequencyDataForVariables(Object.keys(selectedWeighting['targetPercentages']));
        }
    };


    // Function to load a selected weighting
    const loadWeighting = (weightingName) => {
        const selectedWeighting = savedWeightings[weightingName];
        if (selectedWeighting) {
            // Clear out any previous frequency data and weighted counts
            setFrequencyData({});
            setWeightedCounts({});

            // Update the selected variables and target percentages
            setCurrentSelectedVariables(Object.keys(selectedWeighting['targetPercentages']));
            setTargetPercentages({ ...selectedWeighting.targetPercentages }); // Spread into a new object to avoid reference issues
            setWeightedCounts(selectedWeighting.weightedCounts || {});

            // Update the weighting statistics
            setWeightingStats({ ...selectedWeighting.stats });
            // Fetch new frequency data based on the selected variables
            fetchFrequencyDataForVariables(Object.keys(selectedWeighting['targetPercentages']));
        }
    };

    // Assuming you have a function to fetch frequency data for a set of variables
    const fetchFrequencyDataForVariables = async (variables) => {
        try {
            const response = await axios.post(config.API_BASE_URL + '/wtfrequency', {
                currentSelectedVariablesset
            });
            setFrequencyData(response.data);
        } catch (error) {
            console.error('Error fetching frequency data:', error);
        }
    };
    const handleVariableSelectionChange = (event) => {
        const selectedOptions = Array.from(event.target.selectedOptions, option => option.value);
        // This will map over selected options and then flatten the resulting arrays into one
        const selectedOptionsset = Array.from(event.target.selectedOptions, option => dataGroup[option.value].varName.map(item => item.Name)).flat();
        setcurrentSelectedVariablesset(selectedOptionsset);
        setCurrentSelectedVariables(selectedOptions);
    };

    const fetchFrequencyData = async () => {

        try {
            const response = await axios.post(config.API_BASE_URL + '/wtfrequency', {
                variables: currentSelectedVariablesset,
                projectId: projectId
            });
            setFrequencyData(response.data);
        } catch (error) {
            console.error('Error fetching frequency data:', error);
        }
    };

    const handleTargetPercentageChange = (variable, value, key) => {
        setTargetPercentages(prev => ({
            ...prev,
            [variable]: {
                ...prev[variable],
                [key]: value
            }
        }));
    };

    const applyWeighting = async () => {
        const adjustedTargetDistributions = {};
        Object.entries(frequencyData).forEach(([variable, values]) => {
            const totalFreq = Object.values(values).reduce((sum, val) => sum + val, 0);
            adjustedTargetDistributions[variable] = calculateAdjustedTargets(values, targetPercentages[variable] || {}, totalFreq);
        });
        // Determine the weight variable name based on the number of saved weightings
        const weightVariableName = `weight${savedWeightings && Object.keys(savedWeightings).length || ''}`;

        try {
            const response = await axios.post(config.API_BASE_URL + '/applyweights', {
                target_distributions: adjustedTargetDistributions,
                weight_variable_name: weightVariableName,
                projectId: projectId,
            });
            setWeightedCounts(response.data.weighted_counts);


            // Update the state with new stats
            const stats = {
                min: response.data.weight_min,
                max: response.data.weight_max,
                efficiency: response.data.cv,
                newefficiency: response.data.check,
                iterations: response.data.iteration,
                weightingName: weightVariableName
            }
            setWeightingStats(stats);
            saveCurrentWeighting(weightVariableName, stats, response.data.weighted_counts,response.data.targetPercentages);
        } catch (error) {
            console.error('Error applying weights:', error);
        }
    };
    const handleTargetPercentageBatchUpdate = (updates) => {
        setTargetPercentages(prev => ({
            ...prev,
            ...updates
        }));
    };
    const handlePaste = (e, startVariable, startKey) => {
        e.preventDefault();
        const paste = e.clipboardData.getData('text');
        const entries = paste.split(/\r\n|\r|\n/)
            .map(line => line.trim())
            .filter(line => line);

        if (!entries.length) {
            console.error('No entries parsed from paste data');
            return;
        }

        const allVariableKeys = getAllVariableKeys(frequencyData);
        const startIndex = allVariableKeys.findIndex(vk => vk.variable === startVariable && vk.key === startKey);

        if (startIndex === -1) {
            console.error('Starting variable/key not found in the current list');
            return;
        }

        let updates = {};
        entries.forEach((value, index) => {
            const targetIndex = startIndex + index;
            if (targetIndex < allVariableKeys.length) {
                const { variable, key } = allVariableKeys[targetIndex];
                const parsedValue = parseValue(value);
                if (!updates[variable]) {
                    updates[variable] = {};
                }
                updates[variable][key] = parsedValue;
            }
        });

        handleTargetPercentageBatchUpdate(updates);
    };

    const parseValue = (value) => {
        // Remove any non-numeric, non-dot, non-percentage characters
        const numericValue = value.replace(/[^0-9.%]/g, '');
        // Check if the value contains a percentage sign
        if (numericValue.includes('%')) {
            return parseFloat(numericValue.replace('%', '')) / 100;
        } else {
            return parseFloat(numericValue) / 100;
        }
    };
    const clearTargetPercentages = () => {
        const resetPercentages = {};
        Object.keys(targetPercentages).forEach(variable => {
            resetPercentages[variable] = {};
            Object.keys(targetPercentages[variable]).forEach(key => {
                resetPercentages[variable][key] = '';  // or set to 0 if that's preferable
            });
        });
        setTargetPercentages(resetPercentages);
    };


    const getAllVariableKeys = (frequencyData) => {
        let allVariableKeys = [];
        Object.entries(frequencyData).forEach(([variable, values]) => {
            Object.keys(values).forEach(key => {
                allVariableKeys.push({ variable, key });
            });
        });
        return allVariableKeys;
    };

    // Function to calculate the adjusted target percentages including missing values
    const calculateAdjustedTargets = (values, targets, totalFreq, variable) => {
        let newTargets = {};
        // Collect keys that have targets provided
        const keysWithTargets = Object.keys(targets);
        // Get keys in values that are not in targets
        const difference = Object.keys(values).filter(key => !Object.keys(targets).includes(key));
        const totwithoutNan = Object.entries(values)
            .filter(([key, _]) => key !== 'NaN' && !isNaN(Number(key)) && !difference.includes(key)) // Exclude 'NaN' key and check if key is a number
            .reduce((sum, [_, value]) => sum + value, 0)

        Object.keys(values).forEach(key => {
            if (key !== 'NaN' && !isNaN(Number(key)) && !difference.includes(key)) { // Check if key is not 'NaN' and is a number
                newTargets[key] = targets[key] ? targets[key] * totwithoutNan / totalFreq : values[key] / totalFreq;
            } else {
                // If the key is 'NaN', just copy the original value
                newTargets[key] = values[key] / totalFreq;
            }
        });

        return newTargets;
    };
    const handleDownload = async () => {
        const response = await fetch(`${config.API_BASE_URL}/download_weighted_file`);
        const blob = await response.blob();
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.setAttribute('download', 'weighted2.sav'); // Any filename you want to save as
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
    };
    const removeVariable = (variable) => {
        setcurrentSelectedVariablesset(currentSelectedVariablesset.filter(v => v !== variable));
        setFrequencyData(prev => {
            const newFrequencyData = { ...prev };
            delete newFrequencyData[variable];
            return newFrequencyData;
        });
    };
    // Function to navigate back to the Upload data page
    const goToUploadData = () => {
        navigate('/uploaddata'); // Replace '/upload-data' with the actual path to your Upload data page
    };
    const clearvars=()=>{
        setcurrentSelectedVariablesset([]);
        setFrequencyData({});
    }
    const toggleModal = () => {
  
        setIsModalOpen(prev => !prev);
      };
      const closeModalAndUpdateButtons = () => {
        setIsModalOpen(false);
      };
      
    return (
        <div className="main-content">
            {Object.keys(weightingStats).length > 0 && (
                <div className="stats-weightings-container">
                    <div className="weighting-stats">

                        <div>
                            <h3>Weighting Statistics - {weightingStats.weightVariableName}</h3>
                            <p>Minimum Weight: {weightingStats.min}</p>
                            <p>Maximum Weight: {weightingStats.max}</p>
                            <p>Efficiency (CV): {weightingStats.efficiency}%</p>
                            <p>New Efficiency (CV): {weightingStats.newefficiency}%</p>
                            <p>Iterations: {weightingStats.iterations}</p>
                        </div>

                    </div>
                    <div className="saved-weightings">
                        <h2>Saved Weightings</h2>
                        {/* Dropdown to select and load a saved weighting */}
                        <select onChange={(e) => loadWeighting(e.target.value)} defaultValue="">
                            <option value="" disabled>Select Saved Weighting</option>
                            {Object.keys(savedWeightings).map((name, index) => (
                                <option key={index} value={name}>{name}</option>
                            ))}
                        </select>

                    </div></div>)}
            <div className="frequency-data">

                <button onClick={fetchFrequencyData}>Get Frequency Data</button>
                <button onClick={() => toggleModal()} title='Update Properties'>Club Responses</button>
                <OpenProperties 
                                    isOpen={isModalOpen}
                                    onClose={closeModalAndUpdateButtons}   
                                />
                <button onClick={clearTargetPercentages}>Clear Target Percentages</button> {/* Clear percentages button */}
                <button onClick={clearvars}>Clear Variable List</button> {/* Clear percentages button */}
                {Object.keys(weightingStats).length > 0 && (<> <button onClick={handleDownload}>Download Weighted File</button>
                    <button onClick={saveCurrentWeightingBackend}>Save Current Weighting</button> </>
                )}

                {Object.entries(targetPercentages).length > 0 && (<button onClick={applyWeighting}>Apply Weighting</button>)}

                {Object.entries(frequencyData).length > 0 && currentSelectedVariablesset.length > 0 && (<><h2>Selected Variables Frequency Data</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Variable Value</th>
                                <th>Frequency</th>
                                <th>Percentage</th>
                                <th>Target Percentage</th>
                                <th>Adjusted Target Percentage</th> {/* New column */}

                                <th>Weighted Count</th> {/* New column for weighted counts */}
                                <th>Weighted Percentage</th> {/* New column for weighted percentages */}
                                <th>Remove Variable</th> {/* New column for weighted percentages */}
                            </tr>
                        </thead>
                        <tbody>
                            {Object.entries(frequencyData).map(([variable, values]) => {
                                const totalFreq = Object.values(values).reduce((sum, val) => sum + val, 0);
                                const totalWeightedCount = Object.values(weightedCounts?.[variable] || {}).reduce((sum, val) => sum + val, 0) || totalFreq;
                                const adjustedTargets = calculateAdjustedTargets(values, targetPercentages[variable] || {}, totalFreq, variable);

                                let previousVariable = null; // Track the previous variable to compare
                                
                                return Object.entries(values).map(([key, freq], index) => {
                                    const percentage = ((freq / totalFreq) * 100).toFixed(2);
                                    const numericalKey = Number(key);
                                    const keyString = isNaN(numericalKey) ? 'NaN' : numericalKey.toFixed(1);
                                    const adjustedTarget = (adjustedTargets[key] * 100).toFixed(2);
                                    const weightedCount =  weightedCounts?.[variable]?.[keyString]?.toFixed(2) || freq.toFixed(2);
                                    const weightedPercentage = ((parseFloat(weightedCount) / totalWeightedCount) * 100).toFixed(2) || percentage;
                                    const rowClass = previousVariable !== variable ? 'dark-border' : ''; // Apply the dark border class if variable has changed
                                    previousVariable = variable; // Update the previous variable to the current one

                                    return (
                                        <tr key={`${variable}-${key}-${index}`} className={rowClass}>
                                            <td>{`${variable} (${key})`}</td>
                                            <td>{freq.toFixed(2)}</td>
                                            <td>{`${percentage}%`}</td>
                                            <td>
                                                <input
                                                    type="text"
                                                    value={targetPercentages[variable]?.[key] || ''}
                                                    onChange={(e) => handleTargetPercentageChange(variable, e.target.value, key)}
                                                    onPaste={(e) => handlePaste(e, variable, key)}
                                                />
                                            </td>
                                            <td>{adjustedTarget}%</td> {/* Display adjusted target percentage */}
                                            <td>{weightedCount}</td> {/* Display the weighted count */}
                                            <td>{weightedPercentage !== '-' ? `${weightedPercentage}%` : '-'}</td> {/* Display the weighted percentage */}
                                            <td>
                                                    {/* Cross sign to remove the variable */}
                                                    <button onClick={() => removeVariable(variable)} style={{ background: 'transparent', border: 'none', color: 'red', cursor: 'pointer' }}>
                                                        &#x2715;
                                                    </button>
                                                </td>
                                        </tr>
                                    );
                                });
                            })}
                        </tbody>
                    </table></>)}
                {/* {JSON.stringify(currentSelectedVariablesset)} */}
                {/* Save current weighting */}
                {/* <button onClick={saveCurrentWeighting}>Save Current Weighting</button> */}
            </div>
            
        </div>
    );
}

export default Weighting;
