import React, {useEffect} from 'react';
import PropTypes from 'prop-types';
import "../styling/FacilityComponent.css";
import  { useState } from "react";
import DeleteModal from "../components/DeleteModal";
import { propTypes } from 'react-bootstrap/esm/Image';

const ReservationComponent = ({facilityTitle, startTime, endTime, date, month}) => {
    
    return (
        <div className="component-container">
            <div className="facility-title">Upcoming Reservation:{facilityTitle}</div>
            <div className="facility-description"></div>
            <div>Date: {date} </div>
            <div>Time: {startTime} - {endTime}</div>
        </div>
        
    );
};

ReservationComponent.propTypes = {
    facilityTitle: PropTypes.string,
    date: PropTypes.string,
    month: PropTypes.string,
    startTime: PropTypes.string,
    endTime: PropTypes.string
};

export default ReservationComponent;