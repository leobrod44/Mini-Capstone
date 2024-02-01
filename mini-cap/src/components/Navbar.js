import NavbarCSS from '../styling/Navbar.module.css'
import React, { useState, useEffect, useRef } from "react";
//import { useDispatch, useSelector } from "react-redux";

import { useNavigate } from "react-router-dom";
import logoutt from "../assets/log-out.png";

import { GiHamburgerMenu } from "react-icons/gi";
import { AiOutlineHome } from "react-icons/ai"
import { CiLogout } from "react-icons/ci"
import { CgProfile } from "react-icons/cg"
import { MdWorkOutline } from "react-icons/md"
import { IoCreateOutline } from "react-icons/io5";


const Navbar = () => {

  const navigate = useNavigate();
  //to display Hello user! message , grab the name and their profile pic
 // const firstName = useSelector(selectName);
 // const photo = useSelector(selectPhoto);

  const [open, setOpen] = useState(false);
  let menuRef = useRef();

  const toggleMenu = () => {
    setOpen((prevOpen)=> !prevOpen);
  };

  const handleClickOutside = (e) => {
    const isHamburgerMenuClicked = e.target.closest(`.${NavbarCSS.myBurger}`);
    
    if (!isHamburgerMenuClicked && menuRef.current && !menuRef.current.contains(e.target)) {
      setOpen(false);
    }
  };


  React.useEffect(() => {
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
        <GiHamburgerMenu 
        size={24} 
        className={`${NavbarCSS.myBurger} ${NavbarCSS.myCursorPointer}`} 
        onClick={toggleMenu}
        />

      <div ref={menuRef}>
          <div className={NavbarCSS.myMenuTrigger} >
            {/* insert users profile pic here*/}
           {/* <img src={photo} alt=""></img>*/}
          </div>

          <div className={`${NavbarCSS.myDropdownMenu} ${open ? NavbarCSS.active : NavbarCSS.inactive}`}>
            <h3 className={NavbarCSS.h3}>
              {/*Insert userss first name here for personalization*/}
               Hello 'first name' <br />
            </h3>
            <ul className={NavbarCSS.ul}>

              <DropdownItem
                address={"/user-profile"}
                icon={<CgProfile />}
                text={"My Profile"}
              />            
  {/*       {role === 'applicant' && 
                (<DropdownItem
                address={"/dashboard"}
                icon={<AiOutlineHome />}
                text={"Dashboard"}
              />)
            }


            {role === 'recruiter' && 
              (<DropdownItem
                address={"/job/create-job"}
                icon={<IoCreateOutline />}
                text={"Create A Job"}
              />)
            }

              {role === "recruiter" && 
              (
                <DropdownItem address={"/job/my-jobs"} text={"My Jobs"} icon={<MdWorkOutline />} />
              )
            }
              {role === "applicant" && 
              (
                <DropdownItem address={'/applications/my-applications'} text={"My applications"} icon={<MdWorkOutline />} />
              )
              } */}
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
      <a className={NavbarCSS.atag} href={props.address}> {props.icon} {props.text}</a>
    </li>

  );
}

export default Navbar;
