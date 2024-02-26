import React from 'react';
import PropTypes from 'prop-types';
import "../styling/CondoComponent.css";

const CondoComponent = ({ condo }) => {
    const { name, profilePicture, address, unitNumber, parkingSpot, locker, userType } = condo;
    
    const userTypeClass = userType === 'Owner' ? 'owner' : 'renter';

    return (
        <div className="condo-details-container">
            <div className="condo-info">
                <div className='condo-name-user-tag'>
                    <h2>{name}</h2>
                    <div className={`user-tag ${userTypeClass}`}>{userType}</div>
                </div>
                
                {profilePicture && <img src={profilePicture} alt="Profile" className="profile-picture" />}
                <p>{address}</p>
                <p>Unit Number: {unitNumber}</p>
                {parkingSpot && <p>Parking Spot: {parkingSpot}</p>}
                
                <div className='locker-details'>
                    {locker && <p>Locker: {locker}</p>}
                    <button className="details-button">Details</button>
                </div>
            </div>
        </div>
    );
};

// CondoComponent.propTypes = {
//     name: PropTypes.string.isRequired,
//     profilePicture: PropTypes.string,
//     address: PropTypes.string.isRequired,
//     unitNumber: PropTypes.string.isRequired,
//     parkingSpot: PropTypes.string,
//     locker: PropTypes.string,
//     userType: PropTypes.string.isRequired
// };

CondoComponent.propTypes = {
    // name: PropTypes.string,
    profilePicture: PropTypes.string,
    address: PropTypes.string,
    unitNumber: PropTypes.string,
    parkingSpot: PropTypes.string,
    locker: PropTypes.string,
    userType: PropTypes.string
};

export default CondoComponent;