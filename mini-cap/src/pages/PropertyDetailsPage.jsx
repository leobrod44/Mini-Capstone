import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import AddCondoBtn from "../components/AddCondoBtn";
import BackArrowBtn from "../components/BackArrowBtn";  // Import BackArrowBtn component
import "../index.css";
import "../styling/PropertyPage.css";
import CondoMgmtComponent from "../components/CondoMGMTComponent";

const PropertyPage = () => {
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
  // Hardcoded condo details for testing
  const MgmtcondoDetails2 = {
    name: 'Property Name',
    profilePicture: 'https://t4.ftcdn.net/jpg/01/69/69/21/360_F_169692156_L1aGrmJaHsZxF1sWQGuRKn3mR60bBqhN.jpg',
    unitNumber: '103',
    parkingSpot: 'P103',
    locker: 'L103',
    userType: 'Renter'
};

    return (
        <div>
            <Header />
            <BackArrowBtn /> {/* Include BackArrowBtn here */}
            <div className="center-page" >
                <div className="title_container">
                    <h3 className="DB_title"> Property Name </h3>
                </div>

                <div >
                    {hasProperties ? (
                        <div className="condo_list">
                            {/* Logic to render condos goes here */}
                             <CondoMgmtComponent {... MgmtcondoDetails}/>
                             <CondoMgmtComponent {... MgmtcondoDetails2}/>

                      </div>
                    ) : (
                        <div className="content_container">
                            <div className="white_card">
                                <p className="card_title">You have not added any condos yet.</p>
                                {/*<p className="button"> Add a condo</p>*/}
                                <Link to="/add-condo" className="button"> Add a condo</Link>
                            </div>
                        </div>
                    )}
                </div>
                {hasProperties && <AddCondoBtn data-testid="add-condo-btn" onClick={() => navigate('/add-condo')} />}


                {/* TODO: This button toggles the state of whether the user has properties or not. Should be deleted once we have backend connected  */}
               <button
                    onClick={toggleHasProperties}
                    data-testid="toggle">
                    Toggle Has Properties
                </button>
            </div>
            <Footer />

        </div>
    );
};

export default PropertyPage;