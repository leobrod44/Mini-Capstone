import React, {useEffect} from 'react';
import PropTypes from 'prop-types';
import "../styling/CondoComponent.css";
import  { useState} from "react";
import Popup_SendKey from './Popup_SendKey';
import {useNavigate} from "react-router-dom";
import { getCondoOccupant } from "../backend/PropertyHandler";

const CondoMgmtComponent = ({picture, unitNumber, parkingNumber, lockerNumber, condoId}) => {
    const navigate = useNavigate();
    const [showPopup, setShowPopup] = useState(false);
    const handlePopupToggle = () => {
        setShowPopup(!showPopup);
    };

    const [occupantValue, setOccupantValue] = useState("");
    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await getCondoOccupant(condoId);
                setOccupantValue(result);
            } catch (error) {
                console.error('Error fetching occupant:', error);
            }
        };
        fetchData();
    }, [condoId]);


    return (
        <div className="condo-details-container">
            <div className="condo-info">
                <div className='condo-name-user-tag'>
                    <h2>{unitNumber}</h2>
                </div>

                {picture && <img src={picture} alt="Profile" className="profile-picture"/>}
                <p>Unit Number: {unitNumber}</p>
                <div className='parking-send-key'>
                    {parkingNumber && <p>Parking Spot: {parkingNumber}</p>}
                    {occupantValue === "" && (
                        <button className="details-button" onClick={handlePopupToggle}>
                            Send Key
                        </button>
                    )}

                </div>
                <div className='locker-details'>
                    {lockerNumber && <p>Locker: {lockerNumber}</p>}
                    <button className="details-button" onClick={() => navigate(`/condo-details/${condoId}`)}>Details
                    </button>
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
    condoId:PropTypes.string,
};


export default CondoMgmtComponent;