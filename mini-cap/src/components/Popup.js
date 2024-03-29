import React from "react";
import "../styling/Popup.css";
import "../index.css";
import { toast } from "react-toastify";
import PropTypes from 'prop-types';

/**
 * Functional component representing a popup for registering a condo.
 * @param {Object} props - The props object containing handleClose and handleRegisterCondo.
 * @returns {JSX.Element} - The JSX for the popup component.
 */
const Popup = ({ handleClose, handleRegisterCondo }) => {
  /**
   * Function to handle form submission.
   * @param {Object} event - The event object.
   */
  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent the default form submission behavior
    const key = document.getElementById("key").value;


    if (!/^[a-zA-Z0-9]{20}$/.test(key)) {
      toast.error("Key is not valid!");
      return;
    }

    handleRegisterCondo(key)
      .then(() => {
        handleClose();
       // window.location.reload();
        
      })
      .catch((error) => {
        console.error("Registration failed", error);
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
        <h4 className="h4_db">Register your condo</h4>
        <form onSubmit={handleSubmit}>
          <label className="key_label" htmlFor="key">
            Key:
          </label>
          <input type="text" id="key" data-testid="condo-key-input" />
          <button className="btn-reg" type="submit">
            Submit Key
          </button>
        </form>
      </div>
    </div>
  );
};

// PropTypes for type-checking props
Popup.propTypes = {
  handleClose: PropTypes.string, // Function to handle closing the popup
  handleRegisterCondo:PropTypes.string // Function to handle registering the condo
};
export default Popup;
