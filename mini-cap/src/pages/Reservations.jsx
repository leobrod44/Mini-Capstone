import React from "react";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import BackArrowBtn from "../components/BackArrowBtn.jsx";
import { useState, useEffect } from "react";
import { MdExpandMore, MdExpandLess } from "react-icons/md";
import Pagination from "../components/Pagination";
import "../styling/Pagination.css";
import "../styling/Reservations.css";
import ReservationComponent from "../components/ReservationComponent.jsx";
import FacilityComponent from "../components/FacilityComponent.jsx";
import store from "storejs";
import { getUserCondos, getPropertyData } from "../backend/PropertyHandler.js";
import { getUsersProperty } from "../backend/ImageHandler.js";
import { getFacilities } from "../backend/FacilityHandler";

const Reservations = () => {
  const [visibleFacilities, setVisibleFacilities] = useState({});
  const [facilities, setFacilities] = useState([]);
  const [showFacilities, setShowFacilities] = useState(false);

  ////
  const [properties, setProperties] = useState([]);
  const [propertyIDs, setPropertyIDs] = useState([]);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        // Fetch properties for the user
        const userCondos = await getUserCondos(store("user"));
        const propertyIDs = await getUsersProperty(userCondos);
        setPropertyIDs(propertyIDs);

        const propertyDataPromises = propertyIDs.map(async (propertyID) => {
          return getPropertyData(propertyID);
        });

        // Wait for all property data to be fetched
        const properties = await Promise.all(propertyDataPromises);
        setProperties(properties);
        console.log("PROPERTIES THAT HAVE BEEN FETCHED:", properties);
        console.log("PROPERTY IDS THAT HAVE BEEN FETCHED:", propertyIDs);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProperties();
  }, []);
  useEffect(() => {
    const fetchFacilitiesForProperties = async () => {
      try {
        const facilitiesPerProperty = {};
        for (const propertyID of propertyIDs) {
          const fetchedFacilities = await getFacilities(propertyID);
          facilitiesPerProperty[propertyID] = fetchedFacilities;
          console.log(
            `Facilities for property ${propertyID}:`,
            fetchedFacilities
          );
        }
        setFacilities(facilitiesPerProperty);
      } catch (error) {
        console.error("Failed to fetch facilities:", error);
      }
    };

    if (propertyIDs.length > 0) {
      fetchFacilitiesForProperties();
    }
  }, [propertyIDs]);

  const toggleFacilities = (propertyId) => {
    setVisibleFacilities((prevState) => ({
      ...prevState,
      [propertyId]: !prevState[propertyId],
    }));
  };

  return (
    <div className="pageContainer">
      <Header />
      <BackArrowBtn />
      <div className="reservations-page-container">
        <h2 style={{ textAlign: "center", fontSize: "32px", margin: "20px 0" }}>
          My Reservations
        </h2>

        {properties.map((property) => (
          <div key={property.id} className="reserve-container">
            <h3>Property {property.propertyName}</h3>
            <ReservationComponent propertyId={property.id} />
            <div className="facilities-header">
              <h5 style={{ marginRight: "20px" }}>Show Property Facilities</h5>
              <button
                className="facilities-button"
                onClick={() => toggleFacilities(property.propertyName)}
              >
                {visibleFacilities[property.id] ? (
                  <MdExpandLess />
                ) : (
                  <MdExpandMore />
                )}
              </button>
            </div>
            {visibleFacilities[property.propertyName] &&
              (facilities[property.propertyName] &&
              facilities[property.propertyName].length > 0 ? (
                facilities[property.propertyName].map((facility, index) => (
                  <FacilityComponent
                    key={index}
                    type={facility.type}
                    description={facility.description}
                  />
                ))
              ) : (
                <p>No available facilities</p>
              ))}
          </div>
        ))}
      </div>
      <Footer />
    </div>
  );
};

export default Reservations;
