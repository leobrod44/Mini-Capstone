import React from "react";
import { IoIosClose, IoIosWarning } from "react-icons/io";
import "../styling/NotificationElement.css";


const formatDate = (datetime) => {
  const date = new Date(datetime);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day} ${hours}:${minutes}`;
};


const NotificationElement = ({ notification, onClick }) => {
  const { condoName, message, date, viewed } = notification;

  const formattedDate = formatDate(date);
  return (
    <div
      className={`notification-element ${viewed ? 'clicked' : 'not-clicked'}`}
      onClick={onClick}
    >
      <div className="notification-info">
        <div className="notifMsg">{message}</div>
      </div>
      <div className="icon-date-wrapper">
      {viewed ? null : <IoIosWarning className="exclamation-icon" />}
      <div className="date-time">{formattedDate}</div>
      </div>
      <div className="notification-details">
        <div className="unitNumber">{condoName}</div>
      </div>
    </div>
  );
};

export default NotificationElement;
