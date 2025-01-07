import React from 'react';
import './styles/table.css'; // Import the CSS file
import TableComponent from './TableComponent'

const FrequencyTableComponent = ({ freq_table, displaySettings }) => {
  const frequency=freq_table.freq_table;
  debugger;
  return (
    <div className="table-container">
      <h3> {frequency.Qtitle}</h3>
<TableComponent
cols={frequency.cols} statements={frequency.rows} datavalue={frequency.datavalue}
lvl1={"colIndex"} lvl2={"rowIndex"} lvl3={"statementIndex"} lvl4={"ratingIndex"}
flt3={0} flt4={0}
displaySettings={displaySettings}
></TableComponent>    
    </div>
  );
};

export default FrequencyTableComponent;
