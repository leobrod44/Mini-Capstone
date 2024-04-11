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
import {
  getFacilities,
  getPropertiesJoinReservationAndFacilities,
} from "../backend/FacilityHandler";

/**
 * Displays a list of reservations and facilities for a user's properties.
 * Utilizes local storage to fetch user-specific data and manages
 * the display through pagination.
 *
 * @returns {JSX.Element} The reservations page component including headers,
 *                        property listings with their reservations and facilities,
 *                        and pagination.
 */
const Reservations = () => {
  const [visibleFacilities, setVisibleFacilities] = useState({});
  const [facilities, setFacilities] = useState([]);
  const [showFacilities, setShowFacilities] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const propertiesPerPage = 4; // Adjust as needed
  const [properties, setProperties] = useState([]);
  const [propertyIDs, setPropertyIDs] = useState([]);
  const [reservations, setReservations] = useState([]);

  // Fetches properties for the current user from backend services.
  // Utilizes `getUserCondos` to get the user's condo IDs from local storage,
  // and `getUsersProperty` to fetch property IDs based on those condos.
  // Sets the property IDs into the state and fetches detailed data for each property.
  // No parameters are taken as it uses data from local storage and state.
  // No return value as it updates the component's state directly.
  useEffect(() => {
    /**
   * Fetch properties for the user and set them in state.
   * @returns {Promise<void>} A Promise that resolves when properties are fetched and set.
   */
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

  // Fetches facilities associated with each property the user has.
  // Triggered after property IDs have been set, indicating that property data has been fetched.
  // Uses the `getFacilities` function from backend services to fetch facilities for each property ID.
  // Updates the `facilities` state with the results, keyed by property ID for easy access.
  useEffect(() => {
    /**
   * Fetch facilities for each property asynchronously.
   * @returns {Promise<void>} A Promise that resolves when all facilities are fetched and set.
   */
    const fetchFacilitiesForProperties = async () => {
      try {
        // Initialize an object to hold facilities data keyed by property ID
        const facilitiesPerProperty = {};
        // Iterate over each property ID to fetch its facilities
        for (const propertyID of propertyIDs) {
          // Fetch facilities for a single property
          const fetchedFacilities = await getFacilities(propertyID);
          // Update the temporary object with fetched facilities for this property
          facilitiesPerProperty[propertyID] = fetchedFacilities;
        }
        // Update state with the fetched facilities, organized by property ID
        setFacilities(facilitiesPerProperty);
      } catch (error) {
        // Log any errors encountered during the fetch operation
        console.error("Failed to fetch facilities:", error);
      }
    };
    // Execute the fetch operation if there are property IDs to fetch facilities for

    if (propertyIDs.length > 0) {
      fetchFacilitiesForProperties();
    }
  }, [propertyIDs]); // Effect depends on `propertyIDs`, re-run when they change

  /**
   * Fetches reservations and facilities data for the user's properties from the backend.
   * This operation is performed once on component mount. It leverages the backend service
   * `getPropertiesJoinReservationAndFacilities` which aggregates properties, their reservations,
   * and facilities into a single data structure for efficiency.
   *
   * The async function `fetchReservationsAndFacilities` is defined and executed within the useEffect.
   * It attempts to fetch aggregated data for the user's properties, including any reservations and
   * facilities associated with those properties. The data fetched is then set into the component's
   * state via the `setReservations` function. This operation is crucial for rendering the reservations
   * and facilities on the UI.
   *
   * No parameters are taken by the `fetchReservationsAndFacilities` function itself, as it operates
   * based on the current user's context, utilizing `store("user")` to identify the user and fetch
   * relevant data.
   *
   * There is no direct return value from `fetchReservationsAndFacilities`. However, it updates the
   * `reservations` state with the fetched data, which indirectly affects the component's render output
   * by providing the necessary data to list the user's reservations and facilities.
   *
   * Errors during the fetch operation are caught and logged to the console, aiding in debugging and
   * ensuring the app's resilience against backend issues.
   */

  useEffect(() => {
    const fetchReservationsAndFacilities = async () => {
      try {
        // Attempt to fetch aggregated data for properties, reservations, and facilities
        const propertiesWithReservationsAndFacilities =
          await getPropertiesJoinReservationAndFacilities(store("user"));

        // Update the reservations state with the fetched data
        setReservations(propertiesWithReservationsAndFacilities);

        // Optional logging for successful fetch operation
        console.log(
          "Properties with reservations and facilities:",
          propertiesWithReservationsAndFacilities
        );
      } catch (error) {
        // Log any errors encountered to assist in troubleshooting
        console.error(
          "Failed to fetch properties with reservations and facilities:",
          error
        );
      }
    };
    // Execute the fetch operation on component mount
    fetchReservationsAndFacilities();
  }, []); // Empty dependency array ensures this effect runs only once on component mount

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
                      facilityType={reservation.facilityType}
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
