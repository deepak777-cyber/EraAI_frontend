// Dashboard.js
import React, { useContext, useState, useEffect } from 'react';
import FetchingFreq from '../contexts/FetchingFreq';
import './styles/Dashboard.css'; // Assuming you have a CSS file for basic modal styling
import DashboardView from './DashboardView';

function Dashboard() {
  const { selectedVariable, setActivePage } = useContext(FetchingFreq);
  const [filterList, setFilterList] = useState([]);
  const [KPIList, setKPIList] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [isDashboardVisible, setIsDashboardVisible] = useState(false); // State to show/hide the dashboard view

  useEffect(() => {
    setActivePage("dashboard");
  }, []);

  const openDashboardView = () => {
    setIsDashboardVisible(true); // Show the dashboard view overlay
  };

  const closeDashboardView = () => {
    setIsDashboardVisible(false); // Hide the dashboard view overlay
  };
  // Handle checkbox selection/deselection
  const handleCheckboxChange = (itemIndex, isChecked) => {
    if (isChecked) {
      setSelectedItems(prev => [...prev, itemIndex]);
    } else {
      setSelectedItems(prev => prev.filter(index => index !== itemIndex));
    }
  };

  // Move the selected items to the Filter list
  const saveToFilterList = () => {
    const filterVariable = { ...selectedVariable, selectedItems };
    setFilterList(prev => [...prev, filterVariable]);
    setSelectedItems([]); // Clear the selection
  };

  // Move the selected items to the KPI list
  const saveToKPIList = () => {
    const KPIvariable = { ...selectedVariable, selectedItems };
    setKPIList(prev => [...prev, KPIvariable]);
    setSelectedItems([]); // Clear the selection
  };

  // Render either valueLabels (for SingleResponse) or Rows (for MultipleResponse)
  const renderVariableTable = () => {
    if (!selectedVariable) return null;

    const isSingleResponse = selectedVariable.type === "SingleResponse";
    const labelsOrRows = isSingleResponse ? selectedVariable.valueLabels : selectedVariable.Rows;

    if (!labelsOrRows) return null;

    return (
      <table className="variable-table">
        <thead>
          <tr>
            <th>Select</th>
            <th>{isSingleResponse ? "Label" : "Row Title"}</th>
          </tr>
        </thead>
        <tbody>
          {isSingleResponse
            ? Object.entries(labelsOrRows).map(([key, value]) => (
                <tr key={key}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(Number(key))}
                      onChange={(e) => handleCheckboxChange(Number(key), e.target.checked)}
                    />
                  </td>
                  <td>{value}</td>
                </tr>
              ))
            : labelsOrRows.map((row) => (
                <tr key={row.index}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(row.index)}
                      onChange={(e) => handleCheckboxChange(row.index, e.target.checked)}
                    />
                  </td>
                  <td>{row.title}</td>
                </tr>
              ))}
        </tbody>
      </table>
    );
  };

  const renderFilterList = () => (
    <ul>
      {filterList.map((variable, index) => (
        <li key={index}>
          <strong>{variable.Qtitle}</strong>
          <div>
            {Object.keys(variable.valueLabels || {}).map((key) => (
              <label key={key}>
                <input type="checkbox" defaultChecked />
                {variable.valueLabels[key]}
              </label>
            ))}
          </div>
        </li>
      ))}
    </ul>
  );

  const renderKPIList = () => (
    <ul>
      {KPIList.map((variable, index) => (
        <li key={index}>
          <strong>{variable.Qtitle}</strong>
          <div>
            {Object.keys(variable.valueLabels || {}).map((key) => (
              <label key={key}>
                <input type="checkbox" defaultChecked />
                {variable.valueLabels[key]}
              </label>
            ))}
          </div>
        </li>
      ))}
    </ul>
  );

  return (
    <div>
      <h1>Dashboard Page</h1>

      <div className="variable-selection">
        <h2>Selected Variable</h2>
        {renderVariableTable()}
        <button onClick={saveToFilterList}>Save to Filter</button>
        <button onClick={saveToKPIList}>Save to KPI</button>
      </div>
      <button onClick={openDashboardView} className="view-dashboard-btn">View Dashboard</button>
      {isDashboardVisible && (
        <div className="dashboard-overlay">
          <div className="dashboard-content">
            <button className="close-dashboard-btn" onClick={closeDashboardView}>Close</button>
            <DashboardView 
            filterList={filterList}
            KPIList={KPIList}
            
            />
          </div>
        </div>
      )}
      <div className="filter-kpi-container">
        <div className="filter-list">
          <h2>Filters</h2>
          {renderFilterList()}
        </div>
        <div className="kpi-list">
          <h2>KPIs</h2>
          {renderKPIList()}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
