import React from 'react';
import PropTypes from 'prop-types';
import "../styling/CondoComponent.css";
import  { useState} from "react";
import Popup_SendKey from './Popup_SendKey';

const CondoMgmtComponent = ({ name, profilePicture, unitNumber, parkingSpot, locker }) => {

    const [showPopup, setShowPopup] = useState(false);
    const handlePopupToggle = () => {
        setShowPopup(!showPopup);
      };

      
    return (
        <div className="condo-details-container">
            <div className="condo-info">
                <div className='condo-name-user-tag'>
                    <h2>{name}  {unitNumber}</h2>
                </div>
                
                {profilePicture && <img src={profilePicture} alt="Profile" className="profile-picture" />}
                <p>Unit Number: {unitNumber}</p>
                <div className='parking-send-key'> 
                    {parkingSpot && <p>Parking Spot: {parkingSpot}</p>}
                    <button className="details-button" onClick={handlePopupToggle}>Send Key</button>
                  
                </div>
                <div className='locker-details'>
                    {locker && <p>Locker: {locker}</p>}
                    <button className="details-button">Details</button>
                </div>
            </div>
            {showPopup && <Popup_SendKey handleClose={handlePopupToggle} />}
        </div>
        
    );
};

CondoMgmtComponent.propTypes = {
    name: PropTypes.string.isRequired,
    profilePicture: PropTypes.string,
    unitNumber: PropTypes.string.isRequired,
    parkingSpot: PropTypes.string,
    locker: PropTypes.string
};

export default CondoMgmtComponent;