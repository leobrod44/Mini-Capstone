import React, { useState, useEffect } from "react";
import "../index.css";
import "../styling/FacilityForm.css";

const FacilityForm = ({ onSave, onCancel, facility, isEditing }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startHour: "",
    endHour: "",
  });

  useEffect(() => {
    if (facility) {
      setFormData({
        title: facility.name, // The property should be 'name', based on your mock data
        description: facility.description,
        startHour: facility.startHour,
        endHour: facility.endHour,
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

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  // Generate time slots for the dropdowns
  const generateTimeSlots = () => {
    const slots = [];
    for (let i = 0; i < 24; i++) {
      const hour = i.toString().padStart(2, "0");
      slots.push(`${hour}:00`, `${hour}:30`);
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  return (
    <div className="facility-form">
      <h3>
        {isEditing ? "Property - Edit Facility" : "Property - New Facility"}
      </h3>
      <form onSubmit={handleSubmit}>
        <label>
          Title:
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
          />
        </label>
        <label>
          Description:
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
        </label>
        <label>
          Available Start Time:
          <select
            name="startHour"
            value={formData.startHour}
            onChange={handleChange}
          >
            {timeSlots.map((slot) => (
              <option key={slot} value={slot}>
                {slot}
              </option>
            ))}
          </select>
        </label>
        <label>
          Available End Time:
          <select
            name="endHour"
            value={formData.endHour}
            onChange={handleChange}
          >
            {timeSlots.map((slot) => (
              <option key={slot} value={slot}>
                {slot}
              </option>
            ))}
          </select>
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
