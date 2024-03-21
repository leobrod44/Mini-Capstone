import "../styling/Notification.css"
import { IoIosNotifications } from "react-icons/io";
import React, { useState, useEffect, useRef } from "react";

const Notification = () => {
  
/**
 * Functional component representing the notification icon.
 * @returns {JSX.Element} - The JSX for the notification icon.
 */
    return (
        <div className="notif-wrapper">
        <IoIosNotifications className="notif" data-testid="notification-icon"/>
        </div>
    );

};
    export default Notification;