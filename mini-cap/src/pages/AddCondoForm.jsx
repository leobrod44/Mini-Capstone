<<<<<<< HEAD
import React from "react";
=======
import React, { useState } from "react";
import { toast } from "react-toastify";
>>>>>>> main
import "react-toastify/dist/ReactToastify.css";
import "../styling/AddCondoForm.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
<<<<<<< HEAD
import AddCondoFormComponent from "../components/AddCondoFormComponent";

=======
import { addCondo } from "../backend/PropertyHandler";
import { useNavigate, useParams, useLocation } from "react-router-dom";
>>>>>>> main

const AddCondoForm = () => {
<<<<<<< HEAD
  return (
    <div>
      <Header/>
=======
  let { propertyID, propertyName } = useParams();
  const navigate = useNavigate();
    const { state } = useLocation();
    const [condo, setCondo] = useState({
      unitNumber: "",
      propertyID: propertyID,
      squareFeet: "",
      unitPrice: "",
      unitSize: "",
      parkingNumber: "",
      lockerNumber: "",
      picture: null,
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
        picture: file,
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
          occupant: "",
          status: "",
        picture: null,
      });
      try{
          await addCondo(condo, propertyID, propertyName);
      }
      catch(e){
        toast.error("Error adding condo");
      }
      navigate(`/propertydetailspage/${propertyID}/${propertyName}`);
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
>>>>>>> main

      <main>
        
        <AddCondoFormComponent />
      </main>

      <Footer />
    </div>
  );
};


  
  export default AddCondoForm;