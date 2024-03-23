import "../styling/Notification.css";
import { IoIosNotifications } from "react-icons/io";
import React, { useState,useRef,useEffect } from "react";
import NotificationElement from "./NotificationElement";

const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false); // State for managing dropdown menu visibility
  const menuRef = useRef(); // Ref for the menu for handling click outside to close the menu

  const toggleMenu = () => {
    console.log("Current state before toggle:", open);
    setOpen(!open);
    console.log("Current state after toggle:", open);
  };

  useEffect(() => {
    console.log("Current state:", open);
    document.addEventListener("click", handleClickOutside);
    // Remove event listener when the component unmounts
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [open]); // Log the state whenever it changes


  // Function to handle clicking outside the modal
  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setOpen(false); // Close the modal if clicked outside
    }
  };


  // Function to handle clicking on a notification
  const handleNotificationClickInsideModal = (notification) => {
    // Navigate to the page or route associated with the notification
    // Here, assuming each notification has an 'id', you can navigate to a specific notification's page
  };

  // Function to handle clearing a notification
  const handleClearNotificationInsideModal = (notification) => {};

  // Function to handle clicking on "See All" button
  const handleSeeAllInsideModal = () => {
    // Navigate to a new page that displays all notifications
  };


  /**
   * Functional component representing the notification icon.
   * @returns {JSX.Element} - The JSX for the notification icon.
   */
  return (
<div className="notification-container" ref={menuRef}>
    <div className="notif-wrapper">
      <IoIosNotifications
        className="notif"
        data-testid="notification-icon"
        onClick={toggleMenu}
      />
      </div>
        <div className={`myDropdownNotif ${open ? 'active' : 'inactive'}`}>
          <div className="notification-header">
            <h2 className="notif-title">Notifications</h2>
          </div>
          <NotificationElement
        notification={{
          condoName: "Unit XYZ",
          requestType: "Maintenance Request",
          dateTime: "2024-03-24 10:00 AM",
          clicked: false
        }}
        onClick={handleNotificationClickInsideModal}
        onClear={handleClearNotificationInsideModal}
      />
      <NotificationElement
        notification={{
          condoName: "Unit A456",
          requestType: "Tax Form Request",
          dateTime: "2024-03-18 9:00 AM",
          clicked: false
        }}
        onClick={handleNotificationClickInsideModal}
        onClear={handleClearNotificationInsideModal}
      />
      <NotificationElement
        notification={{
          condoName: "Unit B64",
          requestType: "Report Damage",
          dateTime: "2024-03-12 11:00 PM",
          clicked: true
        }}
        onClick={handleNotificationClickInsideModal}
        onClear={handleClearNotificationInsideModal}
      />
           {notifications.length > 0 ? ( // Check if there are notifications
            <div className="notification-list">
              {notifications.map((notification, index) => (
                <NotificationElement
                  key={index}
                  notification={notification}
                  onClick={() => handleNotificationClickInsideModal(notification)}
                  onClear={() => handleClearNotificationInsideModal(notification)}
                />
              ))}
            </div>
          ) : (
            <div className="no-notifications-msg">No new notifications.</div>
          )}
         
          <div className="btn-div-notif"> 
          <button className="See-all" onClick={handleSeeAllInsideModal}>See All</button>
          </div>
        </div>
        
    </div>
  );
};


  
export default Notification;
