import React, { useState, useEffect } from "react";
import "../index.css";
import "../styling/FacilityForm.css";
import { addFacility, editFacility } from "../backend/FacilityHandler";
import { toast } from "react-toastify";

const FacilityForm = ({
  onSave,
  onCancel,
  facility,
  isEditing,
  propertyID,
}) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });

  const facilityNames = ["Gym", "Spa", "Pool"];

  useEffect(() => {
    if (facility) {
      setFormData({
        title: facility.type,
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
    if (!formData.title || !formData.description) {
      toast.error("Please fill in all fields.");
      return;
    }

    const facilityData = {
      title: formData.title,
      description: formData.description,
      propertyID,
    };

    try {
      if (isEditing) {
        const result = await editFacility(facility.id, facilityData); // Make sure facility.id is correct
        if (result.success) {
          toast.success(result.message);
        } else {
          toast.error(result.message);
        }
      } else {
        await addFacility(facilityData);
        toast.success("Facility added successfully!");
      }
      onSave();
    } catch (error) {
      console.error("Error saving facility:", error);
      toast.error("Failed to save facility.");
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
