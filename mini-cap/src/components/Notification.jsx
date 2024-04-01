import "../styling/Notification.css"
import { IoIosNotifications } from "react-icons/io";
import React, { useState, useEffect, useRef } from "react";
import { getNotifications } from "../backend/RequestHandler";
import { useParams } from "react-router-dom";

const Notification = () => {
    /**
     * State variable to hold the count of unviewed notifications.
     * @type {[number, React.Dispatch<React.SetStateAction<number>>]}
     */
    const [unviewedCount, setUnviewedCount] = useState(0);

    /**
     * Destructures the `userID` parameter from the URL parameters.
     * @type {object}
     */
    let { userID } = useParams();
  
    /**
     * Effect hook to fetch notifications for the current user when the component mounts.
     * Updates the notifications state and the unviewedCount state based on the fetched notifications.
     */
    useEffect(() => {
      // Fetch notifications for the current user
      const fetchNotifications = async () => {
        try {
            const notifs = await getNotifications(userID);
            const unviewedNotifications = notifs.filter(notification => !notification.viewed);
            setUnviewedCount(unviewedNotifications.length);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
      };
  
      fetchNotifications();
    }, []);
  
/**
 * Functional component representing the notification icon.
 * @returns {JSX.Element} - The JSX for the notification icon.
 */
    return (
        <div className="notif-wrapper">
        { unviewedCount > 0 &&(
            <div className="notifPopup" data-testid="popup">{unviewedCount}</div>
        )}
        <IoIosNotifications className="notif" data-testid="notification-icon"/>
        </div>
    );

};
    export default Notification;