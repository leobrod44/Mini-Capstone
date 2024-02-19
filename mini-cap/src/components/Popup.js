import React from "react";
import "../styling/Popup.css";
import "../index.css";

const Popup = ({ handleClose }) => {
  return (
    <div className="popup_container">
      <div className="popup_content">
        <span className="close_popup" onClick={handleClose} data-testid="close-button">
          &times;
        </span>
        <h4 className="h4_db">Register your condo</h4>
        <form onSubmit={handleClose}>
          <label className="key_label" htmlFor="key">Key:</label>
          <input type="text" id="key" />
          <button className="btn-reg" type="submit">Submit Key</button>
        </form>
      </div>
    </div>
  );
};

export default Popup;