import React from 'react';
import TableComponent from './TableComponent'

function Grid3DData({ gridData,displaySettings }) {
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

      {freq_table && freq_table.ratings.map(rat => (<>

      {freq_table && freq_table.statements.map(stat => (<> 
      <h1>{gridData.Qtitle} - {stat.label} - {rat.label}</h1>
      <TableComponent cols={freq_table.cols} statements={freq_table.rows} datavalue={freq_table.datavalue}
      lvl1={"colIndex"} lvl2={"rowIndex"} lvl3={"statementIndex"} lvl4={"ratingIndex"}
      flt3={stat.index} flt4={rat.index}
      displaySettings={displaySettings}
      ></TableComponent></>))}</>))}
      
      
    </div>
      );
}

export default Grid3DData;
