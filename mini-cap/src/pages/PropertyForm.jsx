import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styling/propertyform.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import DeleteModal from "../components/DeleteModal"; 
import AddressComponent from "../components/AddressComponent"; 
import { addProperty } from "../backend/Fetcher";

const PropertyForm = () => {
  const [property, setProperty] = useState({
    picture: null,
    propertyName: "",
    address: "",
    unitCount: "",
    parkingCount: "",
    lockerCount: "",
    condos: [],
  });

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [condoToDelete, setCondoToDelete] = useState(null);

  const [previewPropertyImage, setPreviewPropertyImage] = useState(null);
  const [condoPreviewImages, setCondoPreviewImages] = useState([]);

  const [visibleCondoForms, setVisibleCondoForms] = useState([]);




  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (!file) {
      setProperty({
        ...property,
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

    setProperty({
      ...property,
      propertyPicture: file,
    });

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewPropertyImage(reader.result);
    };

    reader.readAsDataURL(file);
  };



  const handleCondoInputChange = (e, index) => {
    const { name, value } = e.target;
    const updatedCondos = [...property.condos];
    updatedCondos[index] = {
      ...updatedCondos[index],
      [name]: value,
    };
    setProperty({
      ...property,
      condos: updatedCondos,
    });
  };

  

  const handleCondoFileChange = (e, index) => {
    const file = e.target.files[0];

    if (!file) {
      toast.error("File not supported");
      return;
    }

    if (!["image/png", "image/jpeg", "image/jpg"].includes(file.type)) {
      toast.error("File type not supported");
      return;
    }

    if (file.size > 2097152) {
      toast.error("File must be less than 2 MB");
      return;
    }

    const updatedCondos = [...property.condos];
    updatedCondos[index] = {
      ...updatedCondos[index],
      condoPicture: file,
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




  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    
  // Parse the value as an integer for number input fields
  const parsedValue = type === 'number' ? parseInt(value, 10) : value;
  setProperty({
    ...property,
    [name]: parsedValue,
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
  //validation that all required information is filled in
    if (
      !property.propertyName ||
      !property.address ||
      !property.unitCount ||
      !property.parkingCount ||
      !property.lockerCount
    ) {
      toast.error("Missing Property Information");
      return;
    }
    // if all required field are filled , save property
    console.log("Submitted:", property);
  };

  const handleAddCondo = () => {
    // Check if all required fields in the condo  form are filled
    if (
      !property.propertyName ||
      !property.address ||
      !property.unitCount ||
      !property.parkingCount ||
      !property.lockerCount
    ) {
      toast.error("Please complete the property form first");
      return;
    }
  
    // If all required fields are filled, add a new condo
    setProperty({
      ...property,
      condos: [...property.condos, {}],
    });
  };
  const handleCondoSubmit = (index) => {
    const submittedCondo = property.condos[index];

 
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
  };
  const handleDeleteCondo = (index) => {
    setCondoToDelete(index);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirmed = () => {
    const updatedCondos = [...property.condos];
    updatedCondos.splice(condoToDelete, 1);

    setProperty({
      ...property,
      condos: updatedCondos,
    });

    setCondoPreviewImages((prevImages) => {
      const newImages = [...prevImages];
      newImages.splice(condoToDelete, 1);
      return newImages;
    });

    setVisibleCondoForms([]);
    setShowDeleteModal(false);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setCondoToDelete(null);
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
              type="number" min="0"  
              id="parkingCount"
              name="parkingCount"
              value={property.parkingCount}
              onChange={(e) => handleInputChange(e)}
              
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
        <p> Parking Spot Number: {condo.parkingNumber}</p>
        <p> Locker Number: {condo.lockerNumber}</p>

        
        {condo.condoPicture && (
          <img
            src={URL.createObjectURL(condo.condoPicture)}
            alt={`Condo ${condo.unitNumber} Preview`}
          />
        )}
        <div className="input-group mt-3"></div>
      <button  className="delete-condo-button"

                  onClick={() => handleDeleteCondo(index)}
                >
                  Delete
                </button>
    
  </div>
                ) : (
                  <div className="condo-form">
                    
 
                    <h5>Unit {index + 1}</h5>
                    <label>Unit Number:</label>
                    <input
                      type="text"
                      value={condo.unitNumber}
                      onChange={(e) => handleCondoInputChange(e, index)}
                      name="unitNumber"
                    />
<label> Square Feet </label>
<input
type= "text"
value={condo.squareFeet}
onChange={(e) => handleCondoInputChange(e, index)}
 name="squareFeet"
 ></input>


  <label>Unit Price:</label>
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
      type="text"
      value={condo.unitPrice}
      onChange={(e) => handleCondoInputChange(e, index)}
      name="unitPrice"
      className="form-control"
    />
  </div>



<label>Unit Size:</label>
<select
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
<label> Parking Spot  </label>
<input
type= "text"
value={condo.parkingNumber}
onChange={(e) => handleCondoInputChange(e, index)}
 name="parkingNumber"
 ></input>

<label> Locker  </label>
<input
type= "text"
value={condo.lockerNumber}
onChange={(e) => handleCondoInputChange(e, index)}
 name="lockerNumber"
 ></input>
                     <label>Condo Picture:</label>
                     <div className="row justify-content-center">
                     <div className="col-sm-">
                     <input
                      type="file"
                      className="form-control"
                      onChange={(e) => handleCondoFileChange(e, index)}
                      style={{ paddingTop: "0px", paddingBottom: "0px" }}
                   
                    />
                    
    </div>
  </div>
  {condoPreviewImages[index] && (
        <img
          src={condoPreviewImages[index]}
          alt={`Condo ${condo.unitNumber} Preview`}
        />
    
  )}
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
          <button
              className="add-condo-button"
              onClick={handleAddCondo}
              type="button"
            >
              Add Condo
            </button>
         
            <button className="add-property-button" type="submit">
                          
              Submit Property
            </button>
           
          </div>
        </form>
      </div>
      <DeleteModal
        show={showDeleteModal}
        handleClose={handleCloseDeleteModal}
        handleDeleteItem={handleDeleteConfirmed}
        message="Are you sure you want to delete this condo?"
      />
      <Footer />
    </div>
  );
};

export default PropertyForm;