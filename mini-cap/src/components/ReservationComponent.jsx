import React, { useEffect } from "react";
import PropTypes from "prop-types";
import "../styling/FacilityComponent.css";

const ReservationComponent = ({
  facilityType,
  startTime,
  endTime,
  date,
  month,
}) => {
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Get the month name based on the month number
  const reservationMonth = monthNames[month];

  return (
    <div className="component-container">
      <div className="facility-title">Upcoming Reservation: {facilityType}</div>
      <div className="facility-description"></div>
      <div>
        Date: {reservationMonth} {date}{" "}
      </div>
      <div>
        Time: {startTime} - {endTime}
      </div>
    </div>
  );
};

ReservationComponent.propTypes = {
  facilityTitle: PropTypes.string,
  date: PropTypes.string,
  month: PropTypes.number,
  startTime: PropTypes.string,
  endTime: PropTypes.string,
};

export default ReservationComponent;
