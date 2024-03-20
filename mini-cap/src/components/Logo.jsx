import React from "react";
import logo from "../assets/Logo_BiggerWriting.png";

/**
 * Functional component representing the logo of the website.
 * @returns {JSX.Element} - The JSX for the logo component.
 */
const Logo = () => {
    const logoStyle = {
        width: "140px", 
        height: "auto", 
        top: "10px", 
        left: "10px", 
      };
  return (
    <img
      src={logo}
      onClick={() => {
        window.location.href = "/";
      }}
      alt="CondoConnect"
      className="logo"
      style={logoStyle}
      data-testid="logo"
    />
  );
};

export default Logo;