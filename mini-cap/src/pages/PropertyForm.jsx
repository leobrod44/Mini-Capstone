import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {  toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styling/propertyform.css";
import Header from "../components/Header";
import Footer from "../components/Footer";

import AddressComponent from "../components/AddressComponent"; 
import { addProperty } from "../backend/PropertyHandler";

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


  const [previewPropertyImage, setPreviewPropertyImage] = useState(null);


  const navigate = useNavigate();


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
      picture: file,
    });

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewPropertyImage(reader.result);
    };

    reader.readAsDataURL(file);
  };




  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
  
    // Parse the value as an integer for number input fields
    const parsedValue = type === 'number' ? parseInt(value, 10) : value;
  
    // Check for minimum value validation
    if (type === 'number' && parsedValue < 0) {
      toast.error(`Count must be greater than or equal to 0`);
      return;
    }
  
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
  crossOrigin="anonymous"
  referrerPolicy="no-referrer"
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

        
 
         
            <button className="add-property-button" type="submit">
                          
              Submit Property
            </button>
            
       
        
        </form>
      </div>
     
      <Footer />
    </div>
  );
};

export default PropertyForm;