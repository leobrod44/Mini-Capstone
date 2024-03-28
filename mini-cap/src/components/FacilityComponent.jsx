import React, {useEffect} from 'react';
import PropTypes from 'prop-types';
import "../styling/FacilityComponent.css";
import  { useState } from "react";

const FacilityComponent = () => {

    return (
        <div className="component-container">
            <div className="facility-title">Facility Component</div>
            <div className="facility-description">Little Facility Description</div>
            <button className='make-reservation-button'>Make Reservation</button>
        </div>
    );
};

export default FacilityComponent;