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
import store from "storejs";
import {getCompanyData, getProfilePicture, getUserData} from "../backend/Fetcher";

const Navbar = () => {
  const navigate = useNavigate();
  //to display Hello user! message , grab the name and their profile pic
  // const firstName = useSelector(selectName);
  // const photo = useSelector(selectPhoto);
  const [role, setTheRole] = useState(""); // <-- State to store user role
  const [open, setOpen] = useState(false);

  const [firstName, setFirstName] = useState(null);
  const [companyName, setCompanyName] = useState(null);
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

    async function fetchUserData() {
      let role = store("role");
      let tempData;
      setTheRole(role);
      if (role === "mgmt") {
        tempData = await getCompanyData(store("user"));
        setCompanyName(tempData.companyName);
      }
      else if (role === "renter/owner"){
        tempData = await getUserData(store("user"));
        setFirstName(tempData.firstName)
      }

    }

    fetchUserData();

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const logout = async (e) => {
    e.preventDefault();
    store.remove("user");
    store.remove("role");
    navigate("/login");
  };

  return (
    <>
      <nav className={NavbarCSS.myNavbar}>
       {/*  {role === "mgmt" && (
          <GiHamburgerMenu
            size={24}
            className={`${NavbarCSS.myBurger} ${NavbarCSS.myCursorPointer}`}
            onClick={toggleMenu}
          />
        )} */}
        {store.get('?user') && (
          <div ref={menuRef}>
            <div className={NavbarCSS.myMenuTrigger} onClick={toggleMenu}>
              {/* if there is no profile pic, we should default to using the hamburger menu */}
             {/*  {role !== "mgmt" && ( */}
                <img src={tempProfilePic} alt="User profile picture" />
            {/*  )} */}
            </div>

            <div
              className={`${NavbarCSS.myDropdownMenu} ${
                open ? NavbarCSS.active : NavbarCSS.inactive
              }`}
            >
              {store("role") !== "renter/owner" && (
                  <h3 className={NavbarCSS.h3}>
                    Hello company! <br />{" "}
                  </h3>
              )}

              {store("role") === "renter/owner" && (
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

                {store("role") === "renter/owner" && (
                    <DropdownItem
                        address={"/dashboard"}
                        icon={<IoIosBusiness />}
                        text={"Dashboard"}
                    />
                )}

                {store("role") === "renter/owner" && (
                    <DropdownItem
                        address={"/requests"}
                        icon={<LiaHandsHelpingSolid />}
                        text={"My Requests"}
                    />
                )}

                {store("role") === "renter/owner" && (
                    <DropdownItem
                        address={"/myproperty"}
                        icon={<AiOutlineHome />}
                        text={"My rental"}
                    />
                )}

                {store("role") !== "renter/owner" && (
                    <DropdownItem
                        address={"/propertyprofile"}
                        icon={<IoIosBusiness />}
                        text={"My properties "}
                    />
                )}

                {store("role") !== "renter/owner" && (
                    <DropdownItem
                        address={"/myemployees"}
                        icon={<FaBriefcase />}
                        text={"My employees"}
                    />
                )}

                {store("role") !== "renter/owner" && (
                    <DropdownItem
                        address={"/myrequests"}
                        icon={<LiaHandsHelpingSolid />}
                        text={"My requests"}
                    />
                )}
                {store("role") === "renter/owner" && (
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
