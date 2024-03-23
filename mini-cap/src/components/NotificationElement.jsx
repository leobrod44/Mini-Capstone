import React from "react";
import { IoIosClose, IoIosWarning } from "react-icons/io";
import "../styling/NotificationElement.css";

const NotificationElement = ({ notification, onClick, onClear }) => {
  const { condoName, requestType, dateTime, clicked } = notification;

  return (
    <div
      className={`notification-element ${clicked ? '' : 'not-clicked'}`}
      onClick={onClick}
    >
      <div className="notification-info">
        <div className="condo-name">{condoName}</div>
          <IoIosClose className="clear-icon" onClick={onClear} />
      </div>
      <div className="icon-date-wrapper">
      {clicked ? null : <IoIosWarning className="exclamation-icon" />}
      <div className="date-time">{dateTime}</div>
      </div>
      <div className="notification-details">
        <div className="request-type">{requestType}</div>
      </div>
    </div>
  );
};

export default NotificationElement;
