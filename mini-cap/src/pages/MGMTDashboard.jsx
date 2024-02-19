import Header from "../components/Header";
import Footer from "../components/Footer";
import "../index.css";
import "../styling/MGMTDashboard.css";
import React, { useState } from "react";
import AddCondoBtn from "../components/AddCondoBtn";
import { Link, useNavigate } from "react-router-dom";
import CondoMgmtComponent from "../components/CondoMGMTComponent";

const MGMTDashboard =() => {
// State to represent whether the user has registered condos or not, since i dont have backend right now
const [hasProperties, setHasProperties] = useState(false);
 const navigate = useNavigate();

   
   // TODO: This function simulates having properties or not. Used to decide what should be displayed on the dashboard
   const toggleHasProperties = () => {
    setHasProperties(prevHasProperties => !prevHasProperties);
  };

  // Hardcoded condo details for testing
  const MgmtcondoDetails = {
    name: 'Property Name',
    profilePicture: 'https://t4.ftcdn.net/jpg/01/69/69/21/360_F_169692156_L1aGrmJaHsZxF1sWQGuRKn3mR60bBqhN.jpg',
    unitNumber: '102',
    parkingSpot: 'P102',
    locker: 'L102',
    userType: 'Renter'
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
              <CondoMgmtComponent {... MgmtcondoDetails}/>

            </div>
          ) : (
            // Render registration section if the user has no properties
            <div className="white_card">
              <p className="card_title">You have not created a property yet.</p>
              <Link to="/add-property" className="button"> Create my first Property</Link>
              
            </div>
          )}
			</div>
	  		
			{ hasProperties && <AddCondoBtn data-testid="add-condo-btn" onClick={() => navigate('/add-property')} /> }
		 
     
     {/* TODO: This button toggles the state of whether the user has properties or not. Should be deleted once we have backend connected  */}
     <button 
     onClick={toggleHasProperties} 
     data-testid="toggle">
                Toggle Has Properties
      </button>
    </div>
			<Footer/>
    
		</div>
	);


};

export default MGMTDashboard;
