import React, { useState } from "react";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import BackArrowBtn from "../components/BackArrowBtn.jsx";
import "../index.css";
import "../styling/PropertyFacilities.css";
import FacilityForm from "../components/FacilityForm";

export default function PropertyFacilities() {
  const [facilities, setFacilities] = useState([]); // This will hold your facilities data
  const [isEditMode, setIsEditMode] = useState(false); // To toggle between edit mode and view mode
  const [currentFacility, setCurrentFacility] = useState(null); // To keep track of the facility being edited

  const handleAddFacility = () => {
    setCurrentFacility(null);
    setIsEditMode(true);
  };

  const handleEditFacility = (facility) => {
    setCurrentFacility(facility);
    setIsEditMode(true);
  };

  const handleSaveFacility = (facility) => {
    if (currentFacility) {
      // Update existing facility
      console.log("Update facility logic here");
    } else {
      // Add new facility
      console.log("Add new facility logic here");
    }
    setIsEditMode(false);
  };

  const handleDeleteFacility = (facilityId) => {
    console.log("Delete facility logic here");
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
  };

  // Temporary mock facility for display
  const mockFacility = {
    id: 1,
    name: "Gym",
    description: "Apes together... strong.",
    startHour: "06:00",
    endHour: "22:00",
  };

  return (
    <div className="pageContainer">
      <Header />
      <BackArrowBtn />

      <h3 className="facilities-title">Property Facilities</h3>
      <div className="facilities-container">
        {!isEditMode && (
          <>
            <button
              className="facility-action-button"
              onClick={handleAddFacility}
            >
              Add Facility
            </button>
          </>
        )}
        {/* Conditional rendering based on edit mode */}
        {isEditMode ? (
          // Render the FacilityForm when in edit mode
          <FacilityForm
            onSave={handleSaveFacility}
            onCancel={handleCancelEdit}
            facility={currentFacility}
            isEditing={currentFacility !== null}
          />
        ) : (
          // This is the temporary rendering of a single facility
          <div className="facility-card">
            <h5>{mockFacility.name}</h5>
            <p>{mockFacility.description}</p>
            <p>
              Hours: {mockFacility.startHour} - {mockFacility.endHour}
            </p>
            <div className="button-group">
              <button
                className="edit-button delete-button"
                onClick={() => handleDeleteFacility(mockFacility.id)}
              >
                Delete
              </button>
              <button
                className="edit-button"
                onClick={() => handleEditFacility(mockFacility)}
              >
                Edit
              </button>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
