import React from 'react';
import TableComponent from './TableComponent'

function MultiDataGrid({ gridData,displaySettings }) {
  const freq_table = gridData.freq_table;

  return (
    <div className="App">

{gridData?.Nets && freq_table.statements.filter(x=> x.index>5554).map(stat => (<>
      <h1>{gridData.Qtitle} - Summary  {stat.label}</h1>
      <TableComponent cols={freq_table.cols} statements={freq_table.ratings} datavalue={freq_table.datavalue}
      lvl1={"colIndex"} lvl2={"ratingIndex"} lvl3={"rowIndex"} lvl4={"statementIndex"}
      flt3={1} flt4={stat.index}
      displaySettings={displaySettings}
      ></TableComponent ></>))}

      {freq_table && freq_table.ratings.map(stat => (<>
      <h1>{gridData.Qtitle} - {stat.label}</h1>
      <TableComponent cols={freq_table.cols} statements={freq_table.statements} datavalue={freq_table.datavalue}
      lvl1={"colIndex"} lvl2={"statementIndex"} lvl3={"rowIndex"} lvl4={"ratingIndex"}
      flt3={1} flt4={stat.index}
      displaySettings={displaySettings}
      ></TableComponent></>))}
      
      
      
      
      {freq_table && (<>
      <h1>{gridData.Qtitle} - DEFINE TABLE </h1>
      <TableComponent cols={freq_table.statements} statements={freq_table.ratings} datavalue={freq_table.datavalue}
      lvl1={"statementIndex"} lvl2={"ratingIndex"} lvl3={"colIndex"} lvl4={"rowIndex"}
      flt3={0} flt4={1}
      displaySettings={displaySettings}
      ></TableComponent ></>)}
      {freq_table && (<>
      <h1>{gridData.Qtitle} - DEFINE TABLE </h1>
      <TableComponent cols={freq_table.ratings} statements={freq_table.statements} datavalue={freq_table.datavalue}
      lvl1={"ratingIndex"} lvl2={"statementIndex"} lvl3={"colIndex"} lvl4={"rowIndex"}
      flt3={0} flt4={1}
      displaySettings={displaySettings}
      ></TableComponent ></>)}
    </div>
      );
}

export default MultiDataGrid;
