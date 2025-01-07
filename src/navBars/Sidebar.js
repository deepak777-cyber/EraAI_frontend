import React, { useContext,useState } from 'react';
import { Link } from 'react-router-dom';
import './styles/Sidebar.css';
import VariableContext from '../contexts/VariableContext';
import FetchingFreq from '../contexts/FetchingFreq';
function Sidebar() {
    const { dataGroup,setcurrentSelectedVariablesset,currentSelectedVariablesset } = useContext(VariableContext);
    const { handleSelectionChange,activePage,handleTitleClick,isModalOpen,addQuestion,rows, setRows,setColumns, setIsModalOpen,setSelectedTitle,setSelectedVariable } = useContext(FetchingFreq);

  const onTitleClick = async (title,qgroupEntry) => {
if(activePage=="Weighting")
{
    const selection = [...currentSelectedVariablesset, ...qgroupEntry.varName.map(x=>x.Name)];
    setcurrentSelectedVariablesset(selection);
}
else if(activePage=="Banner")
{
    handleSelectionChange(title,qgroupEntry);
}
else if(activePage=="dashboard")
  {
      setSelectedVariable(qgroupEntry);
  }
else if(activePage=="tables")
    {
        handleTitleClick(title);
    }
    else if(activePage=="analysis")
        {
            const selection = [...currentSelectedVariablesset, ...qgroupEntry.varName.map(x=>x.Name)];
            setcurrentSelectedVariablesset(selection);
        }
        else if(activePage=="survey")
            {
                setSelectedVariable(qgroupEntry);
                setRows(qgroupEntry.rows);
                setColumns(qgroupEntry.columns);
                setSelectedTitle(title);
            }
  };
    const renderQGroupTitles = () => {
      console.log(dataGroup);
        if (dataGroup) {
          return Object.entries(dataGroup).map(([title, qgroupEntry]) => (
            <li
              key={title}
              className="custom-list-item"
              onClick={() => onTitleClick(title,qgroupEntry)}
            >
              {qgroupEntry.title || title}
            </li>
          ));
        }
      };
      

    const toggleModal = () => {
        addQuestion();
        setIsModalOpen(prev => !prev);
      };

    return (
        <div className="custom-scrollbar" style={{ width: '18%', overflowY: 'auto', maxHeight: '825px',marginLeft:'0px',paddingRight:'5px',paddingLeft:'5px' }}>
        
        {activePage=="survey" && (<button onClick={() => toggleModal()} className="add-question-btn">Add Question</button>)}
        <ul className="custom-list">
          {renderQGroupTitles()}
        </ul>
        {isModalOpen}
      </div>
    );
}

export default Sidebar;
