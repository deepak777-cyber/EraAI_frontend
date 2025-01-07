// TableSettings.js
import React, { useState, useContext } from 'react';
import TableSettingModal from './TableSettingModal'; // Import the Modal component
import config from '../configs/config';
import './styles/PropertiesComponent.css';

const PropertiesComponent = ({selectedVariable,setdataGroup, dataGroup,selectedKey,setSelectedVariable,projectId}) => {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalDataType, setModalDataType] = useState(null); // 'rows' or 'cols'
    const [nets, setNets] = useState([]);
    const [netLabel, setNetLabel] = useState("");
    const [loading, setLoading] = useState(false); // Loading state
    const createNet = (label, rowIndices) => {
        const newNet = {
          label: label,
          indices: rowIndices
        };
        setNets(prevNets => {
            const updatedNets = [...prevNets, newNet];
            addNet(updatedNets);
            return updatedNets;
          });
      };
    const defaultNewProperties = {
        removeTab: false,
        mean: false,
        median: false,
        grid: false,
        reverseGrid: false,
        addNets: false,
        saveToExcel: false,
        downloadDVExcel: false,
        SPSSSyntax: false,
        conceptTables: false,
        reverseLocation: false,
        dataCuts: false,
        rank: false,
        rankalphabetical: false,
        rankCol:false
    };
    const addNet = (updatedNets) => {
        setSelectedVariable(prev => ({ ...prev, Nets: updatedNets }));
    };
    const saveChanges = async () => {
        setLoading(true); // Start loading indicator
       // Update the local dataGroup
        const updatedDataGroup = { ...dataGroup, [selectedKey]: selectedVariable };

        setdataGroup(prev => ({ ...prev, [selectedKey]: selectedVariable,setSelectedVariable }));
        try {
            // Make a POST request to the backend
            const response = await fetch(`${config.API_BASE_URL}/save_all_data_group`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({projectId: projectId,      // Include the project ID
                    dataGroup: updatedDataGroup // Include the updated dataGroup
                    }), // Send the updated dataGroup
            });

            // Check if the response is successful
            if (!response.ok) {
                throw new Error('Failed to save dataGroup to the backend');
            }

            //const result = await response.json();
            console.log('Data saved successfully:');

            // Update the state with the new dataGroup
            //setdataGroup(updatedDataGroup);
        } catch (error) {
            console.error('Error saving changes:', error);
            // Optionally handle errors here, such as displaying an error message to the user
        } finally {
            setLoading(false); // Stop loading indicator
        }
    };
    const isBoolean = (property) => typeof defaultNewProperties[property] === 'boolean';
    
    const handleRowChange = (index, newValue) => {
        setSelectedVariable(prev => {
            const updatedRows = [...prev.Rows];
            updatedRows[index] = { ...updatedRows[index], title: newValue };
            return { ...prev, Rows: updatedRows };
        });
    };

    const handleColChange = (index, newValue) => {
        setSelectedVariable(prev => {
            const updatedCols = [...prev.Cols];
            updatedCols[index] = { ...updatedCols[index], title: newValue };
            return { ...prev, Cols: updatedCols };
        });
    };

    const toggleModal = (type) => {
        setModalDataType(type);
        setIsModalOpen(prev => !prev);
    };

    const closeModalAndUpdateButtons = () => {
        setIsModalOpen(false);
    };

    const handleRowsChange = (updatedRows) => {
        setSelectedVariable(prev => ({ ...prev, Rows: updatedRows }));
    };

    const handleColsChange = (updatedCols) => {
        setSelectedVariable(prev => ({ ...prev, Cols: updatedCols }));
    };
    const handlevaluesChange = (updatedValues) => {
        setSelectedVariable(prev => ({ ...prev, values: updatedValues }));
    };
    const handlevalueLabelsChange = (updatedvalueLabels) => {
        setSelectedVariable(prev => ({ ...prev, valueLabels: updatedvalueLabels }));
    };
    const handlePropertyChange = (e, property) => {
        const newValue = isBoolean(property) ? e.target.checked : e.target.value;
        setSelectedVariable(prev => ({ ...prev, [property]: newValue }));
    };
