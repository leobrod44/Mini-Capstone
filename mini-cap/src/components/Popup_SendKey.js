import React, { useState } from "react";
import "../styling/Popup.css";
import "../index.css";
import { toast } from "react-toastify";
import {storeCondoKey, checkEmailExists} from "../backend/Fetcher";
import { RENTER_OWNER } from "../backend/Constants";

const Popup_SendKey = ({ handleClose, condoId }) => {
    const [showPopup, setShowPopup] = useState(true);
    const [formData, setFormData] = useState({
        role: RENTER_OWNER, //default for now
        email: "",
        condo: condoId
      });
      Popup_SendKey.getFormData = () => {
        return formData;
      };


      const handleSendKey = async (e) => {
          e.preventDefault();
          try {
              if (!formData.email ) {
                  toast.error("Please fill in all fields.");
              }
              if (!formData.email.includes("@") || !formData.email.includes(".")) {
                  toast.error("Invalid email format. Please include '@' and '.' in your email address.");
              }

              await checkEmailExists(formData.email);
              await storeCondoKey(formData);

              toast.success("Key has been sent.")
              setShowPopup(false);
          } catch (e) {
              toast.error(e.message);
          }
      };

      
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };


  return (
    <div className="popup_container">
      <div className="popup_content">
        <span className="close_popup" onClick={handleClose} data-testid="close-button">
          &times;
        </span>
        <h4 className="h4_db">Send Your Condo Key</h4>
        <form onSubmit={handleClose}>
        
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

          <button className="btn-reg" type="submit" onClick={handleSendKey}>Send Key</button>
        </form>
      </div>
    </div>
  );
};

export default Popup_SendKey;