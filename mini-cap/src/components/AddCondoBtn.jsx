
import React, { useState, useEffect, useRef } from "react";
import "../styling/AddCondoBtn.css";

/**
 * Functional component representing a button to add a new condo.
 * @param {Object} props - The props object containing the onClick function.
 * @returns {JSX.Element} - The JSX for the add condo button.
 */
const AddCondoBtn = ({ onClick }) => {
  /**
   * Renders the add condo button component.
   * @returns {JSX.Element} - The JSX for the add condo button.
   */
  
  return (
    <div className="floating_button" role="button" onClick={onClick} >
      <div className="button_circle">
        <span className="plus_sign">+</span>
      </div>
    </div>
  );
};


export default AddCondoBtn;