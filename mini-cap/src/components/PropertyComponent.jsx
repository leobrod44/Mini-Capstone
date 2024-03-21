import React from 'react';
import PropTypes from 'prop-types';
import "../styling/PropertyComponent.css";
import {  useNavigate } from "react-router-dom";

/**
 * Represents a component for displaying details of a property.
 * Displays property information such as property name, picture, address, unit count, parking count, and locker count.
 * Allows navigating to the details page of the property.
 * @param {Object} property - Object containing details of the property (required).
 * @param {string} property.picture - URL of the property picture (optional).
 * @param {string} property.propertyID - ID of the property (required).
 * @param {string} property.propertyName - Name of the property (required).
 * @param {string} property.address - Address of the property (required).
 * @param {string} property.unitCount - Count of units in the property (required).
 * @param {string} property.parkingCount - Count of parking spots in the property (optional).
 * @param {string} property.lockerCount - Count of lockers in the property (optional).
 * @returns {JSX.Element} The rendered PropertyComponent.
 */
const PropertyComponent = ({ property }) => {

    /**
     * Destructures properties from the property object for easier access.
     * @type {string} picture - URL of the property picture (optional).
     * @type {string} propertyID - ID of the property.
     * @type {string} propertyName - Name of the property.
     * @type {string} address - Address of the property.
     * @type {string} unitCount - Count of units in the property.
     * @type {string} parkingCount - Count of parking spots in the property (optional).
     * @type {string} lockerCount - Count of lockers in the property (optional).
     */
    const {picture, propertyID, propertyName, address, unitCount, parkingCount, lockerCount } = property;

    /**
     * Provides navigation functionality for routing within the application.
     * Allows navigating to different pages or routes within the application.
     * @type {Function} navigate - Function to trigger navigation to a specified route.
     */
    const navigate = useNavigate();

    return (
        <div className="property-details-container">
            <div className="property-info">
                <div className='property-name'>
                    <h2>{propertyName}</h2>
                </div>
                {picture && <img src={picture} alt="Profile" className="profile-picture" />}
                <p>{address}</p>
                <p>Unit Count: {unitCount}</p>
                {parkingCount && <p>Parking Count: {parkingCount}</p>}
                <div className='locker-details'>
                    {lockerCount && <p>Locker Count: {lockerCount}</p>}
                    {/*@TODO actually navigate to the corresponding details page */}
                    <button className="details-button" onClick={() => navigate(`/propertydetailspage/${propertyID}/${propertyName}`)}>Details</button>
                </div>
            </div>
        </div>
    );      
};

/**
 * Defines the prop types for the PropertyComponent.
 * Specifies the expected types for each prop used in the component.
 * @type {object} PropertyComponent.propTypes - The prop types object for the PropertyComponent.
 */
PropertyComponent.propTypes = {
    property: PropTypes.shape({
        picture: PropTypes.string,
        propertyID: PropTypes.string.isRequired,
        propertyName: PropTypes.string.isRequired,
        address: PropTypes.string.isRequired,
        unitCount: PropTypes.string.isRequired,
        parkingCount: PropTypes.string,
        lockerCount: PropTypes.string,
    }).isRequired,
};

export default PropertyComponent;