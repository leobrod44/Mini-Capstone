import React, { useState } from "react";
import "../styling/Popup.css";
import "../index.css";
import { toast } from "react-toastify";
import { storeCondoKey, sendCondoKey } from "../backend/PropertyHandler";
import { checkEmailExists } from "../backend/UserHandler";
import PropTypes from "prop-types";

/**
 * Functional component representing a popup for sending a condo key.
 * @param {Object} props - The props object containing handleClose and condoId.
 * @returns {JSX.Element} - The JSX for the popup component.
 */
const Popup_SendKey = ({ handleClose, condoId }) => {
  const [formData, setFormData] = useState({
    role: "renter",
    email: "",
    condo: condoId,
  });
  Popup_SendKey.getFormData = () => {
    return formData;
  };

  // Function to handle sending the condo key
  const handleSendKey = async (e) => {
    e.preventDefault();
    // Validation checks
    try {
      if (!formData.email) {
        toast.error("Please fill in all fields.");
      }
      if (!formData.email.includes("@") || !formData.email.includes(".")) {
        toast.error(
          "Invalid email format. Please include '@' and '.' in your email address."
        );
      }

      await checkEmailExists(formData.email);
      const key = await storeCondoKey(formData);
      await sendCondoKey(formData.email, key);

      toast.success("Key has been sent.");
      handleClose();
    } catch (e) {
      toast.error(e.message);
    }
  };

  // Function to handle form input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="popup_container">
      <div className="popup_content">
        <span
          className="close_popup"
          onClick={handleClose}
          data-testid="close-button"
        >
          &times;
        </span>
        <h4 className="h4_db">Send Your Condo Key</h4>
        <form onSubmit={handleSendKey}>
          <div className="input-group">
            <label className="key_label" htmlFor="email">
              Who are you sending this key to?
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="renter">Renter</option>
              <option value="owner">Owner</option>
            </select>
          </div>

          <div className="input-group">
            <label className="key_label" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <button className="btn-reg" type="submit">
            Send Key
          </button>
        </form>
      </div>
    </div>
  );
};

// PropTypes for type-checking props
Popup_SendKey.propTypes = {
  handleClose: PropTypes.string, // Function to handle closing the popup
  condoId: PropTypes.string, // ID of the condo
};

export default Popup_SendKey;
