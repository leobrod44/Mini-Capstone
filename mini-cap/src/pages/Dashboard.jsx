import Header from "../components/Header";
import Footer from "../components/Footer";
import "../index.css";
import "../styling/Dashboard.css";
import React, { useState,useEffect  } from "react";
import Popup from "../components/Popup";
import AddCondoBtn from "../components/AddCondoBtn";

const Dashboard =() => {
// State to represent whether the user has registered condos or not, since i dont have backend right now
const [hasCondos, setHasCondos] = useState(false);
 const [showPopup, setShowPopup] = useState(false);


  const handlePopupToggle = () => {
	setShowPopup(!showPopup);
  };

  const handleRegisterCondo = () => {
	
	console.log("Condo registered!");
	setShowPopup(false); 
	setHasCondos(true);
  };
   
   // Function to simulate having condos or not
   const toggleHasCondos = () => {
    setHasCondos(prevHasCondos => !prevHasCondos);
  };


	return(
		<div>
			<Header/>
			<div className="center-page" >
			  <div className="title_container">
				<h3 className="DB_title"> Welcome to your Condo Dashboard ! </h3>
			  </div>
		
	  		<div className="content_container">

			  {hasCondos ? (
            <div className="condo_list">
              {/* Logic to render condos goes here */}
            
              <p>You have registered condos:</p>
              
            </div>
          ) : (
            // Render registration section if the user has no condos
            <div className="white_card">
              <p className="card_title">You have not registered a condo yet.</p>
              <button
                className="button"
                onClick={handlePopupToggle}
              >
                Register my first condo
              </button>
            </div>
          )}
			</div>
			
	  		{showPopup && <Popup handleClose={handlePopupToggle} />}
			
			
			{!showPopup && hasCondos && <AddCondoBtn onClick={handlePopupToggle}/> }
		</div>
			<Footer/>
			<button onClick={toggleHasCondos}>
        Toggle Has Condos
      </button>
		</div>
	);


};

export default Dashboard;
