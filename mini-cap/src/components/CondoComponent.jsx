import React from 'react';
import PropTypes from 'prop-types';
import "../styling/CondoComponent.css";
import {useNavigate} from "react-router-dom";


const CondoComponent = ({ condo }) => {
    const { property, picture, address, unitNumber, parkingNumber, lockerNumber, userType, condoId } = condo;
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