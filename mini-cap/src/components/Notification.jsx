import "../styling/Notification.css";
import { IoIosNotifications } from "react-icons/io";
import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import NotificationElement from "./NotificationElement";
import { getNotifications } from "../backend/RequestHandler";
import { setNotificationViewed } from "../backend/RequestHandler";
import store from "storejs";

const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false); // State for managing dropdown menu visibility
  const menuRef = useRef(); // Ref for the menu for handling click outside to close the menu
  const [showAll, setShowAll] = useState(false);
  const userID = store("user"); // Get userID from local storage or context
  const navigate = useNavigate();

    // Function to toggle menu visibility
  const toggleMenu = () => {
    setOpen(!open);
  };

  // Function to fetch notifications from backend
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const fetchedNotifications = await getNotifications(userID);
        setNotifications(fetchedNotifications);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [open, userID]); 

  // Function to handle clicking outside the modal
  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setOpen(false); // Close the modal if clicked outside
    }
  };

  // Function to handle clicking on a notification
  const handleNotificationClickInsideModal = async (notification) => {
    try {
      await setNotificationViewed(userID, notification);
      navigateToDestination(notification);
    } catch (error) {
      console.error("Error setting notification viewed:", error);
    }
  };

  // Function to navigate to the destination specified in the notification
const navigateToDestination = (notification) => {
  try {
  if (notification.path) {
    navigate(notification.path);
    window.location.reload();
  } else {
    console.error("Notification does not have a path specified:", notification);
  }
} catch (error) {
    console.error("Error during navigation:", error);
  }
};

  // Function to handle clicking on "See All" button
  const handleSeeAllInsideModal = () => {
    setShowAll((prevState) => !prevState); // Toggle the showAll state
  };

  return (
    <div className="notification-container" ref={menuRef}>
      <div className="notif-wrapper">
        <IoIosNotifications
          className="notif"
          data-testid="notification-icon"
          onClick={toggleMenu}
        />
      </div>
      <div className={`myDropdownNotif ${open ? "active" : "inactive"}`}>
        <div className="notification-header">
          <h2 className="notif-title">Notifications</h2>
        </div>
        {notifications.length > 0 ? ( // Check if there are notifications
          <div
            className="notification-list"
            style={{ maxHeight: showAll ? "450px" : "auto", overflowY: "auto" }}
          >
            {notifications
              .slice(0, showAll ? notifications.length : 3)
              .map((notification, index) => (
                <NotificationElement
                data-testid="notification-element"
                  key={index}
                  notification={notification}
                  onClick={() =>
                    handleNotificationClickInsideModal(notification)
                  }
                />
              ))}
          </div>
        ) : (
          <div className="no-notifications-msg">No new notifications.</div>
        )}
        {notifications.length > 3 && ( // Conditionally render the "See All" button
          <div className="btn-div-notif">
            <button className="See-all" onClick={handleSeeAllInsideModal}>
              {showAll ? "Hide" : "See All"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notification;
