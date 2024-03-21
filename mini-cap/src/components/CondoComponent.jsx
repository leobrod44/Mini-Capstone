import React from 'react';
import PropTypes from 'prop-types';
import "../styling/CondoComponent.css";
import {useNavigate} from "react-router-dom";

/**
 * Represents a component for displaying details of a condo unit.
 * Displays condo unit information such as property name, picture, address, unit number, parking spot number, locker number, user type, and condo ID.
 * Allows navigating to the details page of the condo unit.
 * @param {Object} condo - Object containing details of the condo unit.
 * @param {string} condo.property - Name of the property associated with the condo unit.
 * @param {string} condo.picture - URL of the condo unit picture.
 * @param {string} condo.address - Address of the condo unit.
 * @param {string} condo.unitNumber - Unit number of the condo unit.
 * @param {string} condo.parkingNumber - Parking spot number associated with the condo unit (optional).
 * @param {string} condo.lockerNumber - Locker number associated with the condo unit (optional).
 * @param {string} condo.userType - Type of the user (e.g., Owner, Renter) associated with the condo unit.
 * @param {string} condo.condoId - ID of the condo unit.
 * @returns {JSX.Element} The rendered CondoComponent.
 */
const CondoComponent = ({ condo }) => {

    /**
     * Destructures properties from the condo object for easier access.
     * @type {string} property - Name of the property associated with the condo unit.
     * @type {string} picture - URL of the condo unit picture.
     * @type {string} address - Address of the condo unit.
     * @type {string} unitNumber - Unit number of the condo unit.
     * @type {string} parkingNumber - Parking spot number associated with the condo unit (optional).
     * @type {string} lockerNumber - Locker number associated with the condo unit (optional).
     * @type {string} userType - Type of the user associated with the condo unit (e.g., Owner, Renter).
     * @type {string} condoId - ID of the condo unit.
     */
    const { property, picture, address, unitNumber, parkingNumber, lockerNumber, userType, condoId } = condo;

    /**
     * Provides navigation functionality for routing within the application.
     * Allows navigating to different pages or routes within the application.
     * @type {Function} navigate - Function to trigger navigation to a specified route.
     */
    const navigate = useNavigate();

    /**
     * Determines the CSS class based on the userType.
     * If the userType is 'Owner', assigns the CSS class 'owner', otherwise assigns the CSS class 'renter'.
     * @type {string} userTypeClass - The CSS class determined based on the userType.
     */
    const userTypeClass = userType === 'Owner' ? 'owner' : 'renter';

    return (
        <div className="condo-details-container">
            <div className="condo-info">
                <div className='condo-name-user-tag'>
                    <h2>{property}</h2>
                    <div className={`user-tag ${userTypeClass}`}>{userType}</div>
                </div>
                
                {picture && <img src={picture} alt="Profile" className="profile-picture" />}
                <p>{address}</p>
                <p>Unit Number: {unitNumber}</p>
                {parkingNumber && <p>Parking Spot: {parkingNumber}</p>}
                
                <div className='locker-details'>
                    {lockerNumber && <p>Locker: {lockerNumber}</p>}
                    <button className="details-button" onClick={() => navigate(`/condo-details/${condoId}`)}>Details</button>

                </div>
            </div>
        </div>
    );
};

/**
 * Defines the prop types for the CondoComponent.
 * Specifies the expected types for each prop used in the component.
 * @type {object} CondoComponent.propTypes - The prop types object for the CondoComponent.
 */
CondoComponent.propTypes = {
    condo: PropTypes.shape({
        property: PropTypes.string.isRequired,
        picture: PropTypes.string.isRequired,
        address: PropTypes.string.isRequired,
        unitNumber: PropTypes.string.isRequired,
        parkingNumber: PropTypes.string.isRequired,
        lockerNumber: PropTypes.string.isRequired,
        userType: PropTypes.string.isRequired,
        condoId: PropTypes.string.isRequired
      }).isRequired
};

export default CondoComponent;