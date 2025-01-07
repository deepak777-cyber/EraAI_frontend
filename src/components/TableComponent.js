import React, { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto'; // Automatically register all components
import * as XLSX from 'xlsx';
import PptxGenJS from 'pptxgenjs';

import './styles/TableComponent.css'; // Make sure to create this CSS file

function TableComponent({ cols, statements, datavalue, lvl1, lvl2, lvl3, lvl4, flt3, flt4, displaySettings }) {
  const [showChart, setShowChart] = useState(false);
  const [isWeighted, setIsWeighted] = useState(false); // State for weighting toggle
  const [isSigtest, setIsSigtest] = useState(false); // State for weighting toggle

  const handleToggle = () => setShowChart(!showChart);
  const handleToggleWeighting = () => setIsWeighted(!isWeighted);
  const handleToggleSigtest = () => setIsSigtest(!isSigtest);

  const downloadExcel = () => {
    const workSheet = XLSX.utils.json_to_sheet(datavalue);
    const workBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workBook, workSheet, "Data");
    XLSX.writeFile(workBook, "data.xlsx");
  };

  const downloadPPT = () => {
    let pptx = new PptxGenJS();
    let slide = pptx.addSlide();
    slide.addChart(pptx.ChartType.bar, chartData.datasets.map(ds => ({ name: ds.label, labels: chartData.labels, values: ds.data })));
    pptx.writeFile({ fileName: "chart.pptx" });
  };

  const chartData = {
    labels: statements.filter(st => st.index !== -98).map(st => st.label), // Filter out statements with index -98
    datasets: cols.map(col => ({
      label: col.label,
      data: statements.filter(st => st.index !== -98).map(st => {
        const item = datavalue.find(d => d[lvl1] === col.index && d[lvl2] === st.index && d[lvl3] === flt3 && d[lvl4] === flt4);
        return item && item.data.perc ? parseFloat(item.data.perc.replace('%', '')) : 0;
      }),
      backgroundColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.6)`,
    })),
  };

  return (
    <div>
      <div className="button-group">
        <button onClick={handleToggle}>
          {showChart ? 'Show Table' : 'Show Chart'}
        </button>
        <button onClick={handleToggleWeighting}>
          {isWeighted ? 'Unweighted' : 'Weighted'}
        </button>
        <button onClick={handleToggleSigtest}>
          {isSigtest ? 'no SigTest' : 'SigTest'}
        </button>
        <button onClick={showChart ? downloadPPT : downloadExcel}>
          {showChart ? 'Download PPT' : 'Download Excel'}
        </button>
      </div>
      {showChart ? (
        <Bar data={chartData} />
      ) : (
        <div className="table-container" style={{ width: '100%' }}>
          <table>
            <thead>
              <tr>
                <th style={{ width: "250px" }}></th> {/* Ensure the first column is wider */}
                {cols && cols.map(col => (
                  <th key={col.index} style={{ maxWidth: "50px" }}>{col.label} [{col.letter}]</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {statements && statements.map(st => (
                <>
                  {displaySettings && displaySettings.showFrequency && (
                    <tr>
                      <td>{st.label ? st.label : ''}</td>
                      {cols && cols.map(col => {
                        const item = datavalue.find(d => d[lvl1] === col.index && d[lvl2] === st.index && d[lvl3] === flt3 && d[lvl4] === flt4);
                        return (
                          <>
                            {st.index > -100 && (
                              <td key={col.index}>
                                {item ? (isWeighted ? `${item.data.freqwt}` : `${item.data.freq}`) : '-'}
                              </td>
                            )}
                            {st.index <= -100 && (
                              <td key={col.index}>
                                {item ? `${item.data.Mean}` : '-'}
                              </td>
                            )}
                          </>
                        );
                      })}
                    </tr>
                  )}
                  {st.index > -100 && displaySettings && displaySettings.showPercent && (
                    <tr key={st.index}>
                      <td>{st.label && displaySettings && !displaySettings.showFrequency ? st.label : ''}</td>
                      {cols && cols.map(col => {
                        const item = datavalue.find(d => d[lvl1] === col.index && d[lvl2] === st.index && d[lvl3] === flt3 && d[lvl4] === flt4);
                        return (
                          <td key={col.index}>
                            {item ? (isWeighted ? `${item.data.percwt}` : `${item.data.perc}`) : '-'}
                          </td>
                        );
                      })}
                    </tr>
                  )}
                  {st.index > -100 && displaySettings && isSigtest && (
                    <tr key={st.index}>
                      <td>{st.label && displaySettings && !displaySettings.showFrequency ? st.label : ''}</td>
                      {cols && cols.map(col => {
                        const item = datavalue.find(d => d[lvl1] === col.index && d[lvl2] === st.index && d[lvl3] === flt3 && d[lvl4] === flt4);
                        return (
                          <td key={col.index}>
                            {item && item.data.sig ? `${item.data.sig.map(sig => sig.colSymbol).join('')}` : ''}
                          </td>
                        );
                      })}
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default TableComponent;
