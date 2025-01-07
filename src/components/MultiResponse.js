import React, { useState } from 'react';
import './styles/MultiResponse.css'; // Make sure to create this CSS file
import TableComponent from './TableComponent'
import { faGripHorizontal } from '@fortawesome/free-solid-svg-icons';

function MultiResponse({ varProperties,displaySettings}) {
  debugger;
  const freq_table=varProperties.freq_table;
//   const [selectedRow, setSelectedRow] = useState(data.rows[0].index);

//   // Event handler for changing dropdown
//   const handleRowChange = event => {
//     setSelectedRow(parseInt(event.target.value, 10));
//   };

//   // Filter data based on selected row
//   const filteredData = data.dataValues.filter(d => d.rowIndex === selectedRow);

  return (
    <div className="App">
      <h5 >{varProperties.Qtitle}</h5>
      <TableComponent cols={freq_table.cols} statements={freq_table.statements} datavalue={freq_table.datavalue}
      lvl1={"colIndex"} lvl2={"statementIndex"} lvl3={"rowIndex"} lvl4={"ratingIndex"}
      flt3={1} flt4={0}
      displaySettings={displaySettings}
      ></TableComponent>
    </div>
  );
}

export default MultiResponse;
