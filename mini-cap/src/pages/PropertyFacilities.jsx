import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import BackArrowBtn from "../components/BackArrowBtn.jsx";
import "../index.css";
import "../styling/PropertyFacilities.css";
import FacilityForm from "../components/FacilityForm";
import { getFacilities, deleteFacility } from "../backend/FacilityHandler";
import { getPropertyData } from "../backend/PropertyHandler";
import { toast, ToastContainer } from "react-toastify";
import Pagination from "../components/Pagination";

export default function PropertyFacilities() {
  const { propertyID } = useParams();
  const [facilities, setFacilities] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentFacility, setCurrentFacility] = useState(null);
  const [propertyName, setPropertyName] = useState(""); // State to store the property name
  const [currentPage, setCurrentPage] = useState(1);
  const facilitiesPerPage = 4;

  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        const facilitiesData = await getFacilities(propertyID);
        // Map the Firestore documents to your state structure
        const mappedFacilities = facilitiesData.map((doc) => ({
          id: doc.id,
          type: doc.type,
          description: doc.description,
          startHour: "08:00",
          endHour: "22:00",
        }));
        console.log("Facilities:", mappedFacilities);
        setFacilities(mappedFacilities);
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch facilities.");
      }
    };
    fetchFacilities();
  }, [propertyID]);

  useEffect(() => {
    const fetchPropertyName = async () => {
      try {
        const propertyData = await getPropertyData(propertyID);
        if (propertyData) {
          setPropertyName(propertyData.propertyName); // Assuming the property name is stored under the key 'name'
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch property name.");
      }
    };
    fetchPropertyName();
  }, [propertyID]);

  const indexOfLastFacility = currentPage * facilitiesPerPage;
  const indexOfFirstFacility = indexOfLastFacility - facilitiesPerPage;
  const currentFacilities = facilities.slice(
    indexOfFirstFacility,
    indexOfLastFacility
  );

  const handleAddFacility = () => {
    setCurrentFacility(null);
    setIsEditMode(true);
  };

  const handleEditFacility = (facility) => {
    console.log("Editing facility with ID:", facility.id); // Log the facility ID
    setCurrentFacility(facility);
    setIsEditMode(true);
  };

  const handleSaveFacility = async () => {
    setIsEditMode(false);
    // Fetch the updated list of facilities
    try {
      const updatedFacilities = await getFacilities(propertyID);
      setFacilities(
        updatedFacilities.map((doc) => ({
          id: doc.id,
          type: doc.type,
          description: doc.description,
          startHour: "8:00 AM",
          endHour: "5:00 PM",
        }))
      );
      //toast.success("Facility updated successfully!");
    } catch (error) {
      console.error("Error fetching updated facilities:", error);
      toast.error("Failed to fetch updated facilities.");
    }
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
  };

  const handleDeleteFacility = async (facilityId) => {
    console.log("Deleting facility with facilityID:", facilityId); // Log the facilityId
    try {
      await deleteFacility(propertyID, facilityId);
      toast.success("Facility deleted successfully!");
      setFacilities(
        facilities.filter((facility) => facility.id !== facilityId)
      );
    } catch (error) {
      console.error("Error deleting facility:", error);
      toast.error("Failed to delete facility.");
    }
  };

  return (
    <div className="pageContainer">
      <Header />
      <BackArrowBtn />

      <h3 className="facilities-title">{propertyName} Facilities</h3>
      <div className="facilities-container">
        {!isEditMode && (
          <>
            {facilities.length === 0 ? (
              <div className="facility-card no-facilities-card">
                <p className="no-facilities-text">
                  You have not added any facilities yet.
                </p>
                <button
                  className="facility-action-button"
                  onClick={handleAddFacility}
                >
                  Add Facility
                </button>
              </div>
            ) : (
              <>
                <button
                  className="facility-action-button"
                  onClick={handleAddFacility}
                >
                  Add Facility
                </button>
                {currentFacilities.map((facility) => (
                  <div key={facility.id} className="facility-card">
                    <h5>{facility.type}</h5>
                    <p>{facility.description}</p>
                    <p>
                      Hours: {facility.startHour} - {facility.endHour}
                    </p>
                    <div className="button-group">
                      <button
                        className="edit-button delete-button"
                        onClick={() => handleDeleteFacility(facility.id)}
                      >
                        Delete
                      </button>
                      <button
                        className="edit-button"
                        onClick={() => handleEditFacility(facility)}
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                ))}
              </>
            )}
          </>
        )}
        {isEditMode && (
          <FacilityForm
            onSave={handleSaveFacility}
            onCancel={handleCancelEdit}
            facility={currentFacility}
            isEditing={currentFacility !== null}
            propertyID={propertyID}
            data-testid="facility-form"
          />
        )}
        <div className="pagination-container">
          <Pagination
            itemsPerPage={facilitiesPerPage}
            totalItems={facilities.length}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        </div>
      </div>
      <Footer />
      <ToastContainer />
    </div>
  );
}
