import React from 'react';
import PropTypes from 'prop-types';
import "../styling/PropertyComponent.css";
import {  useNavigate } from "react-router-dom";


    const PropertyComponent = ({ property }) => {
    const {picture, propertyID, propertyName, profilePicture, address, unitCount, parkingCount, lockerCount } = property;
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