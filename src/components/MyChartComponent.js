import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js';
  
  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  );
  
  const MyChartComponent = ({ frequencyData }) => {
    // Assuming 'frequencyData' is an object where each key corresponds to a category
    // and each value is an array of objects containing 'Value' and 'Percent'
    
    // Flattening the nested structure into a single array of labels
    const labels = frequencyData && Object.values(frequencyData).flat().map(item => item.Value);
  
    // Flattening the nested structure into a single array of data points
    const data = frequencyData && Object.values(frequencyData).flat().map(item => item.Percent);
  
    const chartData = {
      labels: labels,
      datasets: [
        {
          label: 'Percentage',
          data: data,
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1,
        },
      ],
    };
  
    const options = {
      scales: {
        y: {
          beginAtZero: true,
        },
        x: {
          // If your labels are long, this will prevent them from overlapping
          ticks: {
            autoSkip: false,
            maxRotation: 90,
            minRotation: 90
          }
        }
      },
      // If you want to maintain aspect ratio or not
      maintainAspectRatio: false
    };
    const downloadPPT = async () => {
      try {
        // Prepare the data to send
        const requestData = {
          labels: labels,
          data: data,
        };
  
        // Send the data to the backend
        const response = await fetch('http://localhost:5000/generate-ppt', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestData),
        });
  
        if (response.ok) {
          // Get the response which contains the PowerPoint file
          const blob = await response.blob();
  
          // Create a download link and click it programmatically
          const downloadUrl = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = downloadUrl;
          link.download = 'chart.pptx';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(downloadUrl);
        } else {
          console.error('Server responded with an error:', response.status);
        }
      } catch (error) {
        console.error('There was an error sending the request:', error);
      }
    };
    return (
      <div>
        <div style={{ width: '600px', height: '400px' }}>
          <Bar data={chartData} options={options} />
        </div>
        <button onClick={downloadPPT}>Download as PPT</button>
      </div>
    );
  };
  
  export default MyChartComponent;
  