import logo from "../assets/logo.png";

/**
 * Functional component representing a logo.
 * @returns {JSX.Element} - The JSX for the logo.
 */
const Logo = () => {
    const logoStyle = {
        width: "100px", 
        height: "auto", 
        top: "10px", 
        left: "10px", 
      };
  return (
    <img
      src={logo}
      
      alt="CondoConnect"
      className="logo"
      style={logoStyle}
    />
  );
};

export default Logo;