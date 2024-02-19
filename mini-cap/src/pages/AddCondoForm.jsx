import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styling/AddCondoForm.css";
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
      setCondo({ ...condo, [name]: value });
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
          <link
  rel="stylesheet"
  href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"
  integrity="sha512-Gn5384z6kqr8yn8XekdlLZ5NINkAqF5V07R98ljePtb8iKDIp0cmYEdn7yg9H9n57F9+3gp4nnfW9CaoSmw+z0w=="
  crossorigin="anonymous"
  referrerpolicy="no-referrer"
/>
<div className="add-condo-container"></div>
<form className="add-condo-form" onSubmit={handleSubmit}>
<label className="form-label mt-3" htmlFor="customFile">
            <label className="input-label" htmlFor="condoPicture">
             Condo Picture:
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
            required
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
            required
            />
      
          </div>
          <div className="input-group">
          <label className="input-label" htmlFor="unitPrice">
        </label>
          Unit Price:
          <input
            type="text"
            name="unitPrice"
            value={condo.unitPrice}
            onChange={handleInputChange}
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
          Parking Spot Number:
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
        
          Locker Number:
          </label>
          <input
            type="text"
            name="lockerNumber"
            value={condo.lockerNumber}
            onChange={handleInputChange}
          />
         </div>
  
         <div className="input-group">
         <label className="input-label" htmlFor="unitPrice">Unit Price:</label>
  
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
      <Footer />
    </div>
  );
};
  
  export default AddCondoForm;