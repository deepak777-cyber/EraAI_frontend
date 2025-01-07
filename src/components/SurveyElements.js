import React, { useState } from 'react';
import { FaCheckSquare, FaThLarge, FaDotCircle, FaList, FaTh } from 'react-icons/fa';
import './styles/SurveyElements.css';

function SurveyElements({ onClose,isModalOpen,addQuestion }) {
    const [selectedElement, setSelectedElement] = useState('Single Select');

    const elements = [
        { name: 'Single Select', icon: <FaDotCircle />, description: 'Participants may only select one answer option.' },
        { name: 'Multi-Select', icon: <FaCheckSquare />, description: 'Participants can select multiple options.' },
        { name: 'Dropdown Menu', icon: <FaList />, description: 'A dropdown menu for participants to choose from.' },
        { name: 'Button Single Select', icon: <FaThLarge />, description: 'Buttons for single selection.' },
        { name: 'Single Select Grid', icon: <FaTh />, description: 'Grid layout for single select.' },
        { name: 'Button Single Select Grid', icon: <FaThLarge />, description: 'Grid of buttons for single selection.' },
        { name: 'Button Multi-Select', icon: <FaCheckSquare />, description: 'Grid of buttons for multi-selection.' },
        { name: 'Multi-Select Grid', icon: <FaTh />, description: 'Grid layout for multi-selection.' },
        { name: 'This or That', icon: <FaDotCircle />, description: 'Choose between two options.' },
    ];
    const selectType = () => {
        addQuestion();
        onClose(); // Open the SurveyElements popup
    };

    if (!isModalOpen) return null;
    return (
        <div className="survey-elements-overlay" onClick={onClose}>
            <div className="survey-elements-container" onClick={(e) => e.stopPropagation()}>
                <button className="close-btn" onClick={onClose}>Close</button>
                <div className="sidebar">
                    <h3>Question Types</h3>
                    <ul>
                        <li className="active">Single and Multi Select</li>
                        <li>Open End</li>
                        <li>Rate, Rank, and Sort</li>
                        <li>Stimulus</li>
                        <li>Participant Upload</li>
                        <li>Advanced</li>
                        <li>Logic Elements</li>
                        <li>Structural Elements</li>
                    </ul>
                </div>

                <div className="main-content">
                    <h2>Survey Elements</h2>
                    <div className="elements-grid">
                        {elements.map((el, index) => (
                            <div 
                                key={index} 
                                className={`element-card ${selectedElement === el.name ? 'selected' : ''}`}
                                onClick={() => selectType(el.name)}
                            >
                                <div className="icon">{el.icon}</div>
                                <p className="element-text">{el.name}</p>
                            </div>
                        ))}
                    </div>

                    <div className="element-details">
                        <h3>{selectedElement}</h3>
                        <p>{elements.find(el => el.name === selectedElement).description}</p>
                        <img src="https://via.placeholder.com/150" alt="Example" />
                    </div>

                    <div className="footer">
                        <button className="cancel-btn" onClick={onClose}>Cancel</button>
                        <button className="add-btn">Add</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SurveyElements;