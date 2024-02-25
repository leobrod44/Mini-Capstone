import React from 'react';
import PropTypes from 'prop-types';
import "../styling/CondoComponent.css";
import  { useState} from "react";
import Popup_SendKey from './Popup_SendKey';

const CondoMgmtComponent = ({ name, picture, unitNumber, parkingSpot, locker, condoId }) => {

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
                
                {picture && <img src={picture} alt="Profile" className="profile-picture" />}
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
            {showPopup && <Popup_SendKey handleClose={handlePopupToggle} condoId={condoId}/>}
        </div>
        
    );
};

CondoMgmtComponent.propTypes = {
    name: PropTypes.string,
    profilePicture: PropTypes.string,
    unitNumber: PropTypes.string.isRequired,
    parkingSpot: PropTypes.string,
    locker: PropTypes.string,
    condoId: PropTypes.string.isRequired
};

export default CondoMgmtComponent;