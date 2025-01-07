import React from 'react';
import TableComponent from './TableComponent'

function DataGrid({ gridData,displaySettings }) {
  const freq_table = gridData.freq_table;

  return (
    <div className="App">


{gridData?.Nets && freq_table.rows.filter(x=> x.index>5554).map(stat => (<>
      <h1>{gridData.Qtitle} - Summary  {stat.label}</h1>
      <TableComponent cols={freq_table.cols} statements={freq_table.statements} datavalue={freq_table.datavalue}
      lvl1={"colIndex"} lvl2={"statementIndex"} lvl3={"rowIndex"} lvl4={"ratingIndex"}
      flt3={stat.index} flt4={0}
      displaySettings={displaySettings}
      ></TableComponent ></>))}
      

      {freq_table && freq_table.statements.map(stat => (<>
      <h1>{gridData.Qtitle} - {stat.label}</h1>
      <TableComponent cols={freq_table.cols} statements={freq_table.rows} datavalue={freq_table.datavalue}
      lvl1={"colIndex"} lvl2={"rowIndex"} lvl3={"statementIndex"} lvl4={"ratingIndex"}
      flt3={stat.index} flt4={0}
      displaySettings={displaySettings}
      ></TableComponent ></>))}
      
      
      {freq_table && (<>
      <h1>{gridData.Qtitle} - DEFINE TABLE </h1>
      <TableComponent cols={freq_table.statements} statements={freq_table.rows} datavalue={freq_table.datavalue}
      lvl1={"statementIndex"} lvl2={"rowIndex"} lvl3={"colIndex"} lvl4={"ratingIndex"}
      flt3={0} flt4={0}
      displaySettings={displaySettings}
      ></TableComponent ></>)}
      {freq_table && (<>
      <h1>{gridData.Qtitle} - DEFINE TABLE </h1>
      <TableComponent cols={freq_table.rows} statements={freq_table.statements} datavalue={freq_table.datavalue}
      lvl1={"rowIndex"} lvl2={"statementIndex"} lvl3={"colIndex"} lvl4={"ratingIndex"}
      flt3={0} flt4={0}
      displaySettings={displaySettings}
      ></TableComponent ></>)}
    </div>
      );
}

export default DataGrid;
