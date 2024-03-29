import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getProperties } from "../backend/PropertyHandler";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../index.css";
import "../styling/MGMTDashboard.css";
import AddCondoBtn from "../components/AddCondoBtn";
import Property from "../components/PropertyComponent";
import store from "storejs";
import Pagination from "../components/Pagination";
import "../styling/Pagination.css";

/**
 * Functional component representing the Management Dashboard.
 * @returns {JSX.Element} Management Dashboard component.
 */
const MGMTDashboard = () => {
  const [hasProperties, setHasProperties] = useState(false);
  const [propertyDetails, setPropertyDetails] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
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

  //constants for pagination
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
            <div className="condo_list" data-testid="condo-list">
              {/* Render properties */}
              {propertiesToDisplayPaginated.map((p, index) => (
                <Property
                  key={index}
                  property={{
                    picture: p.picture,
                    propertyID: p.propertyID,
                    propertyName: p.propertyName,
                    address: p.address,
                    unitCount: p.unitCount,
                    parkingCount: p.parkingCount,
                    lockerCount: p.lockerCount,
                  }}
                  data-testid="property-component"
                />
              ))}
              <div className="pagination-container" style={{display:"flex", justifyContent:"center", width:"100%"}}>
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

        {hasProperties && (
          <AddCondoBtn
            data-testid="add-condo-btn"
            onClick={() => navigate("/add-property")}
          />
        )}
      </div>
      <Footer />
    </div>
  );
};

export default MGMTDashboard;
