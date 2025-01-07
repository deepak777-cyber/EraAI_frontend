import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faGripLines, faCog } from '@fortawesome/free-solid-svg-icons';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { ListGroup } from 'react-bootstrap';
import HoverDropdown from './HoverDropdown';
import RowColumnProperties from './RowColumnProperties';
import './styles/RowColumnComponent.css';

const RowColumnComponent = ({ items, setItems, label, handlePaste, addList, addadditionalRow, list, savePropertyChanges }) => {
    const [selectedItem, setSelectedItem] = useState(null);
    const [itemIndex, setItemIndex] = useState(null); // Add state for itemIndex
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openPropertiesModal = (item, index) => {
        setSelectedItem(item);
        setItemIndex(index); // Set the index when opening the modal
        setIsModalOpen(true);
    };

    const handlePropertyChange = (index, property, value) => {
        // Update the selectedItem state
        setSelectedItem({ ...selectedItem, [property]: value });

        // Update the item in the items array using index
        const updatedItems = [...items]; // Create a shallow copy of the items array
        updatedItems[index] = { ...updatedItems[index], [property]: value };

        // Call the function to save the changes (e.g., update the parent state)
        savePropertyChanges(updatedItems, label);
    };

    const handleItemChange = (index, value) => {
        const updatedItems = [...items];
        updatedItems[index].text = value;
        savePropertyChanges(updatedItems, label);
    };

    const addItem = () => {
        const newItem = { id: `${label === 'Rows' ? 'r' : 'c'}${items ? items.length + 1 : 1}`, text: '' };
        if (items) {
            setItems([...items, newItem]);
        } else {
            setItems([newItem]);
        }
    };

    const deleteItem = (index) => {
        const updatedItems = items.filter((_, i) => i !== index);
        setItems(updatedItems);
    };

    const handleDragEnd = (result) => {
        if (!result.destination) return;
        const updatedItems = Array.from(items);
        const [movedItem] = updatedItems.splice(result.source.index, 1);
        updatedItems.splice(result.destination.index, 0, movedItem);
        setItems(updatedItems);
    };

    return (
        <div className={`${label.toLowerCase()}-section`}>
            <h4>{label}</h4>
            <div>
                {items && (<button onClick={() => addList(label)} title='Save to List'>Save List</button>)}
                <div className='hoverDropdown'>
                    <HoverDropdown text={"Select type"} exportfeatures={list} feature={6} />
                </div>
            </div>
            <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId={label.toLowerCase()}>
                    {(provided) => (
                        <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            onPaste={(e) => handlePaste(e, label)}
                        >
                            {items && items.map((item, index) => (
                                <Draggable key={index} draggableId={`${label.toLowerCase()}-${index}`} index={index}>
                                    {(provided) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            className="row-item"
                                        >
                                            <div className="row-grip" {...provided.dragHandleProps}>
                                                <FontAwesomeIcon icon={faGripLines} />
                                            </div>
                                            <input
                                                type="text"
                                                value={item.text}
                                                onChange={(e) => handleItemChange(index, e.target.value)}
                                                placeholder={`${label} #${index + 1}`}
                                                className="row-input"
                                            />
                                            <button className="row-delete-btn" onClick={() => deleteItem(index)}>
                                                <FontAwesomeIcon icon={faTrashAlt} />
                                            </button>
                                            <button className="row-properties-btn" onClick={() => openPropertiesModal(item, index)}>
                                                <FontAwesomeIcon icon={faCog} />
                                            </button>
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
            <button onClick={() => addadditionalRow(label)} className="add-row-btn">
                + New {label}
            </button>
            <RowColumnProperties
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                item={selectedItem}
                index={itemIndex} // Pass itemIndex here
                handlePropertyChange={handlePropertyChange}
            />
        </div>
    );
};

export default RowColumnComponent;
