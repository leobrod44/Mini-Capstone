import React, {useEffect} from 'react';
import PropTypes from 'prop-types';
import "../styling/FacilityComponent.css";
import  { useState } from "react";

const FacilityComponent = ({facilityTitle, facilityDescription}) => {

    return (
        <div className="component-container">
            <div className="facility-title">Facility Component{facilityTitle}</div>
            <div className="facility-description">Little Facility Description{facilityDescription}</div>
            <button className='make-reservation-button'>Make Reservation</button>
        </div>
    );
};

FacilityComponent.propTypes = {
    facilityTitle: PropTypes.string,
    facilityDescription: PropTypes.string,
};
export default FacilityComponent;