/**
 * React component for adding and submitting property details including condos.
 * @module PropertyForm
 */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styling/propertyform.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import AddressComponent from "../components/AddressComponent"; 
import { addProperty } from "../backend/PropertyHandler";
/**
 * Functional component representing a form for adding property details.
 * @returns {JSX.Element} JSX component
 */
const PropertyForm = () => {
    // State hooks for managing property data and UI states

  const [property, setProperty] = useState({
    picture: null,
    propertyName: "",
    address: "",
    unitCount: "",
    parkingCount: "",
    parkingCost: "",
    lockerCount: "",
    lockerCost: "",
    condos: [],
  });

  
  const [previewPropertyImage, setPreviewPropertyImage] = useState(null);
  const navigate = useNavigate();

   
/**
   * Handles file input change for the property image.
   * Reads the selected file and sets the preview image.
   * @param {Event} e - The file change event triggered when a file is selected.
   */  
  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (!file) {
      setProperty({
        ...property,
        picture: null,
      });
    }
    //validation for file type, if not supported toasts an error
    if (!["image/png", "image/jpeg", "image/jpg"].includes(file.type)) {
      toast.error("File type not supported");
      return;
    }
    //validation for file size, if not supported toasts an error
    if (file.size > 2097152) {
      toast.error("File must be less than 2 MB");
      return;
    }
   // if all checks pass, set the property picture state with the selected file
    setProperty({
      ...property,
      picture: file,
    });
         // Create a new instance of FileReader to read the file
    const reader = new FileReader();
      // Define an onloadend event handler for the FileReader
    reader.onloadend = () => {
           // When the file reading is complete, set the preview property image state
           // with the data URL representing the file content
      setPreviewPropertyImage(reader.result);
    };
       // Read the selected file as a data URL
    reader.readAsDataURL(file);
  };


  
  



