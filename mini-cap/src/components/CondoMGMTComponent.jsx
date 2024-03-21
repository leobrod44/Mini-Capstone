import React, {useEffect} from 'react';
import PropTypes from 'prop-types';
import "../styling/CondoComponent.css";
import  { useState} from "react";
import Popup_SendKey from './Popup_SendKey';
import {useNavigate} from "react-router-dom";
import { getCondoOccupant } from "../backend/PropertyHandler";

/**
 * Represents a component for displaying details of a condo unit in the management interface.
 * Displays unit information such as unit number, picture, parking spot, locker, and occupant.
 * Allows sending a key if no occupant is present.
 * @param {string} picture - URL of the unit picture.
 * @param {string} unitNumber - The unit number of the condo.
 * @param {string} parkingNumber - The parking spot number associated with the unit.
 * @param {string} lockerNumber - The locker number associated with the unit.
 * @param {string} condoId - The ID of the condo.
 * @returns {JSX.Element} The rendered CondoMgmtComponent.
 */
const CondoMgmtComponent = ({picture, unitNumber, parkingNumber, lockerNumber, condoId}) => {

    /**
     * Provides navigation functionality for routing within the application.
     * Allows navigating to different pages or routes within the application.
     * @type {Function} navigate - Function to trigger navigation to a specified route.
     */
    const navigate = useNavigate();

    /**
     * Manages the visibility state of popup component send key.
     * Indicates whether the popup component is currently visible or hidden.
     * @type {[boolean, Function]} showPopup - A state variable representing the visibility of the send key component and a function to update its state.
     */
    const [showPopup, setShowPopup] = useState(false);

    /**
     * Toggles the visibility state of the send key popup component.
     * If the popup is currently hidden, it sets the state to visible, and vice versa.
     * @returns {void}
     */
    const handlePopupToggle = () => {
        setShowPopup(!showPopup);
    };

    /**
     * Manages the value of the occupant for the condo unit.
     * Represents the name or identifier of the current occupant of the unit.
     * @type {[string, Function]} occupantValue - A state variable representing the value of the occupant and a function to update its state.
     */
    const [occupantValue, setOccupantValue] = useState("");

    /**
     * Fetches data related to the occupant of the condo unit.
     * Retrieves the occupant information asynchronously using the condoId.
     * Updates the occupantValue state with the fetched result.
     * Executes once when the component mounts and whenever the condoId changes.
     * @returns {void}
     */
    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await getCondoOccupant(condoId);
                setOccupantValue(result);
            } catch (error) {
                console.error('Error fetching occupant:', error);
            }
        };
        fetchData();
    }, [condoId]);

    return (
        <div className="condo-details-container">
            <div className="condo-info">
                <div className='condo-name-user-tag'>
                    <h2>{unitNumber}</h2>
                </div>

                {picture && <img src={picture} alt="Profile" className="profile-picture"/>}
                <p>Unit Number: {unitNumber}</p>
                <div className='parking-send-key'>
                    {parkingNumber && <p>Parking Spot: {parkingNumber}</p>}
                    {occupantValue === "" && (
                        <button className="details-button" onClick={handlePopupToggle} data-testid="send-key-button">
                            Send Key
                        </button>
                    )}

                </div>
                <div className='locker-details'>
                    {lockerNumber && <p>Locker: {lockerNumber}</p>}
                    <button className="details-button" onClick={() => navigate(`/condo-details/${condoId}`)}>Details
                    </button>
                </div>
            </div>
            {showPopup && <Popup_SendKey handleClose={handlePopupToggle} condoId={condoId}/>}
        </div>

    );
};

/**
 * Defines the prop types for the CondoMgmtComponent.
 * Specifies the expected types for each prop used in the component.
 * @type {object} CondoMgmtComponent.propTypes - The prop types object for the CondoMgmtComponent.
 */
CondoMgmtComponent.propTypes = {
    picture: PropTypes.string,
    parkingNumber: PropTypes.string,
    lockerNumber: PropTypes.string,
    property: PropTypes.string,
    squareFeet: PropTypes.string,
    unitNumber: PropTypes.string.isRequired,
    unitPrice: PropTypes.string,
    unitSize: PropTypes.string,
    condoId:PropTypes.string,
};


export default CondoMgmtComponent;