import React from 'react';
import PropTypes from 'prop-types';
import "../styling/PropertyComponent.css";

const PropertyComponent = ({ name, profilePicture, address, unitCount, parkingCount, lockerCount }) => {

    return (
        <div className="property-details-container">
            <div className="property-info">
                <div className='property-name'>
                    <h2>{name}</h2>
                </div>
                {profilePicture && <img src={profilePicture} alt="Profile" className="profile-picture" />}
                <p>{address}</p>
                <p>Unit Count: {unitCount}</p>
                {parkingCount && <p>Parking Count: {parkingCount}</p>}
                <div className='locker-details'>
                    {lockerCount && <p>Locker Count: {lockerCount}</p>}
                    <button className="details-button">Details</button>
                </div>
            </div>
        </div>
    );
};

PropertyComponent.propTypes = {
    name: PropTypes.string.isRequired,
    profilePicture: PropTypes.string,
    address: PropTypes.string.isRequired,
    unitCount: PropTypes.string.isRequired,
    parkingCount: PropTypes.string,
    lockerCount: PropTypes.string,
};

export default PropertyComponent;