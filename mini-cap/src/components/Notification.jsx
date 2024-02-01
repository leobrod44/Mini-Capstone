import "../styling/Notification.css"
import { IoIosNotifications } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect, useRef } from "react";
import Navbarcss from"../styling/Navbar.module.css";

const Notification = () => {
  

    return (
        <div className="notif-wrapper">
        <IoIosNotifications className="notif"/>
        </div>
    );

};
    export default Notification;