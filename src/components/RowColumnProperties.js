import React from 'react';

const RowColumnProperties = ({ isOpen, onClose, item, index, handlePropertyChange }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className='modal-content'>
                <div className="modal-header">
                    <span>Row/Column Properties</span>
                    <button className="modal-close-btn" onClick={onClose} title="Close">
                        &times;
                    </button>
                </div>
                <div className="modal-body">
                    <label>Exclusive</label>
                    <input
                        type="checkbox"
                        checked={item?.exclusive || false}
                        onChange={(e) => handlePropertyChange(index, 'exclusive', e.target.checked)} // Pass index
                    />

                    <label>Other</label>
                    <input
                        type="checkbox"
                        checked={item?.other || false}
                        onChange={(e) => handlePropertyChange(index, 'other', e.target.checked)} // Pass index
                    />

                    <label>Header</label>
                    <input
                        type="checkbox"
                        checked={item?.header || false}
                        onChange={(e) => handlePropertyChange(index, 'header', e.target.checked)} // Pass index
                    />

                    <label>Filter Logic</label>
                    <input
                        type="text"
                        value={item?.filterLogic || ''}
                        onChange={(e) => handlePropertyChange(index, 'filterLogic', e.target.value)} // Pass index
                    />

                    <label>Type</label>
                    <select
                        value={item?.type || ''}
                        onChange={(e) => handlePropertyChange(index, 'type', e.target.value)} // Pass index
                    >
                        <option value="">Select type</option>
                        <option value="multi">Multi</option>
                        <option value="radio">Radio</option>
                        <option value="freeze">Freeze</option>
                        <option value="fix">Fix</option>
                        <option value="open_numeric">Open Numeric</option>
                        <option value="open_string">Open String</option>
                    </select>
                </div>
                <div className="modal-footer">
                    <button onClick={onClose}>Close</button>
                </div>
            </div>
        </div>
    );
};

export default RowColumnProperties;
