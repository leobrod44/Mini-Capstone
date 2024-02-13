
import React, { useState, useEffect,useRef } from "react";
import "../styling/AddCondoBtn.css";


const AddCondoBtn = ({ onClick}) => {
    
    
  return (
    <div className="floating_button"  onClick={onClick}>
      <div className="button_circle">
        <span className="plus_sign">+</span>
      </div>
    </div>
  );
};


export default AddCondoBtn;