function generateTabulation(data) {
    let tb ="";
if(data.type=='SingleResponse')
{
    tb = `Table 1\nT ${data.Qtitle}\nR Total Respondents;ALL\n`;
    const baseLocation = data.Rows && data.Rows.length > 0 ? '{3}' : `${data.varName[0]?.Location || ''}`;
    // Process value labels if they exist and their count is greater than 2
    if (data.valueLabels ) {
        for (const [labelKey, labelValue] of Object.entries(data.valueLabels)) {
            tb += `R ${labelValue};R(${baseLocation},${labelKey})\n`;
        }
    }

}
else if(data.type=='Single2DGrid')
{
    tb = `Table 1\nT ${data.Qtitle}\nR Total Respondents;ALL\n`;
// Define a base location for use in value labels section
const baseLocation = data.Rows && data.Rows.length > 0 ? '{3}' : `${data.varName[0]?.Location || ''}`;

// Process value labels if they exist and their count is greater than 2
if (data.valueLabels && Object.keys(data.valueLabels).length > 2) {
    for (const [labelKey, labelValue] of Object.entries(data.valueLabels)) {
        tb += `R ${labelValue};R(${baseLocation},${labelKey})\n`;
    }

const steps = ['\nX STEP 1\n', '\nX STEP 2\n', '\nX STEP 3\n'];
data.Rows.forEach(row => {
    const location = data.varName.find(varName => varName.Name.endsWith(`R${row.index}`))?.Location || '';
    // Append row details to respective steps
    steps[0] += `X "${row.index}"\n`;
    steps[1] += `X "${row.title}"\n`;
    steps[2] += `X "${location}"\n`;
});
// Concatenate all steps
tb += steps.join('');
}
else
{
    data.Rows.forEach(row => {
        const varNameEntry = data.varName.find(varName => varName.Name.endsWith(`${row.index}`));
        const location = varNameEntry ? `${varNameEntry.Location}` : "";
        tb += `R ${row.title}\t\t       ;R(${location},1)\n`;
    });
}
}
else if(data.type=='Single3DGrid')
{
    tb = `*\nTable 1\nX GENTAB \nT ${data.Qtitle}\nR Total Respondents;ALL\n`;
// Define a base location for use in value labels section
const baseLocation = data.Rows && data.Rows.length > 0 ? '{3}' : `${data.varName[0]?.Location || ''}`;

// Process value labels if they exist and their count is greater than 2
if (data.valueLabels && Object.keys(data.valueLabels).length > 2) {
    for (const [labelKey, labelValue] of Object.entries(data.valueLabels)) {
        tb += `R ${labelValue};R(${baseLocation},${labelKey})\n`;
    }

const steps = ['\nX STEP 1\n', '\nX STEP 2\n', '\nX STEP 3\n', '\nX STEP 4\n', '\nX STEP 5\n'];
data.Rows.forEach(row => {
    const location = data.varName.find(varName => varName.Name.endsWith(`R${row.index}`))?.Location || '';
    // Append row details to respective steps
    steps[0] += `X "${row.index}"\n`;
    steps[1] += `X "${row.title}"\n`;
    steps[2] += `X "${location}"\n`;
});
data.Cols.forEach(row => {
    const location = data.varName.find(varName => varName.Name.endsWith(`R${row.index}`))?.Location || '';
    // Append row details to respective steps
    steps[5] += `X "${row.index}"\n`;
    steps[4] += `X "${row.title}"\n`;
});
// Concatenate all steps
tb += steps.join('');
}
else
{
    data.Rows.forEach((row,ind) => {
        
        tb += `R ${row.title}\t\t       ;R({${ind+3}},1)\n`;
    });
    const steps = ['\nX STEP 1\n', '\nX STEP 2\n', '\nX STEP 3\n'];
data.Cols.forEach(row => {
    debugger;
    const location = data.varName.find(varName => varName.Name.endsWith(`R${row.index}`))?.Location || '';
    // Append row details to respective steps
    steps[0] += `X "${row.index}"\n`;
    steps[1] += `X "${row.title}"\n`;
    steps[2] += `X "${location}"\n`;
});

tb += steps.join('');
}
}
    

    return tb;
}
const checkgpt= async () =>{
    const response = await fetch(`${config.API_BASE_URL}/chatgpt`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: "Am I connected"})
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
}

    return (

<div className="variable-properties">
    
            {/* Tabulation Syntax Display Section */}
            {selectedVariable && selectedVariable.tb && (
                <div className="tabulation-syntax-display">
                    <h2>Generated Syntax</h2>
                    <pre>{selectedVariable.tb}</pre>
                </div>
            )}
            <button onClick={saveChanges}>Save Changes</button>
            <button onClick={checkgpt}>Save Changes</button>
            <h2>Properties</h2>
            {selectedVariable && (
                <div className="properties-container">
                    <div className="checkbox-properties">
                        {Object.entries(selectedVariable).map(([property, value]) => (
                            isBoolean(property) && !value.type && (
                    
                    <div key={property} className="property-item">
                                    <label>{property}</label>
                                    <input
                                        type="checkbox"
                                        checked={value}
                                        onChange={(e) => handlePropertyChange(e, property)}
                                    />
                                </div>
                            )
                        ))}
                        {Object.entries(selectedVariable).map(([property, value]) => (
                            isBoolean(property) && value.type && value.type.includes(selectedVariable.type) && (
                    
                    <div key={property} className="property-item">
                                    <label>{property}</label>
                                    <input
                                        type="checkbox"
                                        checked={value.selected}
                                        onChange={(e) => handlePropertyChange(e, property)}
                                    />
                                </div>
                            )
                        ))}
                    </div>
                    <div className="text-properties">
                        {Object.entries(selectedVariable).map(([property, value]) => (
                            !isBoolean(property) && property !== 'error' && property !== 'order' && property !== 'table' && property !== 'values' && property !== 'varName' && property !== 'Cols' && property !== 'Rows' && property !== 'valueLabels' && (
                                <div key={property} className="property-item">
                                    <label>{property}</label>
                                    <input
                                        type="text"
                                        value={Array.isArray(value) ? value.map(obj => obj.title).join(', ') : value}
                                        onChange={(e) => handlePropertyChange(e, property)}
                                    />
                                </div>
                            )
                        ))}
                    </div>
                    {/* Full-length list for Cols */}
                    {Object.entries(selectedVariable).map(([property, value]) => (
                        property === 'valueLabels'  && Object.entries(property).length>0 && (
                            <div key={property}>
                                {/* <TableSettingModal
                                    isOpen={isModalOpen && modalDataType === 'valueLabels'}
                                    onClose={closeModalAndUpdateButtons}
                                    rows={value}
                                    onRowsChange={handlevalueLabelsChange}
                                    typeofproperty={'valueLabels'}
                                    createNet={createNet}
                                    netLabel={netLabel}
                                    setNetLabel={setNetLabel}
                                />
                                <button onClick={() => toggleModal('valueLabels')}>Edit Value Labels</button> */}
                            </div>
                        )
                    ))}
                    {Object.entries(selectedVariable).map(([property, value]) => (
                        property === 'values' && value.length > 0 && (
                            <div key={property}>
                                <TableSettingModal
                                    isOpen={isModalOpen && modalDataType === 'values'}
                                    onClose={closeModalAndUpdateButtons}
                                    rows={value}
                                    onRowsChange={handlevaluesChange}
                                    createNet={createNet}
                                    netLabel={netLabel}
                                    setNetLabel={setNetLabel}
                                />
                                <button onClick={() => toggleModal('values')}>Edit Values</button>
                            </div>
                        )
                    ))}
                    {Object.entries(selectedVariable).map(([property, value]) => (
                        property === 'Cols' && value.length > 0 && (
                            <div key={property}>
                                <TableSettingModal
                                    isOpen={isModalOpen && modalDataType === 'cols'}
                                    onClose={closeModalAndUpdateButtons}
                                    rows={value}
                                    onRowsChange={handleColsChange}
                                    createNet={createNet}
                                    netLabel={netLabel}
                                    setNetLabel={setNetLabel}
                                />
                                <button onClick={() => toggleModal('cols')}>Edit Cols</button>
                            </div>
                        )
                    ))}
                    {/* Full-length list for Rows with label on top */}
                    {Object.entries(selectedVariable).map(([property, value]) => (
                        property === 'Rows' && value.length > 0 && (
                            <div key={property}>
                                <TableSettingModal
                                    isOpen={isModalOpen && modalDataType === 'rows'}
                                    onClose={closeModalAndUpdateButtons}
                                    rows={value}
                                    onRowsChange={handleRowsChange}
                                    createNet={createNet}
                                    netLabel={netLabel}
                                    setNetLabel={setNetLabel}
                                />
                                <button onClick={() => toggleModal('rows')}>Edit Rows</button>
                            </div>
                        )
                    ))}
                    
                </div>
            )}
            <button onClick={saveChanges}>Save Changes</button>
            

        </div>
    );
};

export default PropertiesComponent;