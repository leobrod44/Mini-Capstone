import React, { useState } from 'react';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styling/AddCondoForm.css";
import { addCondo } from "../backend/PropertyHandler";
import { useNavigate, useParams, useLocation } from "react-router-dom";
/**
 * Represents a form component for adding a new condo.
 * @returns {JSX.Element} The rendered AddCondoFormComponent.
 */
const AddCondoFormComponent = () => {
      // Retrieve property ID and name from URL parameters
    let { propertyID, propertyName } = useParams();
       // Navigation hook for redirecting after submission
    const navigate = useNavigate();
          // Location hook for accessing state
    const { state } = useLocation();
        // State to manage condo form data
      const [condo, setCondo] = useState({
        unitNumber: "",
        propertyID: propertyID,
        squareFeet: "",
        unitPrice: "",
        unitSize: "",
        parkingNumber: false,
        lockerNumber: false,
        picture: null,
      });
          // State to manage preview image
      const [previewCondoImage, setPreviewCondoImage] = useState(null);
        
/**
 * Handles the change event for the file input field.
 * Validates the selected file type and size, then updates the condo state with the selected picture file.
 * Also sets the preview image of the condo.
 * @param {Event} e - The change event object.
 * @returns {void}
 */
      const handleFileChange = (e) => {       // Retrieve the selected file from the event

        const file = e.target.files[0];
    // Reset the condo picture if no file is selected
        if (!file) {
          setCondo({
            ...condo,
            picture: null,
          });
        }
     // Check if the file type is supported (PNG, JPEG, JPG)
   
        if (!["image/png", "image/jpeg", "image/jpg"].includes(file.type)) {
          toast.error("File type not supported");
          return;
        }
     // Check if the file size is within the limit (2 MB)
   
        if (file.size > 2097152) {
          toast.error("File must be less than 2 MB");
          return;
        }
    // Update the condo state with the selected file
    
        setCondo({
          ...condo,
          picture: file,
        });
     // Create a new FileReader object to read the file as a data URL   
        const reader = new FileReader();
     // Set up a callback function to execute when the file reading is complete

        reader.onloadend = () => {
                  // Set the preview image of the condo with the data URL

          setPreviewCondoImage(reader.result);
        };
            // Read the file as a data URL

        reader.readAsDataURL(file);
      };


/**
 * Handles the change event for input fields in the condo form.
 * Validates the input value for the "unitPrice" field to ensure it contains only numbers.
 * Updates the condo state with the new input value.
 * @param {Event} e - The change event object.
 * @returns {void}
 */
      const handleInputChange = (e) => {
        // Extract the name and value from the input element
        const { name, value } = e.target;
      
        // Check if the input is for unitPrice and if it contains only numbers
        if (name === "unitPrice" && !(/^\d*\.?\d*$/).test(value)) {
          toast.error("Please enter a valid number for Unit Price");
          return;
        }
          // Update the condo state with the new input value

          setCondo((prevCondo) => {
            // If the input is a checkbox, update its value accordingly
            if (e.target.type === "checkbox") {
              return { ...prevCondo, [name]: e.target.checked };
            } else {
              return { ...prevCondo, [name]: value };
            }
          });
      };
    
     
/**
 * Handles the form submission for adding a condo.
 * Validates if any field is empty and displays an error if so.
 * Submits the condo if all fields are filled, resets the form, and navigates to the property details page.
 * @param {Event} e - The form submission event object.
 * @returns {void}
 */
      const handleSubmit = async (e) => {
        e.preventDefault();
      
        // Check if any field is empty
        for (const key in condo) {
          if (condo.hasOwnProperty(key) && condo[key] === "") {
            toast.error("All fields must be filled");
            return;
          }
        }
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
          picture: null,
        });
        try{  // Attempt to add the condo using the addCondo function
            await addCondo(condo,propertyID,propertyName);
        }
        catch(e){ // Display an error message if adding the condo fails
          toast.error("Error adding condo");
        }
          // Navigate to the property details page after successful submission
        navigate(`/propertydetailspage/${propertyID}/${propertyName}`);
      };
      return (
                  
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
            id="unitNumber"
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
            id="squareFeet"
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
            id="unitSize"
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
      id="unitPrice"
      type="text"
      value={condo.unitPrice}
      onChange={(e) => handleInputChange(e)}
      name="unitPrice"
      className="form-control"
    />
  </div>

  <div className="input-group">
        <label className="input-label" htmlFor="parkingNumber"  style={{ marginRight: '10px' }} >
          Parking:
          </label>
          <input
            id="parkingNumber"
            type="checkbox"
            name="parkingNumber"
            checked={condo.parkingNumber}
            onChange={handleInputChange}
            className="custom-checkbox"
            style={{ marginLeft: '0px' }}


          />
          </div>
          <div className="input-group">
          <label className="input-label" htmlFor="lockerNumber" style={{ marginRight: '10px' }} >
        
          Locker:
          </label>
          <input
            id="lockerNumber"
            type="checkbox"
            name="lockerNumber"
            checked={condo.lockerNumber}
            onChange={handleInputChange}
            className="custom-checkbox"
            style={{ marginLeft: '5px' }}
          />
         </div>

<button className="add-condo-button" type="submit"
             onClick={handleSubmit}
             >
              Submit Condo
            </button>
        </form>
        </div>

);
};
  
  export default AddCondoFormComponent;