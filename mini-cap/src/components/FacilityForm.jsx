import React, { useState, useEffect } from "react";
import "../index.css";
import "../styling/FacilityForm.css";
import { addFacility } from "../backend/FacilityHandler";

const FacilityForm = ({ onSave, onCancel, facility, isEditing }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });

  const facilityNames = ["Gym", "Spa", "Pool"];

  useEffect(() => {
    if (facility) {
      setFormData({
        title: facility.name,
        description: facility.description,
      });
    }
  }, [facility]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation for the description
    if (!formData.description.trim()) {
      alert("Description cannot be empty.");
      return;
    }

    // Include fixed start and end times
    const dataToSave = {
      ...formData,
      startHour: "08:00",
      endHour: "22:00",
    };

    onSave(dataToSave);
    try {

      await addFacility(dataToSave);
    } catch (e) {
      console.error(e);
    }

  };

  return (
    <div className="facility-form">
      <h3>{isEditing ? "Edit Facility" : "New Facility"}</h3>
      <form onSubmit={handleSubmit}>
        <label>
          Title:
          <select
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          >
            <option value="" disabled>
              Select a Facility
            </option>
            {facilityNames.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Description:
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </label>
        <div className="form-button-group">
          <button type="submit" className="edit-button">
            Save
          </button>
          <button type="button" onClick={onCancel} className="delete-button">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default FacilityForm;
