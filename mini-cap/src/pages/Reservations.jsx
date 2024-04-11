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
import { getFacilities, getPropertiesJoinReservationAndFacilities } from "../backend/FacilityHandler";

const Reservations = () => {
  const [visibleFacilities, setVisibleFacilities] = useState({});
  const [facilities, setFacilities] = useState([]);
  const [showFacilities, setShowFacilities] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const propertiesPerPage = 4; // Adjust as needed
  const [properties, setProperties] = useState([]);
  const [propertyIDs, setPropertyIDs] = useState([]);
  const [reservations, setReservations] = useState([]);


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


  
  useEffect(() => {
    const fetchReservationsAndFacilities = async () => {
      try {
        const propertiesWithReservationsAndFacilities = await getPropertiesJoinReservationAndFacilities(store("user"));
        setReservations(propertiesWithReservationsAndFacilities);
        console.log(
          "Properties with reservations and facilities:",
          propertiesWithReservationsAndFacilities
        );
        console.log(
        "Reservations set successfully:",
        reservations
        );
      } catch (error) {
        console.error(
          "Failed to fetch properties with reservations and facilities:",
          error
        );
      }
    };
    fetchReservationsAndFacilities();
  }, []);  



  const indexOfLastProperty = currentPage * propertiesPerPage;
  const indexOfFirstProperty = indexOfLastProperty - propertiesPerPage;

  const propertiesToDisplayPaginated = properties.slice(
    indexOfFirstProperty,
    indexOfLastProperty
  );
  return (
    <div className="pageContainer">
      <Header />
      <BackArrowBtn />
      <div className="reservations-page-container">
        <h2 style={{ textAlign: "center", fontSize: "32px", margin: "20px 0" }}>
          My Reservations
        </h2>

        {properties.map((property, index) => (
          <div key={property.propertyID} className="reserve-container">
            <h3>Property {property.propertyName}</h3>

            {reservations && reservations[index]?.reservations?.length > 0 ? (
              reservations[index].reservations.map(
                (reservation, reservationIndex) => (
                  <div key={reservationIndex}>
                    <ReservationComponent
                      facilityTitle={reservation.facilityID}
                      startTime={reservation.startTime}
                      endTime={reservation.endTime}
                      date={reservation.date}
                      month={reservation.month}
                    />
                    {console.log("temp")}
                  </div>
                )
              )
            ) : (
              <p>No Reservations made yet</p>
            )}

            <div className="facilities-card">
              <div className="facilities-header">
                <h4 style={{ marginRight: "20px" }}>
                  {property.propertyName}'s Facilities
                </h4>
              </div>
              {facilities &&
              Object.entries(facilities)[index] &&
              Object.entries(facilities)[index][1].length > 0 ? (
                Object.entries(facilities)[index][1].map(
                  (facility, facilityIndex) => (
                    <div key={facilityIndex}>
                      <FacilityComponent
                        type={facility.type}
                        description={facility.description}
                        id={facility.id}
                        propertyID={facility.propertyID}
                      />
                      {console.log(
                        "--facility name: " +
                          facility.type +
                          " description: " +
                          facility.description
                      )}
                    </div>
                  )
                )
              ) : (
                <p>No facilities available</p>
              )}
            </div>
          </div>
        ))}
        <div
          className="pagination-container"
          style={{ display: "flex", justifyContent: "center", width: "100%" }}
        >
          <Pagination
            itemsPerPage={propertiesPerPage}
            totalItems={properties.length}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        </div>
      </div>
      <Footer />
    </div>
  );
};
export default Reservations;
