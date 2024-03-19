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
import DeleteModal from "../components/DeleteModal"; 
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
  const [condoPreviewImages, setCondoPreviewImages] = useState([]);
  const [condoDeleteModalVisible, setCondoDeleteModalVisible] = useState([]);
  const [visibleCondoForms, setVisibleCondoForms] = useState([]);
  const [isAddingCondo, setIsAddingCondo] = useState(false); 
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCondoIndex, setSelectedCondoIndex] = useState(null); // Track which condo is being deleted
  const navigate = useNavigate();

    /**
   * Handles showing the delete confirmation modal for a specific condo.
   * @param {number} index - The index of the condo in the property's list.
   */
  const handleShowDeleteModal = (index) => {
    const updatedVisibility = [...condoDeleteModalVisible];
  updatedVisibility[index] = true;
  setCondoDeleteModalVisible(updatedVisibility);
};
/**
   * Handles closing the delete confirmation modal for a specific condo.
   * @param {number} index - The index of the condo in the property's list.
   */
  const handleCloseDeleteModal = (index) => {
  const updatedVisibility = [...condoDeleteModalVisible];
  updatedVisibility[index] = false;
  setCondoDeleteModalVisible(updatedVisibility);
};
 /**
   * Handles deleting a condo from the property.
   * Removes the selected condo from the list of condos and updates the UI.
   */

  const handleDeleteCondo = () => {
      // Create a copy of the current list of condos
      const updatedCondos = [...property.condos];
     // Remove the selected condo from the list based on its index
     updatedCondos.splice(selectedCondoIndex, 1);
     // Update the property state with the modified list of condos
    setProperty({
      ...property,
      condos: updatedCondos,
    });
      // Create a copy of the current list of condo preview images

    const updatedCondoPreviewImages = [...condoPreviewImages];
      // Remove the preview image of the deleted condo based on its index

    updatedCondoPreviewImages.splice(selectedCondoIndex, 1);
      // Update the condo preview images state with the modified list

    setCondoPreviewImages(updatedCondoPreviewImages);
    setShowDeleteModal(false);
  };
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
 * Handles input change for a specific condo within the property.
 * Updates the corresponding condo object in the property's list of condos with the new input value.
 * Performs value parsing and validation for number input fields, specifically for "Unit Price".
 * @param {Event} e - The input change event triggered when a value is entered.
 * @param {number} index - The index of the condo in the property's list of condos.
 */
  const handleCondoInputChange = (e, index) => {
    const { name, value } = e.target;

  // Parse the value as a float for number input fields
  const parsedValue = name === 'unitPrice' ? parseFloat(value) : value;

  // Check for minimum value validation only for "Unit Price"
  if (name === 'unitPrice' && parsedValue <= 0) {
    toast.error(`Unit Price must be greater than 0`);
    return;
  }
    const updatedCondos = [...property.condos];
    // Update the selected condo object with the new input value
    updatedCondos[index] = {
      ...updatedCondos[index],
      [name]: value, // Update the specific property (identified by name) of the condo
    };
      // Update the property state with the modified list of condos
    setProperty({
      ...property,
      condos: updatedCondos,
    });
  };

  
   /**
 * Handles input change for a specific condo within the property.
 * Updates the corresponding condo object in the property's list of condos with the new input value.
 * @param {Event} e - The input change event triggered when a value is entered.
 * @param {number} index - The index of the condo in the property's list of condos.
 */
  const handleCondoFileChange = (e, index) => {
    const file = e.target.files[0];
     
    if (!file) {
      toast.error("File not supported");
      return;
    }
     //validation for the type of document uploaded
    if (!["image/png", "image/jpeg", "image/jpg"].includes(file.type)) {
      toast.error("File type not supported");
      return;
    } 
    //validation for the size of the file
    if (file.size > 2097152) {
      toast.error("File must be less than 2 MB");
      return;
    }
       // if all validations pass, the condo picture field is set with the uploaded file
    const updatedCondos = [...property.condos];
    updatedCondos[index] = {
      ...updatedCondos[index],
      picture: file,
    };
      
    setProperty({
      ...property,
      condos: updatedCondos,
    });

    const reader = new FileReader();
    reader.onloadend = () => {
      setCondoPreviewImages((prevImages) => {
        const newImages = [...prevImages];
        newImages[index] = reader.result;
        return newImages;
      });
    };

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
/**
 * Handles the addition of a new condo to the property.
 * Checks if all required fields in the property form are filled.
 * If all required fields are filled and not already adding a condo, adds a new condo to the property.
 * @returns {void}
 */
  const handleAddCondo = () => {
    // Check if all required fields in the condo  form are filled
    if (
      !property.propertyName ||
      !property.address ||
      !property.unitCount ||
      !property.parkingCount ||
      !property.lockerCount ||
      !property.lockerCost ||
      !property.parkingCost
  
    ) {
      toast.error("Please complete the property form first");
      return;
    }
    if (isAddingCondo) return;  //If already adding a condo, do nothing
    setIsAddingCondo(true);    // Set isAddingCondo to true to indicate that a condo is being added

  // Add a new empty condo object to the property's list of condos
  setProperty({
      ...property,
      condos: [...property.condos, {}],
    });
  };
  /**
 * Handles the submission of a specific condo within the property.
 * @param {number} index - The index of the condo in the property's list of condos.
 * @returns {void}
 */

  const handleCondoSubmit = (index) => {
      // Retrieve the condo object to be submitted

    const submittedCondo = property.condos[index];

      // Check if the submitted condo has at least one field filled

  if (
    Object.values(submittedCondo).every((value) => //validation that condo form is not submitted empty
      value === null || value === undefined || value === ""
    )
  ) {
  
    toast.error("Please fill in at least one field for the condo");
    return;
  }
//if at least one field is added, submit condo
    
    console.log("Condo Submitted:", property.condos[index]);
    setVisibleCondoForms((prevVisibleCondoForms) => [
      ...prevVisibleCondoForms,
      index,
    ]);
    setIsAddingCondo(false);
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
                 type="number" min="0"   max="30" 
                 value={property.lockerCost}
                 onChange={(e) => handleInputChange(e)}
                 name="lockerCost"
                 className="form-control"
         />
         </div>


         <div className="condo-list">
  {property.condos.map((condo, index) => (
    <div key={index}>
      {visibleCondoForms.includes(index) ? (
        <div className="condo-preview">
          <h5>{`Condo ${condo.unitNumber} `}</h5>
          <p>Unit Number: {condo.unitNumber}</p>
          <p>Unit Price: {condo.currency} {condo.unitPrice}</p>
          <p>Unit Size: {condo.unitSize}</p>
          <p>Square Feet: {condo.squareFeet}</p>
          <p>Parking Spot Number: {condo.parkingNumber}</p>
          <p>Locker Number: {condo.lockerNumber}</p>
          {condo.picture && (
            <img
              src={URL.createObjectURL(condo.picture)}
              alt={`Condo ${condo.unitNumber} Preview`}
            />
          )}
          <button  type="button" className="btn btn-danger btn-block mt-2" onClick={() => handleShowDeleteModal(index)}>Delete</button>
          <DeleteModal
        show={condoDeleteModalVisible[index]}
        handleClose={() => handleCloseDeleteModal(index)}
         handleDeleteItem={handleDeleteCondo}
      message="Are you sure you want to delete this condo?"
      />
          {/* Add a Delete button for each condo */}
        </div>
      
                ) : (
                  <div className="add-condo-form">
                    
 
                    <h5>Unit {index + 1}</h5>
                    <div className="input-group">
                    <label className="form-label mt-3" htmlFor="customFile">
                        <label className="input-label" htmlFor="condoPicture"> Condo Picture: </label>
                    </label>
                     <div className="row justify-content-center">
                     <div className="col-sm-">
                     <input
                     id="condoPicture"
                      type="file"
                      className="form-control"
                      onChange={(e) => handleCondoFileChange(e, index)}
                      style={{ paddingTop: "0px", paddingBottom: "0px" }}
                   
                    />
                    </div>
                    
    </div>
  </div>
  {condoPreviewImages[index] && (
    <div className="image-preview">
        <img
          src={condoPreviewImages[index]}
          alt={`Condo ${condo.unitNumber} Preview`}
        />
        </div>
    
  )}                
                              <div className="input-group">

                    <label className="input-label" htmlFor="unitNumber"> Unit Number: </label>
                    <input
                    id="unitNumber"
                      type="text"
                      value={condo.unitNumber}
                      onChange={(e) => handleCondoInputChange(e, index)}
                      name="unitNumber"
                    />
                    </div>
                    
                    <div className="input-group">
 <label className="input-label" htmlFor="squareFeet">
          Square Feet:
          </label>
<input
id="squareFeet"
type= "text"
value={condo.squareFeet}
onChange={(e) => handleCondoInputChange(e, index)}
 name="squareFeet"
 ></input>

</div>

<label className="input-label" htmlFor="unitPrice">Unit Price:</label>
  <div className="input-group">
    <select
      value={condo.currency}
      onChange={(e) => handleCondoInputChange(e, index)}
      name="currency"
      className="form-select custom-select"
    >
      <option value="CAD">CAD $</option>
      <option value="USD">USD $</option>
      <option value="Euro">Euro €</option>
    </select>
    <input
    id="unitPrice"
      type="number"
      value={condo.unitPrice}
      onChange={(e) => handleCondoInputChange(e, index)}
      name="unitPrice"
      className="form-control"
    />
  </div>



  <div className="input-group">
  <label className="input-label" htmlFor="unitSize">
        
        Unit Size:
        </label>
<select
  id="unitSize"
  value={condo.unitSize}
  onChange={(e) => handleCondoInputChange(e, index)}
  name="unitSize"
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
id="parkingNumber"
type= "text"
value={condo.parkingNumber}
onChange={(e) => handleCondoInputChange(e, index)}
 name="parkingNumber"
 ></input>
</div>


<div className="input-group">
<label className="input-label" htmlFor="lockerNumber">
        
        Locker:
        </label>
<input
 id="lockerNumber"
type= "text"
value={condo.lockerNumber}
onChange={(e) => handleCondoInputChange(e, index)}
 name="lockerNumber"
 ></input>
 </div>

  <div className="input-group mt-3"></div>
                    {/* "Submit Condo" button for each condo */}
                    <button
                      className="submit-condo-button"
                      onClick={() => handleCondoSubmit(index)}
                      type="button"
                    >
                      Save Condo
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="button-container">
          {!isAddingCondo && (
          <button
              className="add-condo-button"
              onClick={handleAddCondo}
              type="button"
            >
              Add Condo
            </button>
           )}
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