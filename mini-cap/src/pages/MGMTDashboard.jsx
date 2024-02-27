import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getProperties } from "../backend/Fetcher";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../index.css";
import "../styling/MGMTDashboard.css";
import AddCondoBtn from "../components/AddCondoBtn";
import Property from "../components/PropertyComponent";
import store from "storejs";

const MGMTDashboard = () => {
  const [hasProperties, setHasProperties] = useState(false);
  const [propertyDetails, setPropertyDetails] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const properties = await getProperties(store("user"));
        if (properties.length > 0) {
          setHasProperties(true);
          setPropertyDetails(properties);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchProperties();

  }, []); 

  // Function to toggle the hasProperties state
  const toggleHasProperties = () => {
    setHasProperties((prevHasProperties) => !prevHasProperties);
  };

  return (
    <div>
      <Header />
      <div className="center-page">
        <div className="title_container">
          <h3 className="DB_title"> Welcome to your Properties Dashboard ! </h3>
        </div>

        <div className="content_container">
          {hasProperties ? (
            <div className="condo_list">
              {/* Render properties */}
              {propertyDetails.map((p, index) => (
                <Property key={index} property={{
                  picture: p.picture,
                  propertyID: p.propertyID,
                  propertyName: p.propertyName,
                  address: p.address,
                  unitCount: p.unitCount,
                  parkingCount: p.parkingCount,
                  lockerCount: p.lockerCount
              } } />
              ))}
            </div>
          ) : (
            // Render registration section if the user has no properties
            <div className="white_card">
              <p className="card_title">You have not created a property yet.</p>
              <Link to="/add-property" className="button">
                {" "}
                Create my first Property
              </Link>
            </div>
          )}
        </div>

        {hasProperties && <AddCondoBtn data-testid="add-condo-btn" onClick={() => navigate("/add-property")} />}
      </div>
      <Footer />
    </div>
  );
};

export default MGMTDashboard;
