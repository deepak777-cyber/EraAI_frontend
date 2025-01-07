import React, { useState, useEffect, useContext, useCallback } from 'react';
import './styles/TableSettingModal.css'; // Assuming you have a CSS file for basic modal styling
import { Table } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';

const TableSettingModal = ({ isOpen, rows, onClose, onRowsChange, typeofproperty, netLabel, setNetLabel, createNet }) => {
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedRowsLabel, setSelectedRowsLabel] = useState([]);
  const [reverseLabels, setReverseLabels] = useState(false);
  const [exclusive, setExclusive] = useState(false);
  const handleLogicChange = (index, newLogic) => {
    const updatedRows = rows.map(row =>
      row.index === index ? { ...row, Logic: newLogic } : row
    );
    onRowsChange(updatedRows);
  };

  const handleRowSelectionChange = (row, isSelected) => {
    const newSelectedRows = isSelected ? [...selectedRows, row.index] : selectedRows.filter(r => r !== row.index);
    const newSelectedRowsText = isSelected ? [...selectedRowsLabel, row] : selectedRowsLabel.filter(r => r.index !== row.index);
    setSelectedRows(newSelectedRows);
    setSelectedRowsLabel(newSelectedRowsText);
    setNetLabel("NET: "+ newSelectedRowsText.map(item => item.title).join(' / '))
  };

  const handlePropertyChange = (index, newValue) => {
    const updatedRows = rows.map((row, i) =>
      i === index ? { ...row, title: newValue } : row
    );
    onRowsChange(updatedRows);
  };

  const handleFactorChange = (index, newFactor) => {
    const updatedRows = rows.map((row, i) =>
      i === index ? { ...row, factor: newFactor } : row
    );
    onRowsChange(updatedRows);
  };

  const handlePaste = (index, event, field) => {
    event.preventDefault();
    const pasteData = event.clipboardData.getData('text');
    const pastedRows = pasteData.split('\n').map(row => row.trim()).filter(row => row !== '');
  
    const updatedRows = [...rows];
    pastedRows.forEach((pastedRow, i) => {
      const rowIndex = index + i;
      if (rowIndex < updatedRows.length) {
        // Update the correct field based on the 'field' parameter
        updatedRows[rowIndex] = { ...updatedRows[rowIndex], [field]: pastedRow };
      }
    });
    onRowsChange(updatedRows);
  };
  
  const moveRow = (fromIndex, toIndex) => {
    if (toIndex >= 0 && toIndex < rows.length) {
      const updatedRows = [...rows];
      const movedRow = updatedRows.splice(fromIndex, 1)[0];
      updatedRows.splice(toIndex, 0, movedRow);
      onRowsChange(updatedRows);
      
    }
  };

  const handleKeyDown = useCallback((event) => {
    if (selectedRows.length === 0) return;

    if (event.key === 'ArrowUp') {
      moveRow(selectedRows[0], selectedRows[0] - 1);
    } else if (event.key === 'ArrowDown') {
      moveRow(selectedRows[0], selectedRows[0] + 1);
    }
  }, [rows, selectedRows, onRowsChange]);

  useEffect(() => {
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    } else {
      window.removeEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, handleKeyDown]);

  const reverseValueLabels = () => {
    const updatedRows = [...rows].reverse();
    onRowsChange(updatedRows);
  };

  useEffect(() => {
    if (reverseLabels) {
      reverseValueLabels();
    }
  }, [reverseLabels]);
  const handleExclusive = () => {
    const updatedRows = rows.map(row =>
      selectedRows.includes(row.index) ? { ...row, exclusive: true } : row
    );
    onRowsChange(updatedRows);
    setExclusive(false);
    setSelectedRows([]);
  };
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="modal-close-button">Close</button>
        <div className="table-container">
          {selectedRows && selectedRows.length > 1 && (
            <div>
              <input
                type="text"
                placeholder="Enter Net Label"
                value={netLabel}
                onChange={(e) => setNetLabel(e.target.value)}
              />
              <button onClick={() => {
                createNet(netLabel, selectedRows);
                setSelectedRows([]);
              }}>
                Create Net
              </button>
              
            </div>
          )}
             {selectedRows.length > 0 && (
            <div>
              <button onClick={handleExclusive}>
                Exclusive
              </button>
            </div>
          )}

          <div>
            <label>
              <input
                type="checkbox"
                checked={reverseLabels}
                onChange={(e) => setReverseLabels(e.target.checked)}
              />
              Reverse Value Labels
            </label>
          </div>
          <Table>
            <thead>
              <tr>
                <th>Logic</th>
                <th>Select</th>
                <th>Index</th>
                <th>Title</th>
                <th>Factor</th>
                <th>Move</th>
              </tr>
            </thead>
            <tbody>
              {rows && rows.map((row, index) => (
                <tr key={index} className={selectedRows.includes(row.index) ? 'selected-row' : ''}>
                  <td>
                    <input
                      type="text"
                      value={row.Logic || ''}
                      onChange={(e) => handleLogicChange(row.index, e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(row.index)}
                      onChange={(e) => handleRowSelectionChange(row, e.target.checked)}
                    />
                  </td>
                  <td>{row.index}</td>
                  <td>
                    <input
                      type="text"
                      value={row.title}
                      onChange={(e) => handlePropertyChange(index, e.target.value)}
                      onPaste={(e) => handlePaste(index, e,'title')}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={row.factor || ''}
                      onChange={(e) => handleFactorChange(index, e.target.value)}
                      onPaste={(e) => handlePaste(index, e,'factor')}
                    />
                  </td>
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <button className='specialbutton' onClick={() => moveRow(index, index - 1)} disabled={index === 0}>
                        <FontAwesomeIcon icon={faArrowUp} />
                      </button>
                      <button className='specialbutton' onClick={() => moveRow(index, index + 1)} disabled={index === rows.length - 1}>
                        <FontAwesomeIcon icon={faArrowDown} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default TableSettingModal;
