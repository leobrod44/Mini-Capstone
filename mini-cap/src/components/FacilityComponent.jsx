import React from "react";
import PropTypes from "prop-types";
import "../styling/FacilityComponent.css";
import { Link } from "react-router-dom";

/**
 * FacilityComponent displays information about a facility and provides a link to make a reservation.
 * @param {object} props - The properties passed to the component.
 * @param {string} props.type - The type of facility.
 * @param {string} props.description - A description of the facility.
 * @param {Array} props.dailyAvailabilities - An array of daily availabilities for the facility (not used in this component).
 * @param {number} props.blockSize - The block size for booking (not used in this component).
 * @param {string} props.propertyID - The ID of the property where the facility is located.
 * @param {string} props.id - The ID of the facility.
 * @returns {JSX.Element} A React component displaying facility information and a link to make a reservation.
 */
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
      {/* Display the type of facility */}
      <div className="facility-type"> Facility: {type}</div>
      {/* Display the description of the facility */}
      <div className="facility-description"> Description: {description}</div>
      {/* Link to make a reservation for this facility */}
      <Link to={`/calendar?propertyID=${propertyID}&facilityID=${id}&facilityType=${type}&desc=${description}`} className="make-reservation-button">Make Reservation</Link>
    </div>
  );
};

// PropTypes for type checking the props passed to FacilityComponent
FacilityComponent.propTypes = {
  type: PropTypes.string.isRequired, // Facility type is a required string
  description: PropTypes.string.isRequired, // Facility description is a required string
};

export default FacilityComponent;
