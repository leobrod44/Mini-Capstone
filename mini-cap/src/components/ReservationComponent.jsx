import React, {useEffect} from 'react';
import PropTypes from 'prop-types';
import "../styling/FacilityComponent.css";
import  { useState } from "react";
import DeleteModal from "../components/DeleteModal";

const ReservationComponent = ({facilityTitle, startTime, endTime, date}) => {
    
    return (
        <div className="component-container">
            <div className="facility-title">{facilityTitle}</div>
            <div className="facility-description">Date {date}</div>
            <div> {startTime} - {endTime}</div>
        </div>
        
    );
};

ReservationComponent.propTypes = {
    facilityTitle: PropTypes.string,
    date: PropTypes.string
};

export default ReservationComponent;