import Header from "../components/Header";
import Footer from "../components/Footer";
import "../index.css";
import "../styling/MGMTDashboard.css";
import React, { useState } from "react";
import AddCondoBtn from "../components/AddCondoBtn";
import { Link, useNavigate } from "react-router-dom";

const MGMTDashboard =() => {
// State to represent whether the user has registered condos or not, since i dont have backend right now
const [hasProperties, setHasProperties] = useState(false);
 const [showPopup, setShowPopup] = useState(false);
 const navigate = useNavigate();



  const handlePopupToggle = () => {
	setShowPopup(!showPopup);
  };

  const handleRegisterProperties = () => {
	
	console.log("Property registered!");
	setShowPopup(false); 
	setHasProperties(true);
  };
   
   // Function to simulate having condos or not
   const toggleHasCondos = () => {
    setHasProperties(prevHasProperties => !prevHasProperties);
  };


	return(
		<div>
			<Header/>
			<div className="center-page" >
			  <div className="title_container">
				<h3 className="DB_title"> Welcome to your Properties Dashboard ! </h3>
			  </div>
		
	  		<div className="content_container">

			  {hasProperties ? (
            <div className="condo_list">
              {/* Logic to render condos goes here */}
            
              <p>You have registered properties:</p>
              
            </div>
          ) : (
            // Render registration section if the user has no condos
            <div className="white_card">
              <p className="card_title">You have not created a property yet.</p>
              <Link to="/add-property" className="button"> Create my first Property</Link>
              
            </div>
          )}
			</div>
			
			{ hasProperties && <AddCondoBtn data-testid="add-condo-btn" onClick={() => navigate('/add-property')} /> }
		</div>
			<Footer/>
			<button onClick={toggleHasCondos} data-testid="toggle">
                Toggle Has Properties
            </button>
		</div>
	);


};

export default MGMTDashboard;
