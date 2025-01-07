import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import VariableContext from '../contexts/VariableContext';
import FetchingFreq from '../contexts/FetchingFreq';
import config from '../configs/config';
import Plot from 'react-plotly.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolder, faFile,faTable, faChartBar,faArrowLeft,faGear,faDownload,faGauge,faBuilding,faWeightScale,faPeopleRoof,faHouse,faLaptopFile,faChargingStation } from '@fortawesome/free-solid-svg-icons';
import { Chart as ChartJS, Tooltip, Title, Legend, CategoryScale, LinearScale, PointElement, LineElement, Heatmap } from 'chart.js';
import { Chart } from 'react-chartjs-2';
function DataAnalysis() {
    const { dataGroup, projectId, currentSelectedVariablesset, setcurrentSelectedVariablesset, setCurrentSelectedVariables } = useContext(VariableContext);
    const { setActivePage,handleTitleClick,selectedTitle, setSelectedTitle,refreshData, setRefreshData,selectedBanner, setselectedBanner,selectedWeights, setSelectedWeights,selectedVariable, setSelectedVariable,loading, setLoading } = useContext(FetchingFreq);
    const [correlationResults, setCorrelationResults] = useState({});
    const [correlationCharts, setCorrelationCharts] = useState({});
    const [correlationOptions, setCorrelationOptions] = useState({});
    const [turfResults, setTurfResults] = useState({});
    const [regressionResults, setRegressionResults] = useState({});

    useEffect(()=>{
        setActivePage("analysis");
    },[]);
    const handleVariableSelectionChange = (event) => {
        const selectedOptions = Array.from(event.target.selectedOptions, option => option.value);
        const selectedOptionsset = Array.from(event.target.selectedOptions, option => dataGroup[option.value].varName.map(item => item.Name)).flat();
        setcurrentSelectedVariablesset(selectedOptionsset);
        setCurrentSelectedVariables(selectedOptions);
    };
    const clearvars=()=>{
        setcurrentSelectedVariablesset([]);
        
    }
    
    const fetchCorrelationAnalysis = async () => {
        let dataCor;   
        try {
            const response = await axios.post(`${config.API_BASE_URL}/correlation`, {
                variables: currentSelectedVariablesset,
                projectId: projectId,
            });
            setCorrelationResults(response.data);
            dataCor=response.data;
        } catch (error) {
            console.error('Error fetching correlation analysis:', error);
        }
       // Extract the labels and datasets for Chart.js
       const labels = Object.keys(dataCor);
       const datasets = labels.map((row, rowIndex) => {
           return {
               label: row,
               data: labels.map((col, colIndex) => dataCor[row][col]),
               backgroundColor: function(context) {
                   const value = context.dataset.data[context.dataIndex];
                   return value > 0 ? `rgba(255, 99, 132, ${value})` : `rgba(54, 162, 235, ${-value})`;
               },
               borderColor: 'rgba(255, 255, 255, 0.8)',
               borderWidth: 1,
               hoverBackgroundColor: 'rgba(255, 255, 255, 0.9)',
               hoverBorderColor: 'rgba(255, 255, 255, 1)',
           };
       });
   
       const data = {
           labels: labels,
           datasets: datasets,
       };
   
       const options = {
           scales: {
               x: {
                   type: 'category',
                   labels: labels,
               },
               y: {
                   type: 'category',
                   labels: labels,
               },
           },
           plugins: {
               tooltip: {
                   callbacks: {
                       label: function(context) {
                           return `${context.dataset.label}: ${context.raw}`;
                       },
                   },
               },
           },
       };
       setCorrelationCharts(data);
       setCorrelationOptions(options);
    };

    const fetchTurfAnalysis = async () => {
        try {
            const response = await axios.post(`${config.API_BASE_URL}/turf`, {
                variables: currentSelectedVariablesset,
                projectId: projectId,
            });
            setTurfResults(response.data);
        } catch (error) {
            console.error('Error fetching TURF analysis:', error);
        }
    };

    const fetchRegressionAnalysis = async () => {
        try {
            const response = await axios.post(`${config.API_BASE_URL}/regression`, {
                variables: currentSelectedVariablesset,
                projectId: projectId,
            });
            setRegressionResults(response.data);
        } catch (error) {
            console.error('Error fetching regression analysis:', error);
        }
    };

    const goToUploadData = () => {
        
    };
    const generatePlotData = () => {
        const labels = Object.keys(correlationResults);
        const zData = labels.map(row => labels.map(col => correlationResults[row][col]));

        return {
            x: labels,
            y: labels,
            z: zData,
            type: 'heatmap',
            colorscale: 'RdBu',
            zmin: -1,
            zmax: 1,
        };
    };
    return (
        <div className="analysis-container">

            <div className="main-content">
                <div className="analysis-buttons">
                    <button onClick={fetchCorrelationAnalysis}>Run Correlation Analysis</button>
                    <button onClick={fetchTurfAnalysis}>Run TURF Analysis</button>
                    <button onClick={fetchRegressionAnalysis}>Run Regression Analysis</button>
                    <button onClick={clearvars}>Clear Variable List</button> {/* Clear percentages button */}
                </div>

                <div className="analysis-results">
                    {Object.keys(correlationResults).length > 0 && (
                        <div className="correlation-results">
                            <h3>Correlation Results</h3>
                            <Plot
                                data={[generatePlotData()]}
                                layout={{
                                    title: 'Correlation Heatmap',
                                    xaxis: { title: 'Variables' },
                                    yaxis: { title: 'Variables' },
                                }}
                            />
                        </div>
                    )}

                    {Object.keys(turfResults).length > 0 && (
                        <div className="turf-results">
                            <h3>TURF Results</h3>
                            {JSON.stringify(turfResults)}
                            {/* Render TURF results */}
                        </div>
                    )}

                    {Object.keys(regressionResults).length > 0 && (
                        <div className="regression-results">
                            <h3>Regression Results</h3>
                            {JSON.stringify(regressionResults)}
                            {/* Render regression results */}
                        </div>
                    )}
                </div>
            </div>
{JSON.stringify(currentSelectedVariablesset)}
        </div>
    );
};


export default DataAnalysis;
