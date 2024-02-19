import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import AddCondoBtn from "../components/AddCondoBtn";
import BackArrowBtn from "../components/BackArrowBtn";  // Import BackArrowBtn component
import "../index.css";
import "../styling/PropertyPage.css";

const PropertyPage = () => {
    // State to represent whether the user has registered condos or not, since i dont have backend right now
    const [hasProperties, setHasProperties] = useState(false);
    const navigate = useNavigate();


    // TODO: This function simulates having properties or not. Used to decide what should be displayed on the dashboard
    const toggleHasProperties = () => {
        setHasProperties(prevHasProperties => !prevHasProperties);
    };

    return (
        <div>
            <Header />
            <BackArrowBtn /> {/* Include BackArrowBtn here */}
            <div className="center-page" >
                <div className="title_container">
                    <h3 className="DB_title"> My Property 2 </h3>
                </div>

                <div className="content_container">

                    {hasProperties ? (
                        <div className="condo_list">
                            {/* Logic to render condos goes here */}

                            <p>You have registered properties:</p>

                        </div>
                    ) : (
                        // Render registration section if the user has no properties
                        <div className="white_card">
                            <p className="card_title">You have not added any condos yet.</p>
                            {/*<p className="button"> Add a condo</p>*/}
                            <Link to="/Dashboard" className="button"> Add a condo</Link>
                            {/*"/add-condo"*/}
                        </div>
                    )}
                </div>
                {/* {hasProperties && <AddCondoBtn data-testid="add-condo-btn" onClick={() => navigate('/Dashboard')} />}*/}


                {/* TODO: This button toggles the state of whether the user has properties or not. Should be deleted once we have backend connected  */}
                {/*<button
                    onClick={toggleHasProperties}
                    data-testid="toggle">
                    Toggle Has Properties
                    </button>*/}
            </div>
            <Footer />

        </div>
    );
};

export default PropertyPage;
