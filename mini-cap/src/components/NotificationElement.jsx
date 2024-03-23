
import React from "react";
import { IoIosClose, IoIosWarning } from "react-icons/io";
import "../styling/NotificationElement.css"


const NotificationElement = ({ notification, onClick, onClear }) => {
  const { condoName, requestType, description, dateTime, clicked } = notification;

  return (
    <div className="notification-element" onClick={onClick}>
      <div className="notification-info">
        <div className="condo-name">{condoName}</div>
        <div className="request-type">{requestType}</div>
        <div className="description">{description}</div>
      </div>
      <div className="notification-details">
        {clicked ? null : <IoIosWarning className="exclamation-icon" />}
        <div className="date-time">{dateTime}</div>
        <IoIosClose className="clear-icon" onClick={onClear} />
      </div>
    </div>
  );
};

export default NotificationElement;
