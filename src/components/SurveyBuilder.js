import React, { useContext, useState, useEffect } from 'react';
import Modal from 'react-modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import config from '../configs/config';

import { faEllipsisV, faTrashAlt, faGripLines } from '@fortawesome/free-solid-svg-icons';

import './styles/SurveyBuilder.css';
import VariableContext from '../contexts/VariableContext';
import FetchingFreq from '../contexts/FetchingFreq';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import RowColumnComponent from './RowColumnComponent';
import HoverDropdown from './HoverDropdown';
const SurveyBuilder = () => {
    const { dataGroup,setdataGroup,selectedVariables,banners,setBanners, setSelectedVariables, projectId, savedWeightings, saveCurrentWeighting, currentSelectedVariablesset, setcurrentSelectedVariablesset, setSavedWeightings, weightedCounts, weightingStats, setWeightingStats, setWeightedCounts, targetPercentages, setTargetPercentages, currentSelectedVariables, setCurrentSelectedVariables, frequencyData, setFrequencyData,setSelectedClient, setSelectedProject, selectedProject,selectedClient } = useContext(VariableContext);
    const { setActivePage,handleTitleClick,selectedTitle,isModalOpen,rows, setRows,columns, setColumns, setIsModalOpen, setSelectedTitle,refreshData, setRefreshData,selectedBanner, setselectedBanner,selectedWeights, setSelectedWeights,selectedVariable, setSelectedVariable,loading, setLoading,list, setList } = useContext(FetchingFreq);
    const [activeTab, setActiveTab] = useState('rows'); // State for tracking the active tab
    const [questions, setQuestions] = useState({});
    
    const [questionType, setQuestionType] = useState([{'type':"1", 'text':"SingleResponse"},{'type':"2",'text':"MultipleResponse"},{'type':"3",'text':"SingleGrid"},{'type':"4",'text':"MultiGrid"},{'type':"5",'text':"Numeric"},{'type':"6",'text':"String"}]);
    const [currentQuestionKey, setCurrentQuestionKey] = useState(null);

    const [questionTitle, setQuestionTitle] = useState('');
    const [questionInstruction, setQuestionInstruction] = useState('');
    
    useEffect(()=>{
        setActivePage("survey");
    },[]);
    
    const addQuestion = () => {
        const nextKey = dataGroup? `Q${Object.keys(dataGroup).length + 1}`: 'Q1';
        setdataGroup({ ...dataGroup, [nextKey]: { Qtitle: '', instructions: '', rows: [] } });
        setRows([{ id: 'r1', text: '' }]);
        setColumns([]);
        setSelectedTitle(nextKey);
        setSelectedVariable({ Qtitle: '', instructions: '', rows: [] } );
        setIsModalOpen(true); // Open the SurveyElements popup
    };
    const addList = (label) => {
        const key = `${selectedTitle}${label}`;
    const statements=label=='Rows'?rows:columns;
        setList(prevList => {
            // Check if the key already exists in the list
            const index = prevList.findIndex(item => Object.keys(item)[0] === key);
    
            if (index !== -1) {
                // Update the existing item in the list
                return prevList.map((item, i) =>
                    i === index ? { [key]: [...statements] } : item
                );
            } else {
                // Add a new item to the list
                return [...prevList, { [key]: [...statements] }];
            }
        });
    };
    
    
    const OpenProperties = () => {
        
        setIsModalOpen(true); // Open the SurveyElements popup
    };
    const handleTitleChange = (property, e) => {
        let value;
        if(property=='type')
            value=e;
        else
        value=e.target.value;
        const updatedVariable = { ...selectedVariable, [property]: value };
        setSelectedVariable(updatedVariable);
        const updatedDataGroup = { ...dataGroup, [selectedTitle]: updatedVariable };
        setdataGroup(updatedDataGroup);
    };

    const addRow = () => {
        const newRow = { id: rows.length + 1, text: `` };
        setRows([...rows, newRow]);
    };

    const handleRowChange = (index, value) => {
        const updatedRows = [...rows];
        updatedRows[index].text = value;
        setRows(updatedRows);
        const updatedVariable = { ...selectedVariable, rows: updatedRows };
        setSelectedVariable(updatedVariable);
        setdataGroup(prev => ({ ...prev, [selectedTitle]: updatedVariable }));
    };
    const handlePaste = (e, type) => {
        e.preventDefault();
        const pastedText = e.clipboardData.getData('Text');
        const newItems = pastedText.split('\n').filter(text => text.trim() !== '').map((text, index) => ({
            id: type === 'rows' ? `r${rows.length + index}` : `c${columns.length + index}`,
            text: text.trim()
        }));

        let updatedItems;
        if (type === 'rows') {
            if (rows.length === 1 && rows[0].text === '') {
                updatedItems = [...newItems];
            } else {
                updatedItems = [...rows, ...newItems];
            }
            setRows(updatedItems);
            setSelectedVariable({ ...selectedVariable, rows: updatedItems });
        } else if (type === 'columns') {
            if (columns.length === 1 && columns[0].text === '') {
                updatedItems = [...newItems];
            } else {
                updatedItems = [...columns, ...newItems];
            }
            setColumns(updatedItems);
            setSelectedVariable({ ...selectedVariable, columns: updatedItems });
        }

        setdataGroup(prev => ({
            ...prev,
            [selectedTitle]: { ...selectedVariable, [type]: updatedItems }
        }));
    };
    const addadditionalRow = (label) => {
        let newItem;
        let updatedItems;
        if (label === 'Rows') 
        {
            newItem = { id: `r${rows? rows.length + 1: 1}`  , text: `` };
            updatedItems=[...rows,newItem]
            setRows([...rows,newItem]);
        }
        else if (label === 'Columns') 
        {
            newItem = { id: `c${columns? columns.length + 1: 1}`  , text: `` };
            updatedItems=[...columns,newItem]
            setColumns([...columns,newItem]);
        }
        setSelectedVariable({ ...selectedVariable, [label]: updatedItems });
        setdataGroup(prev => ({
            ...prev,
            [selectedTitle]: { ...selectedVariable, [label]: updatedItems }
        }));
        
    };
    const savePropertyChanges = (rows,label) => {
        
        if (label === 'Rows') 
        {
            setRows(rows);
        }
        else if (label === 'Columns') 
        {
            setColumns(rows);
        }
        setSelectedVariable({ ...selectedVariable, [label.toLowerCase()]: rows });
        setdataGroup(prev => ({
            ...prev,
            [selectedTitle]: { ...selectedVariable, [label.toLowerCase()]: rows }
        }));
        
    };
    const deleteRow = (index) => {
        const updatedRows = rows.filter((_, i) => i !== index);
        setRows(updatedRows);

        // Update in dataGroup
        setSelectedVariable({ ...selectedVariable, rows: updatedRows });
        setdataGroup(prev => ({ ...prev, [selectedTitle]: { ...selectedVariable, rows: updatedRows } }));
    };
    const downloadTxtFile = (e) => {
        
        
                fetch(`${config.API_BASE_URL}/generate-titles`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ projectId,'dataList': dataGroup,banners,'project': JSON.stringify(selectedProject), 'client': JSON.stringify(selectedClient),'type': e })
                })
                .then(response => response.json())
                .then(data => {
                  //fetchContents();
                    console.log('Success:', data);
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
            };
        
    const handleDragEnd = (result) => {
        if (!result.destination) return;
        const updatedRows = Array.from(rows);
        const [movedRow] = updatedRows.splice(result.source.index, 1);
        updatedRows.splice(result.destination.index, 0, movedRow);
        setRows(updatedRows);

        // Update in dataGroup
        setSelectedVariable({ ...selectedVariable, rows: updatedRows });
        setdataGroup(prev => ({ ...prev, [selectedTitle]: { ...selectedVariable, rows: updatedRows } }));
    };
    return (
        <div className="survey-builder">
            {selectedTitle} - {selectedVariable?.type}
            <button onClick={() => downloadTxtFile()} title='Update Properties'>Export</button>
            <div className='hoverDropdown'>
            <HoverDropdown handleTitleChange={handleTitleChange} text={"Select type"} exportfeatures={questionType} feature={5}/>
            </div>
            <h2>Survey Builder</h2>
            
            {/* <SurveyElements
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                questions={questions}
                isModalOpen={isModalOpen}
                setQuestions={setQuestions}
                addQuestion={addQuestion}
            /> */}
 <div >
                {selectedTitle && (
                    <>
                        <div className="question-header">
                            <input
                                type="text"
                                value={selectedVariable?.Qtitle || ''}
                                onChange={(e) => handleTitleChange('Qtitle', e)}
                                placeholder="Question Title"
                                className="question-title-input"
                            />
                            <input
                                type="text"
                                value={selectedVariable?.instructions || ''}
                                onChange={(e) => handleTitleChange('instructions', e)}
                                placeholder="Instructions"
                                className="question-instruction-input"
                            />
                            <input
                                type="text"
                                value={selectedVariable?.logics || ''}
                                onChange={(e) => handleTitleChange('logics', e)}
                                placeholder="Logic"
                                className="question-instruction-input"
                            />
                        </div>
                        <div className="tabs">
    <button
        className={activeTab === 'rows' ? 'active' : ''}
        onClick={() => setActiveTab('rows')}
    >
        Rows
    </button>
    <button
        className={activeTab === 'columns' ? 'active' : ''}
        onClick={() => setActiveTab('columns')}
    >
        Columns
    </button>
</div>
          {/* Conditional Rendering of Rows or Columns */}
          {activeTab === 'rows' && (
                <RowColumnComponent
                    items={rows}
                    addadditionalRow={addadditionalRow}
                    label="Rows"
                    savePropertyChanges={savePropertyChanges}
                    handlePaste={(e) => handlePaste(e, 'rows')}
                    addList={addList}
                    list={list}
                />
            )}
            {activeTab === 'columns' && (
                <RowColumnComponent
                    items={columns}
                    addadditionalRow={addadditionalRow}
                    label="Columns"
                    savePropertyChanges={savePropertyChanges}
                    handlePaste={(e) => handlePaste(e, 'columns')}
                    addList={addList}
                    list={list}
                />
            )}
                    </>
                )}
            </div>
        </div>
    );
};
export default SurveyBuilder;
