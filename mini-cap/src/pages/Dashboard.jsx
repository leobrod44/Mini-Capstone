import Header from "../components/Header";
import Footer from "../components/Footer";
import CondoComponent from "../components/CondoComponent.jsx";
import "../index.css";
import "../styling/Dashboard.css";
import React, { useState} from "react";
import Popup from "../components/Popup";
import AddCondoBtn from "../components/AddCondoBtn";
import {getCondoData, linkCondoToUser} from "../backend/Fetcher";
import store from "storejs";
import {toast} from "react-toastify";

const Dashboard =() => {
// State to represent whether the user has registered condos or not, since i dont have backend right now
const [hasCondos, setHasCondos] = useState(false);
 const [showPopup, setShowPopup] = useState(false);


  const handlePopupToggle = () => {
	setShowPopup(!showPopup);
  };

  const handleRegisterCondo = async (key) => {
      let msg = "";
      try{
          msg = await linkCondoToUser(store('user'), key);
      }catch (e) {
          console.log("Error adding condo: ", e);
      }
      if(msg === "Condo added!"){
          toast.success(msg);
      }else{
          toast.error(msg);
      }
      setShowPopup(false);
      //setHasCondos(true);
  }
   
   // Function to simulate having condos or not
   const toggleHasCondos = () => {
    setHasCondos(prevHasCondos => !prevHasCondos);
  };


    // Hardcoded condo details for testing
    const condoDetails = {
        name: 'Property Name',
        profilePicture: 'https://t4.ftcdn.net/jpg/01/69/69/21/360_F_169692156_L1aGrmJaHsZxF1sWQGuRKn3mR60bBqhN.jpg',
        address: '123 Main St, City',
        unitNumber: '101',
        parkingSpot: 'P101',
        locker: 'L101',
        userType: 'Owner'
    };

    const condoDetails1 = {
        name: 'Property Name',
        profilePicture: 'https://t4.ftcdn.net/jpg/01/69/69/21/360_F_169692156_L1aGrmJaHsZxF1sWQGuRKn3mR60bBqhN.jpg',
        address: '123 Main St, City',
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
				<h3 className="DB_title"> Welcome to your Condo Dashboard ! </h3>
			  </div>
		

			  {hasCondos ? (
            <div >
              {/* Logic to render condos goes here */}
            
               <CondoComponent {...condoDetails} />
               <CondoComponent {...condoDetails1} />
              
            </div>
          ) : (
            <div className="content_container">
            <div className="white_card">
              <p className="card_title">You have not registered a condo yet.</p>
              <button
                className="button"
                onClick={handlePopupToggle}
              >
                Register my first condo
              </button>
            </div>
            </div>
          )}
			
			
	  		{showPopup && <Popup handleClose={handlePopupToggle} handleRegisterCondo={handleRegisterCondo} />}
			
			
			{!showPopup && hasCondos && <AddCondoBtn data-testid="add-condo-btn" onClick={handlePopupToggle}/> }
		</div>
			<Footer/>
      {/* TODO: This button toggles the state of whether the user has properties or not. Should be deleted once we have backend connected  */}
			<button onClick={toggleHasCondos} data-testid="toggle">
        Toggle Has Condos
      </button>
		</div>
	);



};

export default Dashboard;
