import React, { useState } from "react";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import BackArrowBtn from "../components/BackArrowBtn.jsx";
import "../index.css";
import "../styling/PropertyFacilities.css";

export default function PropertyFacilities() {
  const [facilities, setFacilities] = useState([]); // This will hold your facilities data
  const [isEditMode, setIsEditMode] = useState(false); // To toggle between edit mode and view mode
  const [currentFacility, setCurrentFacility] = useState(null); // To keep track of the facility being edited

  // Handlers for CRUD operations (these can be empty or with console.log for now)
  const handleAddFacility = () => {
    console.log("Add facility logic here");
  };

  const handleEditFacility = (facility) => {
    setCurrentFacility(facility);
    setIsEditMode(true);
  };

  const handleSaveFacility = (facility) => {
    console.log("Save facility logic here");
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
      <BackArrowBtn /> {/* Include BackArrowBtn here */}
      <h3 className="facilities-title">Property Facilities</h3>
      <div className="facilities-container">
        <button className="facility-action-button" onClick={handleAddFacility}>
          Add Facility
        </button>
        {/* Temporary rendering of a single facility */}
        {!isEditMode && (
          <div className="facility-card">
            <h5>{mockFacility.name}</h5>
            <p>{mockFacility.description}</p>
            <p>
              Hours: {mockFacility.startHour} - {mockFacility.endHour}
            </p>
            <button
              className="edit-button"
              onClick={() => handleEditFacility(mockFacility)}
            >
              Edit
            </button>
            <button
              className="edit-button delete-button"
              onClick={() => handleDeleteFacility(mockFacility.id)}
            >
              Delete
            </button>
          </div>
        )}
        {/* Edit mode form */}
        {isEditMode && currentFacility && (
          <div className="edit-facility-form">
            <input
              type="text"
              value={currentFacility.name}
              // ... more attributes and other form elements
            />
            <button
              className="facility-action-button"
              type="button"
              onClick={() => handleSaveFacility(currentFacility)}
            >
              Save
            </button>
            <button
              className="facility-action-button"
              type="button"
              onClick={handleCancelEdit}
            >
              Cancel
            </button>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
