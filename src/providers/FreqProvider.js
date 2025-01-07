// VariableProvider.js
import React, { useState,useContext } from 'react';
import FetchingFreq from '../contexts/FetchingFreq';
import VariableContext from '../contexts/VariableContext';

import config from '../configs/config'; // Adjust the import path as necessary
import axios from 'axios';
import { faL } from '@fortawesome/free-solid-svg-icons';

const FreqProvider = ({ children }) => {

    const { setVariables,selectedClient, setSelectedClient,
    selectedProject, setSelectedProject,dataGroup,setdataGroup,projectId,setProjectId,
    retrieveBannersFromBackend,banners,setBanners,fetchWeights,savedWeightings,frequencyData, setFrequencyData
    ,loading, setLoading } = useContext(VariableContext); // Use setVariables from context
    const [selectedTitle, setSelectedTitle] = useState(null);
    const [isCrossTab, setisCrossTab] = useState(false);
    const [activePage, setActivePage] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [list, setList] = useState([]);
    const [rows, setRows] = useState([]);
    const [columns, setColumns] = useState([]);
    const [selectedBannerIndex, setSelectedBannerIndex] = useState(null);
    const [selectedItem, setSelectedItem] = useState(null);
    const [sigLetters, setSigLetters] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    
    const [showFrequencyTable, setShowFrequencyTable] = useState(false); // New state to control table display
    const [selectedVariable, setSelectedVariable] = useState(null);
    const [refreshData, setRefreshData] = useState(false);    
    const [selectedBanner, setselectedBanner] = useState([]); // Added filenames state
    const [selectedWeights, setSelectedWeights] = useState([]); // Added filenames state
    const [isTotal, setIsTotal] = useState(true);
    const handleTitleClick = async (title) => {
        setSelectedTitle(title);
        setisCrossTab(false);
        setIsLoading(true);
        setLoading(true);
        //setFrequencyData(qgroupEntry); 
        const varNames = dataGroup[title]?.varName;
        //const varNames = dataList[title]?.varName;
        if (!varNames || varNames.length === 0) {
          setMessage('Variable names not found for the selected title.');
          setLoading(false);
          return;
        }
    
        //setSelectedVariable(dataList[title]);
        setSelectedVariable(dataGroup[title]);
    
        // Check if the data already exists in the cache and refresh is not required
         const varData = dataGroup[title];
         
      try {
          const payload = {
            varNames: dataGroup[title],
            //varNames: dataList[title],
            key:title,
            selectedWeights: selectedWeights, // Include selectedWeights in the payload
            selectedBanner: selectedBanner,    // Include selectedBanner in the payload
            projectId: projectId,
            refreshData:refreshData
          };
          const response = await fetch(`${config.API_BASE_URL}/frequency`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
          });
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
            setIsLoading(false);
            setLoading(false);
          }
          const data = await response.json(); 
          //setFrequencyData(data.frequency_data); // Store frequency data in state
          setFrequencyData(data); // Store frequency data in state
          // Update the dataList with the fetched data for future reference, specifically under the selected banner
        //varData.frequencyData = varData.frequencyData || {}; // Ensure the frequencyData object exists
        //varData.frequencyData[selectedBanner?.name] = data.freq_table; // Store fetched data for this banner
    
          setShowFrequencyTable(true);
          setMessage('Frequency data retrieved successfully.');
          setIsLoading(false);
          setLoading(false);
    
        } catch (error) {
          setMessage('An error occurred while fetching frequency data.');
          setIsLoading(false);
          setLoading(false);
    
        } finally {
          setIsLoading(false);
          setLoading(false);
    
        }
      };
      const getAlphabeticIdentifier = (index) => {
        
        let identifier = '';
        while (index >= 0) {
            identifier = String.fromCharCode(((index) % 26) + 65) + identifier ;
            index = Math.floor(index / 26) - 1;
        }
        return identifier;
    };
      const handleSelectionChange = (itemName,itemProperties) => {
        let newRows = [];
        var index=0;
        if (itemProperties.type === "SingleResponse") {
            const variableName = itemName;
            const valueLabels = itemProperties.valueLabels;
            newRows = Object.keys(valueLabels).map(key => ({
                headerText: variableName,
                text: valueLabels[key],
                letter:getAlphabeticIdentifier(index),
                logic: `${variableName}=${key}`
            }));
            
            if (itemProperties.Nets) {
                itemProperties.Nets.forEach(net => {
                    const netIndices = net.indices.join(',');
                    newRows.push({
                        headerText: variableName,
                        text: `NET - ${net.label}`,
                        letter:getAlphabeticIdentifier(index),
                        logic: `${variableName} in (${netIndices})`
                    });
                });
            }
            index+=newRows.length;
        } else if (itemProperties.type === "Multiple2DGrid") {
            const variableName = itemName;
            const subVariables = itemProperties.Rows;
            const subVarNames = itemProperties.varName;
            newRows = subVariables.map((subVar, index) => ({
                headerText: variableName,
                text: subVar.title,
                letter:getAlphabeticIdentifier(index),
                logic: `${subVarNames.filter(x => x.row === subVar.index)[0].Name}=1`
            }));

            if (itemProperties.Nets) {
                itemProperties.Nets.forEach(net => {
                    const netVar = subVarNames.filter(x => net.indices.find(y => y === x.row)).map(x => x.Name + '=1');
                    const netIndices = netVar.join(' or ');
                    newRows.push({
                        headerText: variableName,
                        text: `NET - ${net.label}`,
                        letter:getAlphabeticIdentifier(index),
                        logic: `${netIndices}`
                    });
                });
            }
            index+=newRows.length;
        }

        if (newRows.length > 0) {
            if (banners && selectedBannerIndex !== null) {
                const updatedBanners = banners.map((banner, index) => {
                    if (index === selectedBannerIndex) {
                        return {
                            ...banner,
                            rows: [...banner.rows, ...newRows]
                        };
                    }
                    return banner;
                });
                setBanners(updatedBanners);
            } else {
                const newBanner = {
                    name: `Banner ${banners && banners.length + 1 || 1}`,
                    rows:[
                        {
                          headerText: "Total",
                          text: "Total",
                          letter: "A",
                          logic: "ALL"
                        },
                        ...newRows
                      ],
                    minbase: '',  // Initialize minbase
            lowbase: '',   // Initialize lowbase
            minbaseSymbol: '**',  // Initialize minbase
            lowbaseSymbol: '*',   // Initialize lowbase
            isTotal: true,   // Initialize lowbase
            isCompliment:false
                };
                setBanners([...(banners || []), newBanner]);
            }
        }
        setSelectedItem({ [itemName]: itemProperties });
    };
    const handleAllTitlesClick = async () => {
        setIsLoading(true);
        setMessage('Processing all variables...');
    
        const titles = Object.keys(dataGroup);
        //const titles = Object.keys(dataList);
        const allFrequencyData = {};
    
        for (const title of titles) {
          //if(dataList[title]?.type && dataList[title].type!='Numeric' && dataList[title].type!='String')
            if(dataGroup[title]?.type && dataGroup[title].type!='Numeric' && dataGroup[title].type!='String')
            {
          const frequencyData = await handleTitleClick(title, false);
            if (frequencyData) {
                //dataList[title].frequencyData = frequencyData;
            }
          }
        }
    
        // Send all dataList to the backend for saving
        await saveAllDataListToBackend(dataGroup);
        //await saveAllDataListToBackend(dataList);
    
        setIsLoading(false);
        setMessage('All variables processed and data saved successfully.');
    };
    
