import React, { useState } from 'react';
import './styles/HoverDropdown.css';

function HoverDropdown({
    downloadTxtFile,
    text,
    handleTitleChange,
    exportfeatures,
    handleTabChange,
    setSelectedWeights,
    handleExportTypeChange,
    feature
}) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState(""); // State for tracking the selected option

    const handleMouseEnter = () => {
        setIsDropdownOpen(true);
    };

    const handleMouseLeave = () => {
        setIsDropdownOpen(false);
    };

    const handleSelection = (value, displayText) => {
        setSelectedOption(displayText); // Update selected option to show in UI
        if (feature == 1) {
            downloadTxtFile(value);
        } else if (feature == 2) {
            handleTabChange(value);
        } else if (feature == 3) {
            setSelectedWeights(value);
        } else if (feature == 4) {
            handleExportTypeChange(value);
        } else if (feature == 5 || feature == 6) {
            handleTitleChange('type', displayText);
        }
    };

    return (
        <div className="hover-dropdown" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            <span className="hover-text">
                {selectedOption || text} {/* Display the selected option or default text */}
            </span>
            {isDropdownOpen && (
                <div className="dropdown-menu">
                    {feature == 1 && exportfeatures && exportfeatures.map((x, index) => (
                        <div
                            key={index}
                            className="dropdown-item"
                            onClick={() => handleSelection(x.type, x.text)} // Use handleSelection to update selection
                        >
                            {x.text}
                        </div>
                    ))}
                    {feature == 2 && exportfeatures && exportfeatures.map((x, index) => (
                        <div
                            key={index}
                            className="dropdown-item"
                            onClick={() => handleSelection(x.name, x.name)} // Use handleSelection to update selection
                        >
                            {x.name}
                        </div>
                    ))}
                    {feature == 3 && exportfeatures && Object.keys(exportfeatures).map((x, index) => (
                        <div
                            key={index}
                            className="dropdown-item"
                            onClick={() => handleSelection(x, x)} // Use handleSelection to update selection
                        >
                            {x}
                        </div>
                    ))}
                    {feature == 4 && exportfeatures && exportfeatures.map((x, index) => (
                        <div
                            key={index}
                            className="dropdown-item"
                            onClick={() => handleSelection(x.value, x.text)} // Use handleSelection to update selection
                        >
                            {x.text}
                        </div>
                    ))}
                    {feature == 5 && exportfeatures && exportfeatures.map((x, index) => (
                        <div
                            key={index}
                            className="dropdown-item"
                            onClick={() => handleSelection(x.text, x.text)} // Use handleSelection to update selection
                        >
                            {x.text}
                        </div>
                    ))}
                    {feature == 6 && exportfeatures && exportfeatures.map((x, index) => (
                        <div
                            key={index}
                            className="dropdown-item"
                            onClick={() => handleSelection(Object.keys(x)[0], Object.keys(x)[0])} // Use handleSelection to update selection
                        >
                            {Object.keys(x)[0]}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default HoverDropdown;
