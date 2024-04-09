import React, { useEffect } from "react";
import PropTypes from "prop-types";
import "../styling/FacilityComponent.css";
import { useState } from "react";

const FacilityComponent = ({
  type,
  description,
  dailyAvailabilities,
  blockSize,
}) => {
  return (
    <div className="facility-component-container">
      <div className="facility-type"> Facility {type}</div>
      <div className="facility-description"> Description{description}</div>
      <button className="make-reservation-button">Make Reservation</button>
    </div>
  );
};

FacilityComponent.propTypes = {
  type: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};
export default FacilityComponent;
