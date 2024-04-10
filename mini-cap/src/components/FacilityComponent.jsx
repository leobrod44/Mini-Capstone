import React, { useEffect } from "react";
import PropTypes from "prop-types";
import "../styling/FacilityComponent.css";
import { Link } from "react-router-dom";

const FacilityComponent = ({
  type,
  description,
  dailyAvailabilities,
  blockSize,
  propertyID,
  id
}) => {
  return (
    <div className="facility-component-container">
      <div className="facility-type"> Facility: {type}</div>
      <div className="facility-description"> Description: {description}</div>
      <Link to={`/calendar?propertyID=${propertyID}}&facilityID=${id}`} className="make-reservation-button">Make Reservation</Link>
    </div>
  );
};

FacilityComponent.propTypes = {
  type: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};
export default FacilityComponent;
