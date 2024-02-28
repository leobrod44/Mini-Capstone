import React from 'react';
import PropTypes from 'prop-types';
import "../styling/CondoComponent.css";
import  { useState} from "react";
import Popup_SendKey from './Popup_SendKey';
import { Link } from "react-router-dom";

const CondoMgmtComponent = ({picture, unitNumber, parkingNumber, lockerNumber, property, squareFeet, unitPrice, unitSize, condoId}) => {

    const [showPopup, setShowPopup] = useState(false);
    const handlePopupToggle = () => {
        setShowPopup(!showPopup);
      };

      
    return (
        <div className="condo-details-container">
            <div className="condo-info">
                <div className='condo-name-user-tag'>
                    <h2>{unitNumber}</h2>
                </div>
                
                {picture && <img src={picture} alt="Profile" className="profile-picture" />}
                <p>Unit Number: {unitNumber}</p>
                <div className='parking-send-key'> 
                    {parkingNumber && <p>Parking Spot: {parkingNumber}</p>}
                    <button className="details-button" onClick={handlePopupToggle}>Send Key</button>
                  
                </div>
                <div className='locker-details'>

                    {lockerNumber && <p>Locker: {lockerNumber}</p>}
                    <button className="details-button">Details</button>
                     {/* <button className="details-button">Details</button> */}
                    <Link to="/condo-details" className="details-button">Details</Link>

                </div>
            </div>
            {showPopup && <Popup_SendKey handleClose={handlePopupToggle} condoId={condoId}/>}
        </div>
        
    );
};

CondoMgmtComponent.propTypes = {
    picture: PropTypes.string,
    parkingNumber: PropTypes.string,
    lockerNumber: PropTypes.string,
    property: PropTypes.string,
    squareFeet: PropTypes.string,
    unitNumber: PropTypes.string.isRequired,
    unitPrice: PropTypes.string,
    unitSize: PropTypes.string,
};


export default CondoMgmtComponent;