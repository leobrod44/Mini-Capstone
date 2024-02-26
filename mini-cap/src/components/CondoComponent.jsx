import React from 'react';
import PropTypes from 'prop-types';
import "../styling/CondoComponent.css";
import {useNavigate} from "react-router-dom";

const CondoComponent = ({ condo }) => {
    const { property, picture, address, unitNumber, parkingNumber, lockerNumber, userType } = condo;
    const navigate = useNavigate();
    
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
                <p>Unit #: {unitNumber}</p>
                {parkingNumber && <p>Parking #: {parkingNumber}</p>}
                
                <div className='locker-details'>
                    {lockerNumber && <p>Locker #: {lockerNumber}</p>}
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