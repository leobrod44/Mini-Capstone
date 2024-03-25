import React from "react";
import { IoIosClose, IoIosWarning } from "react-icons/io";
import "../styling/NotificationElement.css";

const NotificationElement = ({ notification, onClick, onClear }) => {
  const { condoName, notifMsg, dateTime, clicked } = notification;

  return (
    <div
      className={`notification-element ${clicked ? 'clicked' : 'not-clicked'}`}
      onClick={onClick}
    >
      <div className="notification-info">
        <div className="notifMsg">{notifMsg}</div>
          <IoIosClose className="clear-icon" onClick={onClear} />
      </div>
      <div className="icon-date-wrapper">
      {clicked ? null : <IoIosWarning className="exclamation-icon" />}
      <div className="date-time">{dateTime}</div>
      </div>
      <div className="notification-details">
        <div className="unitNumber">{condoName}</div>
      </div>
    </div>
  );
};

export default NotificationElement;