const saveAllDataListToBackend = async (dataGroup) => {
    try {
        const response = await fetch(`${config.API_BASE_URL}/save_all_data_list`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ projectId: projectId, dataList: dataGroup })
        });
  
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
  
        const data = await response.json();
        setMessage('All dataList saved successfully.');
    } catch (error) {
        setMessage('An error occurred while saving dataList.');
    }
  };
  const addQuestion = () => {
    const nextKey = dataGroup? `Q${Object.keys(dataGroup).length + 1}`: 'Q1';
    setdataGroup({ ...dataGroup, [nextKey]: { Qtitle: '', instructions: '', type:'SingleResponse' } });
    setRows([{ id: 1, text: '' }]);
    setColumns([]);
    setSelectedTitle(nextKey);
    setSelectedVariable({ Qtitle: '', instructions: '', type:'SingleResponse' } );
    setIsModalOpen(true); // Open the SurveyElements popup
};
return (
        <FetchingFreq.Provider value={{handleTitleClick,activePage, handleAllTitlesClick,setActivePage,sigLetters, setSigLetters,handleSelectionChange,selectedBannerIndex, setSelectedBannerIndex,selectedItem, setSelectedItem
            ,refreshData, setRefreshData,selectedBanner, setselectedBanner,selectedWeights, setSelectedWeights,selectedTitle, setSelectedTitle,selectedVariable, setSelectedVariable,
            loading, setLoading,isModalOpen, setIsModalOpen,rows, setRows,columns, setColumns,addQuestion,list, setList,
            isTotal, setIsTotal
        }}>
            {children}
        </FetchingFreq.Provider>
    );
};

export default FreqProvider;
