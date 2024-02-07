import NavbarCSS from "../styling/Navbar.module.css";
import React, { useState, useEffect, useRef } from "react";
//import { useDispatch, useSelector } from "react-redux";
import tempProfilePic from "../assets/user.png";
import { useNavigate } from "react-router-dom";
import logoutt from "../assets/log-out.png";

import { FaCalendarAlt } from "react-icons/fa";
import { GiHamburgerMenu } from "react-icons/gi";
import { AiOutlineHome } from "react-icons/ai";
import { CiLogout } from "react-icons/ci";
import { CgProfile } from "react-icons/cg";
import { IoIosBusiness } from "react-icons/io";
import { LiaHandsHelpingSolid } from "react-icons/lia";
import { FaBriefcase } from "react-icons/fa";

const Navbar = () => {
  const navigate = useNavigate();
  //to display Hello user! message , grab the name and their profile pic
  // const firstName = useSelector(selectName);
  // const photo = useSelector(selectPhoto);
  const [role, setRole] = useState(""); // <-- State to store user role
  const [open, setOpen] = useState(false);
  let menuRef = useRef();

  const toggleMenu = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClickOutside = (e) => {
    const isHamburgerMenuClicked = e.target.closest(`.${NavbarCSS.myBurger}`);

    if (
      !isHamburgerMenuClicked &&
      menuRef.current &&
      !menuRef.current.contains(e.target)
    ) {
      setOpen(false);
    }
  };

  React.useEffect(() => {
    //roles, condoOwner, renter , or mgmt
    const user = { role: "condoOwner" };
    //const user = { role: "renter" };
    //const user = { role: "mgmt" };
    setRole(user.role);

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const logout = async (e) => {
    e.preventDefault();
    //if user clicks logout then send them to the login page
    //insert logout user function here
    navigate("/login");
  };

  return (
    <>
      <nav className={NavbarCSS.myNavbar}>
        {role === "mgmt" && (
          <GiHamburgerMenu
            size={24}
            className={`${NavbarCSS.myBurger} ${NavbarCSS.myCursorPointer}`}
            onClick={toggleMenu}
          />
        )}
        <div ref={menuRef}>
          <div className={NavbarCSS.myMenuTrigger} onClick={toggleMenu}>
            {/* if there is no profile pic, we should default to using the hamburger menu */}
            {role !== "mgmt" && (
              <img src={tempProfilePic} alt="User profile picture" />
            )}
          </div>

          <div
            className={`${NavbarCSS.myDropdownMenu} ${
              open ? NavbarCSS.active : NavbarCSS.inactive
            }`}
          >
            {role === "mgmt" && (
              <h3 className={NavbarCSS.h3}>
                Hello company! <br />{" "}
              </h3>
            )}

            {role !== "mgmt" && (
              <h3 className={NavbarCSS.h3}>
                Hello first name! <br />{" "}
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

              {role === "condoOwner" && (
                <DropdownItem
                  address={"/requests"}
                  icon={<LiaHandsHelpingSolid />}
                  text={"My Requests"}
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
                  address={"/propertyprofile"}
                  icon={<IoIosBusiness />}
                  text={"Create a profile"}
                />
              )}

              {role === "mgmt" && (
                <DropdownItem
                  address={"/myemployees"}
                  icon={<FaBriefcase />}
                  text={"My employees"}
                />
              )}

              {role === "mgmt" && (
                <DropdownItem
                  address={"/myrequests"}
                  icon={<LiaHandsHelpingSolid />}
                  text={"My requests"}
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
};

function DropdownItem(props) {
  return (
    <li className={NavbarCSS.myDropdownItem}>
      <a className={NavbarCSS.atag} href={props.address}>
        {" "}
        {props.icon} {props.text}
      </a>
    </li>
  );
}

export default Navbar;
