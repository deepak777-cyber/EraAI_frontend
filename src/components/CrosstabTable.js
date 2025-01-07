import React from 'react';
import { json } from 'react-router-dom';
import config from '../configs/config';
const CrosstabTable = ({ crosstab }) => {
  if (!crosstab) {
    return <p>No crosstab data available.</p>;
  }

  const { rowLabels, columnLabels, data,percentage, columnTotals } = crosstab;

  // Render the crosstab table
  const renderTable = () => {
    // Check if data is available
    if (!data) {
      return <p>Loading...</p>;
    }
    const dataObject = JSON.parse(data);
    const dataper = JSON.parse(percentage);
    return (
      <table>
        <thead>
          
          <tr>
            <th></th> {/* Empty cell for the top-left corner */}
            {Object.entries(columnLabels).map(([key, label]) => (
              <th key={key}>{label}</th>
            ))}
          </tr>
        </thead>
        <tbody>{/* Baseline row */}
          <tr>
            <td>Total</td>
            {Object.entries(columnLabels).map(([columnKey]) => (
              <td key={columnKey}>{columnTotals[columnKey]}</td>
            ))}
          </tr>
          {Object.entries(rowLabels).map(([rowKey, rowValue]) => (
            <>
            <tr key={rowKey}>
              <td>{rowValue}</td> {/* Row label */}
              {Object.entries(columnLabels).map(([columnKey,]) => {
                // Convert integer keys to match data's string keys
                debugger;
                const formattedRowKey = parseFloat(rowKey).toFixed(1);
                const formattedColumnKey = parseFloat(columnKey).toFixed(1);
                const dataValue = dataObject[formattedRowKey] && dataObject[formattedRowKey][formattedColumnKey]
                                  ? dataObject[formattedRowKey][formattedColumnKey]
                                  : '-';
                return <td key={columnKey}>{dataValue}</td>;
              })}
            </tr>
            <tr><td></td>
            {Object.entries(columnLabels).map(([columnKey,]) => {
                // Convert integer keys to match data's string keys
                debugger;
                const formattedRowKey = parseFloat(rowKey).toFixed(1);
                const formattedColumnKey = parseFloat(columnKey).toFixed(1);
                const dataValue = dataper[formattedRowKey] && dataper[formattedRowKey][formattedColumnKey]
                                  ? dataper[formattedRowKey][formattedColumnKey]+'%'
                                  : '';
                return <td key={columnKey}>{dataValue}</td>;
              })}
            </tr>
            </>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div>
      <h2>Crosstab Results</h2>
      {renderTable()}
    </div>
  );
}

export default CrosstabTable;
