import logo from "../assets/logo.png";


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