/**
 * Handles input change for general input fields.
 * Parses input values and performs minimum value validation for number input fields.
 * Updates the corresponding property state with the new input value.
 * @param {Event} e - The input change event triggered when a value is entered.
 */
  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
  
    // Parse the value as an integer for number input fields
    const parsedValue = type === 'number' ? parseInt(value, 10) : value;
  
    // Check for minimum value validation
    if (type === 'number' && parsedValue <1) {
      toast.error(`Count or Price must be greater than  0`);
      return;
    }
    if (name === "lockerCount" && parseInt(value) > 30) {
      toast.error("Locker count cannot exceed 30");
      return;
    }
    if (name === "parkingCount" && parseInt(value) > 30) {
      toast.error("Parking count cannot exceed 30");
      return;
    }
    setProperty({
      ...property,
      [name]: parsedValue,
    });
  };
  /**
 * Handles the form submission.
 * Prevents the default form submission behavior and performs validation on required information.
 * If all required fields are filled, saves the property by calling the addProperty function.
 * Navigates to "/MGMTDashboard" upon successful property addition.
 * Logs the submitted property information.
 * @param {Event} e - The form submission event.
 */
  const handleSubmit = async (e) => {
    e.preventDefault();
  //validation that all required information is filled in
    if (
      !property.propertyName ||
      !property.address ||
      !property.unitCount ||
      !property.parkingCount ||
      !property.lockerCount ||
      !property.lockerCost ||
      !property.parkingCost
  
    ) {
      toast.error("Missing Property Information");
      return;
    }
    // if all required field are filled , save property
    try{
      await addProperty(property);
      navigate("/MGMTDashboard");
    }catch(err){
      console.error(err);
    }

    
    console.log("Submitted:", property);
  };

  

  return (
    <div>
      <Header />
      <link
  rel="stylesheet"
  href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"
  integrity="sha512-Gn5384z6kqr8yn8XekdlLZ5NINkAqF5V07R98ljePtb8iKDIp0cmYEdn7yg9H9n57F9+3gp4nnfW9CaoSmw+z0w=="
  crossorigin="anonymous"
  referrerpolicy="no-referrer"
/>
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css"
        integrity="sha384-rbsA2VBKQhggwzxH7pPCaAqO46MgnOM80zW1RWuH61DGLwZJEdK2Kadq2F9CUG65"
        crossOrigin="anonymous"
      />
      <div className="add-property-container">
        <form className="add-property-form" onSubmit={handleSubmit}>
          <h3>My Property</h3>
          <label className="form-label mt-3" htmlFor="customFile">
            <label className="input-label" htmlFor="propertyPicture">
              Property Picture:
            </label>
          </label>
          <div className="row justify-content-center">
            <div className="col-sm-">
              <input
                type="file"
                className="form-control"
                id="customFile"
                onChange={(e) => handleFileChange(e)}
              />
            </div>
          </div>
          {previewPropertyImage && (
            <div className="image-preview">

              <img src={previewPropertyImage} alt="Property Preview" />
            </div>
          )}

          <div className="input-group mt-3"></div>
          <div className="input-group">
            <label className="input-label" htmlFor="propertyName">
              Property Name:
            </label>
            <input
              type="text"
              id="propertyName"
              name="propertyName"
              value={property.propertyName}
              onChange={(e) => handleInputChange(e)}
              
            />
            </div>
            <div className="input" >
              <AddressComponent 
              id="address"
              type="address"
              labelText="Address"
              name="address"
              onChange={(e) => handleInputChange(e)}
              setFormData={setProperty}
              
              />

               </div>
          
          
       
           

          <div className="input-group">
            <label className="input-label" htmlFor="unitCount">
              Unit Count:
            </label>
            <input
              type="number" min="0"  
              id="unitCount"
              name="unitCount"
              value={property.unitCount}
              onChange={(e) => handleInputChange(e)}
              
            />
          </div>
          <div className="input-group">
            <label className="input-label" htmlFor="parkingCount">
              Parking Count:
            </label>
            <input
              type="number" min="0"  max="30"
              id="parkingCount"
              name="parkingCount"
              value={property.parkingCount}
              onChange={(e) => handleInputChange(e)}
              
            />
          </div>
          <label className="input-label" htmlFor="parkingCost">Parking Cost:</label>
         <div className="input-group">
               <select
                value={property.currency}
                onChange={(e) => handleInputChange(e)}
               name="currency"
                className="form-select custom-select"
          >
                <option value="CAD">CAD $</option>
                <option value="USD">USD $</option>
                <option value="Euro">Euro €</option>
               </select>
                 <input
                 id="parkingCost"
                 type="number"  min="0"
                 value={property.parkingCost}
                 onChange={(e) => handleInputChange(e)}
                 name="parkingCost"
                 className="form-control"
         />
         </div>
          <div className="input-group">
            <label className="input-label" htmlFor="lockerCount">
              Locker Count:
            </label>
            <input
              type="number" min="0" 
              id="lockerCount"
              name="lockerCount"
              value={property.lockerCount}
              onChange={(e) => handleInputChange(e)}
              
            />
          </div>
          <label className="input-label" htmlFor="lockerCost">Locker Cost:</label>
         <div className="input-group">
               <select
                value={property.currency}
                onChange={(e) => handleInputChange(e)}
                name="currency"
                className="form-select custom-select"
          >
                <option value="CAD">CAD $</option>
                <option value="USD">USD $</option>
                <option value="Euro">Euro €</option>
               </select>
                 <input
                 id="lockerCost" 
                 type="number" min="0"   
                 value={property.lockerCost}
                 onChange={(e) => handleInputChange(e)}
                 name="lockerCost"
                 className="form-control"
         />
         </div>



          <div className="button-container">
          
          
            <button className="add-property-button" type="submit">
                          
              Submit Property
            </button>
           
          </div>
        </form>
      </div>
      
      <Footer />
    </div>
  );
};

export default PropertyForm;