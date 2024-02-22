import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styling/AddCondoForm.css";
import Header from "../components/Header";
import Footer from "../components/Footer";




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
    const [previewCondoImage, setPreviewCondoImage] = useState(null);
    const handleFileChange = (e) => {
      const file = e.target.files[0];
  
      if (!file) {
        setCondo({
          ...condo,
          picture: null,
        });
      }
  
      if (!["image/png", "image/jpeg", "image/jpg"].includes(file.type)) {
        toast.error("File type not supported");
        return;
      }
  
      if (file.size > 2097152) {
        toast.error("File must be less than 2 MB");
        return;
      }
  
      setCondo({
        ...condo,
        condoPicture: file,
      });
  
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewCondoImage(reader.result);
      };
  
      reader.readAsDataURL(file);
    };
  
    const handleInputChange = (e) => {
      const { name, value } = e.target;
    
      // Check if the input is for unitPrice and if it contains only numbers
      if (name === "unitPrice" && !(/^\d*\.?\d*$/).test(value)) {
        toast.error("Please enter a valid number for Unit Price");
        return;
      }
    
      setCondo((prevCondo) => ({ ...prevCondo, [name]: value }));
    };
  
   
  
    const handleSubmit = (e) => {
      e.preventDefault();
    
      // Check if any field is empty
      for (const key in condo) {
        if (condo.hasOwnProperty(key) && condo[key] === "") {
          toast.error("All fields must be filled");
          return;
        }
      }
    
      // Additional validation logic if needed
    
      // If all validation passes, submit the condo
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
          
<div className="add-condo-container">
<form className="add-condo-form" onSubmit={handleSubmit}>
<h3>Add a Condo</h3>
<link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css"
        integrity="sha384-rbsA2VBKQhggwzxH7pPCaAqO46MgnOM80zW1RWuH61DGLwZJEdK2Kadq2F9CUG65"
        crossOrigin="anonymous"
      />
<label className="input-label" htmlFor="condoPicture">
<label className="form-label mt-3" htmlFor="customFile">
             Condo Picture:
             </label> </label>

              <input
                type="file"
                className="form-control"
                id="customFile"
                onChange={(e) => handleFileChange(e)}
                
              />
          
          {previewCondoImage && (
            <div className="condo-image-preview">
              <img src={previewCondoImage} alt="Condo Preview" />
            </div>
          )}
           
          <div className="input-group mt-3"></div>
          <div className="input-group">
            <label className="input-label" htmlFor="unitNumber">
        
          Unit Number:
          </label>
          <input
            type="text"
            name="unitNumber"
            value={condo.unitNumber}
            onChange={(e) => handleInputChange(e)}
            
          />
        
        </div>
        
  
        <div className="input-group">
            <label className="input-label" htmlFor="squareFeet">
          Square Feet:
          </label>
          <input
            type="text"
            name="squareFeet"
            value={condo.squareFeet}
            onChange={(e) => handleInputChange(e)}
            
            />
      
          </div>
          
        <div className="input-group">
        <label className="input-label" htmlFor="unitSize">
        
          Unit Size:
          </label>
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
          </div>
        
  
          <div className="input-group">
        <label className="input-label" htmlFor="parkingNumber">
          Parking Spot:
          </label>
          <input
            type="text"
            name="parkingNumber"
            value={condo.parkingNumber}
            onChange={handleInputChange}
          />
          </div>
        
          <div className="input-group">
        <label className="input-label" htmlFor="lockerNumber">
        
          Locker:
          </label>
          <input
            type="text"
            name="lockerNumber"
            value={condo.lockerNumber}
            onChange={handleInputChange}
          />
         </div>
  
         
         <label className="input-label" htmlFor="unitPrice">Unit Price:</label>
         <div className="input-group">
    <select
      value={condo.currency}
      onChange={(e) => handleInputChange(e)}
      name="currency"
      className="form-select custom-select"
    >
      <option value="CAD">CAD $</option>
      <option value="USD">USD $</option>
      <option value="Euro">Euro €</option>
    </select>
    <input
      type="text"
      value={condo.unitPrice}
      onChange={(e) => handleInputChange(e)}
      name="unitPrice"
      className="form-control"
    />
  </div>




<button className="add-condo-button" type="submit"
             onClick={handleSubmit}
             >
              Submit Condo
            </button>
        </form>
        </div>
      <Footer />
    </div>
  );
};
  
  export default AddCondoForm;