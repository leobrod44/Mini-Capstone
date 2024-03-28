import React, {useEffect} from 'react';
import PropTypes from 'prop-types';
import "../styling/FacilityComponent.css";
import  { useState } from "react";

const ReservationComponent = () => {

    return (
        <div className="component-container">

            <div className="facility-title">Reservation Component</div>
            <div className="facility-description">Little Description</div>
            <div className="facility-description">Date and Time</div>
            <button className="close-button">×</button>
            
        </div>
        
    );
};


export default ReservationComponent;