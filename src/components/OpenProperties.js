import React from 'react';
import PropertiesComponent from './PropertiesComponent'; // Import the Modal component

const OpenProperties = ({ isOpen,onClose,selectedVariable,setdataGroup,dataGroup,selectedKey,setSelectedVariable,projectId}) => {
  if (!isOpen) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
      <button onClick={onClose} className="modal-close-button">Close</button>

    <PropertiesComponent setdataGroup={setdataGroup}
    selectedVariable={selectedVariable}
    selectedKey={selectedKey}
    dataGroup={dataGroup}
    setSelectedVariable={setSelectedVariable}
    projectId={projectId}
    />
    </div>
      </div>
    
  );
};

export default OpenProperties;
