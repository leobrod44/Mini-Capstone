import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
//import "../styling/propertyform.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
//import DeleteModal from "../components/DeleteModal"; 
//import AddressComponent from "../components/AddressComponent"; 



const AddCondoForm = () => {
    const [condo, setCondo] = useState({
      unitNumber: "",
      squareFeet: "",
      unitPrice: "",
      unitSize: "",
      parkingNumber: "",
      lockerNumber: "",
      condoPicture: null,
    });
  
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setCondo({ ...condo, [name]: value });
    };
  
    const handleFileChange = (e) => {
      const file = e.target.files[0];
  
      if (!file) {
        setCondo({ ...condo, condoPicture: null });
        return;
      }
  
      // Add file type and size validation if needed
  
      setCondo({ ...condo, condoPicture: file });
    };
  
    const handleSubmit = (e) => {
      e.preventDefault();
      // Perform any additional validation if needed
      console.log("Condo Submitted:", condo);
      // Reset the form after submission
      setCondo({
        unitNumber: "",
        squareFeet: "",
        unitPrice: "",
        unitSize: "",
        parkingNumber: "",
        lockerNumber: "",
        condoPicture: null,
      });
    };
  
    return (
        <div>
          <Header />
          <form onSubmit={handleSubmit}>
        <h3>Add Condo</h3>
        <label>
          Unit Number:
          <input
            type="text"
            name="unitNumber"
            value={condo.unitNumber}
            onChange={handleInputChange}
          />
        </label>
        {/* Add similar labels and inputs for other condo fields */}
  
        <label>
          Square Feet:
          <input
            type="text"
            name="squareFeet"
            value={condo.squareFeet}
            onChange={handleInputChange}
          />
        </label>
  
        <label>
          Unit Price:
          <input
            type="text"
            name="unitPrice"
            value={condo.unitPrice}
            onChange={handleInputChange}
          />
        </label>
  
        <label>
          Unit Size:
          <select
            name="unitSize"
            value={condo.unitSize}
            onChange={handleInputChange}
          >
            <option value="">Select Unit Size</option>
            <option value="1.5">1 1/2</option>
            <option value="2.5">2 1/2</option>
            <option value="3.5">3 1/2</option>
            <option value="4.5">4 1/2</option>
            <option value="5.5">5 1/2</option>
          </select>
        </label>
  
        <label>
          Parking Spot Number:
          <input
            type="text"
            name="parkingNumber"
            value={condo.parkingNumber}
            onChange={handleInputChange}
          />
        </label>
  
        <label>
          Locker Number:
          <input
            type="text"
            name="lockerNumber"
            value={condo.lockerNumber}
            onChange={handleInputChange}
          />
        </label>
  
        <label>
          Condo Picture:
          <input
            type="file"
            onChange={handleFileChange}
          />
        </label>
  
        <button type="submit">Submit Condo</button>
        </form>
      <Footer />
    </div>
  );
};
  
  export default AddCondoForm;