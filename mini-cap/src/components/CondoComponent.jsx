import React from 'react';
import PropTypes from 'prop-types';
import "../styling/CondoComponent.css";
import {useNavigate} from "react-router-dom";

const CondoComponent = ({ condo }) => {
    const { property, profilePicture, address, unitNumber, parkingSpot, locker, userType } = condo;
    const navigate = useNavigate();
    
    const userTypeClass = userType === 'Owner' ? 'owner' : 'renter';

    return (
        <div className="condo-details-container">
            <div className="condo-info">
                <div className='condo-name-user-tag'>
                    <h2>Name: {property}</h2>
                    <div className={`user-tag ${userTypeClass}`}>{userType}</div>
                </div>
                
                {profilePicture && <img src={profilePicture} alt="Profile" className="profile-picture" />}
                <p>Address: {address}</p>
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

CondoComponent.propTypes = {
    property: PropTypes.string,
    profilePicture: PropTypes.string,
    address: PropTypes.string,
    unitNumber: PropTypes.string,
    parkingSpot: PropTypes.string,
    locker: PropTypes.string,
    userType: PropTypes.string
};

export default CondoComponent;