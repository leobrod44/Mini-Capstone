import React from "react";
import "../styling/Popup.css";
import "../index.css";

const Popup = ({ handleClose, handleRegisterCondo }) => {
  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent the default form submission behavior
    const key = document.getElementById("key").value;

    handleRegisterCondo(key)
      .then(() => {
        handleClose();
        window.location.reload();
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

export default Popup;
