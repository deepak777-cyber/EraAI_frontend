// DashboardView.js
import React, { useContext } from 'react';
import './styles/DashboardView.css'; // Add a CSS file for styles

function DashboardView({ filterList, KPIList }) {
  
  // Render the filter dropdowns with Qtitle as label
  const renderFilterDropdowns = () => (
    <>
      {filterList &&
        filterList.map((filter, index) => (
          <div key={index} className="filter-container">
            <label htmlFor={`filter-${index}`}>{filter.Qtitle || "Untitled"}</label>
            <select id={`filter-${index}`}>
              {filter.values &&
                filter.values.map((row, rowIndex) => (
                  <option key={rowIndex} value={row.title}>
                    {row.title}
                  </option>
                ))}
            </select>
          </div>
        ))}
    </>
  );

  // Render the KPI chart placeholder
  const renderKPIPlaceholder = () => (
    <div className="kpi-placeholder">
      <h2>KPI Chart Placeholder</h2>
      <p>(Chart will be implemented later)</p>
    </div>
  );

  return (
    <div className="dashboard-view">
      <div className="filter-panel">
        <h2>Filters</h2>
        <div className="filter-dropdowns">{renderFilterDropdowns()}</div>
      </div>
      <div className="kpi-panel">
        <h2>KPI Charts</h2>
        {renderKPIPlaceholder()}
        {JSON.stringify(KPIList)}
      </div>
    </div>
  );
}

export default DashboardView;
