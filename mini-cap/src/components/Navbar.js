import NavbarCSS from "../styling/Navbar.module.css";
import React, { useState, useEffect, useRef } from "react";
import tempProfilePic from "../assets/user.png";
import { useNavigate } from "react-router-dom";
import logoutt from "../assets/log-out.png";

import { FaCalendarAlt } from "react-icons/fa";
import { GiHamburgerMenu } from "react-icons/gi";
import { AiOutlineHome } from "react-icons/ai";
import { CiLogout } from "react-icons/ci";
import { CgProfile } from "react-icons/cg";
import { IoIosBusiness } from "react-icons/io";
import { FaBriefcase } from "react-icons/fa";
import store from "storejs";
import { getUserData, getProfilePicture } from "../backend/Fetcher"; // Make sure the path is correct

const Navbar = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState("");
  const [open, setOpen] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [profilePic, setProfilePic] = useState(tempProfilePic);
  let menuRef = useRef();

  useEffect(() => {
    const fetchUserData = async () => {
      const userEmail = store("loggedUser");
      if (userEmail) {
        const data = await getUserData(userEmail);
        setRole(data.role);
        setFirstName(data.firstName);
        setCompanyName(data.companyName);
        const profilePicURL = await getProfilePicture(userEmail);
        setProfilePic(profilePicURL || tempProfilePic);
      }
    };

    fetchUserData();

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleMenu = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClickOutside = (e) => {
    if (!menuRef.current.contains(e.target)) {
      setOpen(false);
    }
  };

  const logout = async (e) => {
    e.preventDefault();
    store.remove("loggedUser");
    navigate("/login");
  };

  return (
    <>
      <nav className={NavbarCSS.myNavbar}>
        <div ref={menuRef}>
          <div className={NavbarCSS.myMenuTrigger} onClick={toggleMenu}>
            <img
              src={profilePic}
              alt="User profile picture"
              className={NavbarCSS.profilePic}
            />
          </div>

          <div
            className={`${NavbarCSS.myDropdownMenu} ${
              open ? NavbarCSS.active : NavbarCSS.inactive
            }`}
          >
            {role === "mgmt" ? (
              <h3 className={NavbarCSS.h3}>
                Hello, {companyName}! <br />
              </h3>
            ) : (
              <h3 className={NavbarCSS.h3}>
                Hello, {firstName}! <br />
              </h3>
            )}

            <ul className={NavbarCSS.ul}>
              <DropdownItem
                address={"/user-profile"}
                icon={<CgProfile />}
                text={"My Profile"}
              />

              {role === "condoOwner" && (
                <DropdownItem
                  address={"/dashboard"}
                  icon={<IoIosBusiness />}
                  text={"Dashboard"}
                />
              )}

              {role === "renter" && (
                <DropdownItem
                  address={"/myproperty"}
                  icon={<AiOutlineHome />}
                  text={"My rental"}
                />
              )}

              {role === "mgmt" && (
                <DropdownItem
                  address={"/MGMTDashboard"}
                  icon={<IoIosBusiness />}
                  text={"My properties"}
                />
              )}

              {role === "mgmt" && (
                <DropdownItem
                  address={"/myemployees"}
                  icon={<FaBriefcase />}
                  text={"My employees"}
                />
              )}

              <DropdownItem
                address={"/reservations"}
                icon={<FaCalendarAlt />}
                text={"Reservations"}
              />

              <LogoutBtn img={logoutt} />
            </ul>
          </div>
        </div>
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

export default Navbar;
