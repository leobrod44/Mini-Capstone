import React, { useState, useEffect, useRef } from "react";
import NotificationElement from "./NotificationElement";
import "../styling/NotificationModal.css";

const NotificationModal = ({ notifications, onClose }) => {
    const [showModal, setShowModal] = useState(true);

    const handleModalClickOutside = (e) => {
        // Close the modal if clicked outside
        if (!e.target.closest(".notification-modal")) {
          setShowModal(false);
        }
      };
    
      useEffect(() => {
        document.addEventListener("mousedown", handleModalClickOutside);
        return () => document.removeEventListener("mousedown", handleModalClickOutside);
      }, []);
    
     // Function to handle clicking on a notification
  const handleNotificationClick = (notification) => {
    // Navigate to the page or route associated with the notification
    // Here, assuming each notification has an 'id', you can navigate to a specific notification's page
  };

  // Function to handle clearing a notification
  const handleClearNotification = (notification) => {

  };

  // Function to handle clicking on "See All" button
  const handleSeeAll = () => {
    // Navigate to a new page that displays all notifications

  };


  return (
    <div className={`notification-modal ${showModal ? 'active' : 'inactive'}`}>
    <div className="notificationheader">
        <h2>Notifications</h2>
        <button onClick={onClose}>Close</button>
      </div>
      <div className="notification-list">
      {notifications && notifications.length > 0 ? (
          notifications.map((notification, index) => (
            <NotificationElement
              key={index}
              notification={notification}
              onClick={() => handleNotificationClick(notification)}
              onClear={() => handleClearNotification(notification)}
            />
          ))
        ) : (
          <p>No notifications</p>
        )}
      </div>
      <button onClick={handleSeeAll}>See All</button>
    </div>
  );
};

export default NotificationModal;
