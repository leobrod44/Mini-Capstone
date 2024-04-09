import React, {useEffect} from 'react';
import PropTypes from 'prop-types';
import "../styling/FacilityComponent.css";
import  { useState } from "react";
import DeleteModal from "../components/DeleteModal";

const ReservationComponent = ({facilityTitle, facilityDescription, reservationDate}) => {
    
    return (
        <div className="component-container">
            <div className="facility-title">Reservation Component{facilityTitle}</div>
            <div className="facility-description">Little Description{facilityDescription}</div>
            <div className="facility-description">Date and Time{reservationDate}</div>
        </div>
        
    );
};

ReservationComponent.propTypes = {
    facilityTitle: PropTypes.string,
    facilityDescription: PropTypes.string,
    reservationDate: PropTypes.string
};

export default ReservationComponent;