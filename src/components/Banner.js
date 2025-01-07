import React, { useState, useContext, useEffect } from 'react'; 
import VariableContext from '../contexts/VariableContext'; 
import FetchingFreq from '../contexts/FetchingFreq';
import config from '../configs/config'; 
import './styles/ManageCrossBreaks.css'; 
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faPlusCircle, faTimes } from '@fortawesome/free-solid-svg-icons';

function Banner() {
    const { dataGroup, projectId, banners, setBanners } = useContext(VariableContext);
    const { activePage, setActivePage, selectedBannerIndex, setSelectedBannerIndex, isTotal, setIsTotal } = useContext(FetchingFreq);
    const [sigLetters, setSigLetters] = useState(banners && banners[selectedBannerIndex] ? banners[selectedBannerIndex].sigcompare : '');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setActivePage("Banner");
    }, [setActivePage]);

    useEffect(() => {
        if (banners && banners[selectedBannerIndex]) {
            setSigLetters(banners[selectedBannerIndex].sigcompare || '');
            
        }
    }, [selectedBannerIndex, banners]);

    const removeRowFromBanner = (bannerIndex, rowIndex) => {
        const updatedBanners = banners.map((banner, index) => {
            if (index === bannerIndex) {
                return {
                    ...banner,
                    rows: banner.rows.filter((_, rIndex) => rIndex !== rowIndex)
                };
            }
            return banner;
        });
        setBanners(updatedBanners);
    };

    const selectBanner = (bannerIndex) => {
        setSelectedBannerIndex(bannerIndex);
    };

    const renderTabs = () => {
        if (banners) {
            return banners.map((banner, index) => (
                <button key={index} onClick={() => selectBanner(index)}>
                    {banner.name || `Banner ${index + 1}`}
                </button>
            ));
        }
    };

    const addBanner = () => {
        const newIndex = banners.length + 1;
        const newBanner = {
            name: `Banner ${newIndex}`,
            rows: [{"headerText":"Total","text":"Total","letter":"A","logic":"ALL"}],
            minbase: '',  // Initialize minbase
            lowbase: '',   // Initialize lowbase
            minbaseSymbol: '**',  // Initialize minbase
            lowbaseSymbol: '*',   // Initialize lowbase
            isCompliment:false
        };
        setBanners([...banners, newBanner]);
    };

    const handleBannerNameChange = (bannerIndex, newName) => {
        const updatedBanners = banners.map((banner, index) => {
            if (index === bannerIndex) {
                return { ...banner, name: newName };
            }
            return banner;
        });
        setBanners(updatedBanners);
    };

    const handleMinBaseChange = (bannerIndex, value) => {
        const updatedBanners = banners.map((banner, index) => {
            if (index === bannerIndex) {
                return { ...banner, minbase: value };
            }
            return banner;
        });
        setBanners(updatedBanners);
    };
    const handleMinBaseSymbolChange = (bannerIndex, value) => {
        const updatedBanners = banners.map((banner, index) => {
            if (index === bannerIndex) {
                return { ...banner, minbaseSymbol: value };
            }
            return banner;
        });
        setBanners(updatedBanners);
    };
    const handleIsTotalChange = (bannerIndex, value) => {
        const updatedBanners = banners.map((banner, index) => {
            if (index === bannerIndex) {
                return { ...banner, isTotal: value };
            }
            return banner;
        });
        setBanners(updatedBanners);
    };
    const handleIsComplimentChange = (bannerIndex, value) => {
        const updatedBanners = banners.map((banner, index) => {
            if (index === bannerIndex) {
                return { ...banner, isCompliment: value };
            }
            return banner;
        });
        setBanners(updatedBanners);
    };
    const handleLowBaseChange = (bannerIndex, value) => {
        const updatedBanners = banners.map((banner, index) => {
            if (index === bannerIndex) {
                return { ...banner, lowbase: value };
            }
            return banner;
        });
        setBanners(updatedBanners);
    };
    const handleLowBaseSymbolChange = (bannerIndex, value) => {
        const updatedBanners = banners.map((banner, index) => {
            if (index === bannerIndex) {
                return { ...banner, lowbaseSymbol: value };
            }
            return banner;
        });
        setBanners(updatedBanners);
    };

    const addRowToBanner = (bannerIndex) => {
        const newRow = { headerText: '', text: '', logic: '' };
        const updatedBanners = banners.map((banner, index) => {
            if (index === bannerIndex) {
                return {
                    ...banner,
                    rows: [...banner.rows, newRow]
                };
            }
            return banner;
        });
        setBanners(updatedBanners);
    };

    const handleRowChange = (bannerIndex, rowIndex, key, value) => {
        const updatedBanners = banners.map((banner, bIndex) => {
            if (bIndex === bannerIndex) {
                const updatedRows = banner.rows.map((row, rIndex) => {
                    if (rIndex === rowIndex) {
                        return { ...row, [key]: value };
                    }
                    return row;
                });
                return { ...banner, rows: updatedRows };
            }
            return banner;
        });
        setBanners(updatedBanners);
    };

    const getAlphabeticIdentifier = (index) => {
        
        let identifier = '';
        while (index >= 0) {
            identifier = String.fromCharCode(((index) % 26) + 65) + identifier;
            index = Math.floor(index / 26) - 1;
        }
        return identifier;
    };

    const updateLetters = (bannerIndex, newletters) => {
        setSigLetters(newletters);
        const updatedBanners = banners.map((banner, index) => {
            if (index === bannerIndex) {
                return { ...banner, sigcompare: newletters };
            }
            return banner;
        });
        setBanners(updatedBanners);
    };

    const generateSigLetters = () => {
        if (!banners || banners.length === 0 || !banners[selectedBannerIndex]) return '';
        let letternew = '';
        let prevHeader = null;

        const updatedBanners = banners.map((banner, bannerIndex) => {
            if (bannerIndex === selectedBannerIndex) {
                const updatedRows = banner.rows.map((row, index) => {
                    const letter = getAlphabeticIdentifier(index);
                    if (prevHeader && row.headerText !== prevHeader) {
                        letternew += ' / ';
                    } else if (letternew) {
                        letternew += ', ';
                    }
                    letternew += letter;
                    prevHeader = row.headerText;

                    return { ...row, letter };
                });

                return { ...banner, rows: updatedRows, sigcompare: letternew };
            }
            return banner;
        });

        setBanners(updatedBanners);
        setSigLetters(letternew);
        return letternew;
    };

    const renderSelectedBanner = () => {
        if (banners && selectedBannerIndex !== null) {
            const selectedBanner = banners[selectedBannerIndex];
            return (
                <div key={selectedBannerIndex}>
                    <input
                        type="text"
                        value={selectedBanner.name}
                        onChange={(e) => handleBannerNameChange(selectedBannerIndex, e.target.value)}
                        placeholder="Enter Banner Name"
                    />
                    <button onClick={() => generateSigLetters()}>
                        <FontAwesomeIcon icon={faPlusCircle} /> Add Sig Test
                    </button>

                    {/* Add inputs for minbase and lowbase */}
                    <div>
                        <label>Min Base: </label>
                        <input 
                            type="number" 
                            value={selectedBanner.minbase || ''} 
                            onChange={(e) => handleMinBaseChange(selectedBannerIndex, e.target.value)} 
                            placeholder="Enter Min Base" 
                        />
                        <input 
                            type="text" 
                            value={selectedBanner.minbaseSymbol || '*'} 
                            onChange={(e) => handleMinBaseSymbolChange(selectedBannerIndex, e.target.value)} 
                            placeholder="Symbol Min Base" 
                        />
                    </div>
                    <div>
                        <label>Low Base: </label>
                        <input 
                            type="number" 
                            value={selectedBanner.lowbase || ''} 
                            onChange={(e) => handleLowBaseChange(selectedBannerIndex, e.target.value)} 
                            placeholder="Enter Low Base" 
                        />
                        <input 
                            type="text" 
                            value={selectedBanner.lowbaseSymbol || '**'} 
                            onChange={(e) => handleLowBaseSymbolChange(selectedBannerIndex, e.target.value)} 
                            placeholder="Symbol Low Base" 
                        />
                    </div>

                    <div className="toggle-switch">
                        {banners[selectedBannerIndex].isTotal}
                        <input 
                            type="checkbox" 
                            id="toggle" 
                            checked={banners[selectedBannerIndex].isCompliment} 
                            onChange={(e) => handleIsComplimentChange(selectedBannerIndex,e.target.checked)} 
                        />
                        <label htmlFor="toggle" className="toggle-label"></label>
                        <span className="toggle-text">Compliment Test</span>
                    </div>
                    <input 
                        type="text" 
                        onChange={(e) => updateLetters(selectedBannerIndex, e.target.value)}  
                        value={sigLetters} 
                    />
                    
                    {/* Render rows as before */}
                    <table>
                        <thead>
                            <tr>
                                <th>Header Text</th>
                                <th>Text</th>
                                <th>Logic</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {selectedBanner && selectedBanner.rows.map((row, rowIndex) => (
                                <tr key={rowIndex}>
                                    <td>
                                        <input
                                            type="text"
                                            value={row.headerText}
                                            onChange={(e) => handleRowChange(selectedBannerIndex, rowIndex, 'headerText', e.target.value)}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            value={`${row.text} [${getAlphabeticIdentifier(rowIndex)}]`}
                                            onChange={(e) => handleRowChange(selectedBannerIndex, rowIndex, 'text', e.target.value)}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            value={row.logic}
                                            onChange={(e) => handleRowChange(selectedBannerIndex, rowIndex, 'logic', e.target.value)}
                                        />
                                    </td>
                                    <td>
                                        <button onClick={() => removeRowFromBanner(selectedBannerIndex, rowIndex)}>
                                            <FontAwesomeIcon icon={faTimes} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <button onClick={() => addRowToBanner(selectedBannerIndex)}>
                        <FontAwesomeIcon icon={faPlusCircle} /> Add Banner Point
                    </button>
                </div>
            );
        }
        return null;
    };

    const saveBannersToBackend = async () => {
        setIsLoading(true);
        try {
            const response = await axios.post(config.API_BASE_URL + '/savebanner', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                banner: JSON.stringify(banners),
                project_id: projectId
            });
            const data = response.data;
            if (response.ok) {
                console.log('Banners saved, unique code:', data.code);
                setIsLoading(false);
            } else {
                console.error('Failed to save banners:', data);
                setIsLoading(false);
            }
        } catch (error) {
            console.error('Error saving banners:', error);
            setIsLoading(false);
        }
    };

    return (
        <div className="manage-cross-breaks">
            <div className="workspace">
                {isLoading ? (
                    <>Loading...</>
                ) : (
                    <>
                        <button onClick={addBanner}>
                            <FontAwesomeIcon icon={faPlus} /> Add Banner
                        </button>
                        <button onClick={saveBannersToBackend}>Save Banners</button>
                        <div className="tabs">
                            {renderTabs()}
                        </div>
                        <div className="selected-banner">
                            {renderSelectedBanner()}
                        </div>
                        <button onClick={saveBannersToBackend}>Save Banners</button>
                    </>
                )}
            </div>
        </div>
    );
}

export default Banner;
