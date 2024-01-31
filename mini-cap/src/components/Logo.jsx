import logo from "../assets/Logo_BiggerWriting.png";


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
    />
  );
};

export default Logo;