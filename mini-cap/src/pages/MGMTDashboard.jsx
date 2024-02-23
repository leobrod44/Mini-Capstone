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
import Pagination from "../components/Pagination";
import "../styling/Pagination.css";


const MGMTDashboard = () => {
  const [hasProperties, setHasProperties] = useState(false);
  const [propertyDetails, setPropertyDetails] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const propertyDetails = await getProperties(store("loggedUser"));
        if (propertyDetails.length > 0) {
          setHasProperties(true);
          setPropertyDetails(propertyDetails);
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


  const propertiesPerPage = 4;
  const indexOfLastProperty = currentPage * propertiesPerPage;
  const indexOfFirstProperty = indexOfLastProperty - propertiesPerPage;


  const propertiesToDisplayPaginated = propertyDetails.slice(
    indexOfFirstProperty,
    indexOfLastProperty
  );

  return (
    <div>
      <Header />
      <div className="center-page">
        <div className="title_container">
          <h3 className="DB_title"> Welcome to your Properties Dashboard ! </h3>
        </div>

        <div className="content_container">
          {hasProperties ? (
            <div>
            <div className="condo_list">
              {/* Render properties */}
              {propertiesToDisplayPaginated.map((p, index) => (
                <Property key={index} property={{
                  propertyID: p.propertyID,
                  propertyName: p.property,
                  address: p.address,
                  unitCount: p.unitCount,
                  parkingCount: p.parkingCount,
                  lockerCount: p.lockerCount
              } } />
              ))}
            </div>
            <div className="pagination-container">
                <Pagination
                  itemsPerPage={propertiesPerPage}
                  totalItems={propertyDetails.length}
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                />
              </div>
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

        {/* Button to toggle hasProperties state (for testing purposes) */}
        <button onClick={toggleHasProperties} data-testid="toggle">
          Toggle Has Properties
        </button>
      </div>
      <Footer />
    </div>
  );
};

export default MGMTDashboard;
