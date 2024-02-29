import NavbarCSS from "../styling/Navbar.module.css";
import React, { useState, useEffect, useRef } from "react";
import tempProfilePic from "../assets/user.png"; // Default profile picture
import { useNavigate } from "react-router-dom";
import logoutt from "../assets/log-out.png"; // Logout icon
import { FaCalendarAlt, FaBriefcase } from "react-icons/fa";
import { CiLogout } from "react-icons/ci";
import { CgProfile } from "react-icons/cg";
import { IoIosBusiness } from "react-icons/io";
import PropTypes from 'prop-types';

import store from "storejs"; // For local storage management

import { getProfilePicture } from "../backend/ImageHandler"; 
import { getUserData, getCompanyData } from "../backend/UserHandler";
import { MANAGEMENT_COMPANY, RENTER_OWNER } from "../backend/Constants"; // Role constants

const Navbar = () => {
  const navigate = useNavigate();
  const [role, setTheRole] = useState(""); // State to store user role
  const [open, setOpen] = useState(false); // State for managing dropdown menu visibility
  const [firstName, setFirstName] = useState(null); // State for user's first name
  const [companyName, setCompanyName] = useState(null); // State for company name
  const [profilePicUrl, setProfilePicUrl] = useState(tempProfilePic); // State for profile picture URL
  let menuRef = useRef(); // Ref for the menu for handling click outside to close the menu

  const toggleMenu = () => setOpen(!open); // Toggle the dropdown menu

  const handleClickOutside = (e) => {
    // Close the dropdown menu if clicked outside
    if (
      !e.target.closest(`.${NavbarCSS.myBurger}`) &&
      menuRef.current &&
      !menuRef.current.contains(e.target)
    ) {
      setOpen(false);
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const role = store("role");
      setTheRole(role);

      // Fetch and set the user's profile picture URL
      const profilePicURL = await getProfilePicture(store("user"));
      setProfilePicUrl(profilePicURL || tempProfilePic); // Use fetched URL or default if not available

      if (role === MANAGEMENT_COMPANY) {
        const tempData = await getCompanyData(store("user"));
        setCompanyName(tempData.companyName);
      } else if (role === RENTER_OWNER) {
        const tempData = await getUserData(store("user"));
        setFirstName(tempData.firstName);
      }
    };

    fetchUserData();
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const logout = async (e) => {
    e.preventDefault();
    store.remove("user");
    store.remove("role");
    navigate("/");
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  return (
    <>
      <nav className={NavbarCSS.myNavbar} data-testid="navbar">
        {/* Render only if user is logged in */}
        {store.get("user") && (
          <div ref={menuRef}>
            <div className={NavbarCSS.myMenuTrigger} onClick={toggleMenu} data-testid="user-pfp-container"> 
              {/* Display user profile picture or default image */}
              <img
                src={profilePicUrl}
                alt="User profile"
               data-testid="user-pfp"
                className={NavbarCSS.profilePic}
              />
            </div>

            {/* Dropdown Menu */}
            <div
              className={`${NavbarCSS.myDropdownMenu} ${
                open ? NavbarCSS.active : NavbarCSS.inactive
              }`}
              data-testid="dropdown"
            >
              {/* Greeting based on role */}
              {role === MANAGEMENT_COMPANY && (
                <h3 className={NavbarCSS.h3}>
                  Hello {companyName}! <br />
                </h3>
              )}
              {role === RENTER_OWNER && (
                <h3 className={NavbarCSS.h3}>
                  Hello {firstName}! <br />
                </h3>
              )}

              {/* Dropdown Items */}
              <ul className={NavbarCSS.ul}>
                <DropdownItem
                  address={"/user-profile"}
                  icon={<CgProfile />}
                  text={"My Profile"}
                />
                {/* Conditional rendering based on role */}
                {role === RENTER_OWNER && (
                  <DropdownItem
                    address={"/dashboard"}
                    icon={<IoIosBusiness />}
                    text={"Dashboard"}
                  />
                )}
                {role !== RENTER_OWNER && (
                  <DropdownItem
                    address={"/MGMTDashboard"}
                    icon={<IoIosBusiness />}
                    text={"My properties"}
                  />
                )}
                {role === MANAGEMENT_COMPANY && (
                  <DropdownItem
                    address={"/myemployees"}
                    icon={<FaBriefcase />}
                    text={"My employees"}
                  />
                )}
                {role === RENTER_OWNER && (
                  <DropdownItem
                    address={"/reservations"}
                    icon={<FaCalendarAlt />}
                    text={"Reservations"}
                  />
                )}
                <LogoutBtn img={logoutt} />
              </ul>
            </div>
          </div>
        )}
      </nav>
    </>
  );

  function LogoutBtn() {
    return (
      <li className={NavbarCSS.myDropdownItem}>
        <button className={NavbarCSS.myLogout} onClick={logout}>
          <CiLogout /> Logout
        </button>
      </li>
    );
  }

  function DropdownItem(props) {
    return (
      <li className={NavbarCSS.myDropdownItem}>
        <a className={NavbarCSS.atag} href={props.address}>
          {props.icon} {props.text}
        </a>
      </li>
    );
  }
};



Navbar.propTypes = {
  address: PropTypes.string,
  icon: PropTypes.string,
  text: PropTypes.string,
};
export default Navbar;
