import React from 'react';
import PropTypes from 'prop-types';
import "../styling/FinancialDetails.css";
import  { useState} from "react";
import Popup_SendKey from './Popup_SendKey';
import { Link } from "react-router-dom";

const FinancialDetails = ({picture, unitNumber, parkingNumber, lockerNumber, condoId}) => {

    const [showCheck, setCheck] = useState(false);
    const handlePopupToggle = () => {
        setShowPopup(!showPopup);
      };

      
    return (
        <div className="Financial-info">
            <div className="other-info1">
                <div className="other-info2"><h5>Base Price:</h5></div>
            </div>
            <div className="other-info1">
                <div className="other-info2"><h5>Utilities:</h5></div>
            </div>
            <div className="other-info1">
                <div className="other-info2"><h5>Additional Fees:</h5></div>
            </div>
            <div className="other-info1">
                <div className="other-info2"><h5>Total Unit Price:</h5></div>
            </div>
            <div>
                <br></br>
                <div className="other-info2"><h5>Rent Paid:</h5></div>
            </div>
        </div>
    );
};

export default FinancialDetails;