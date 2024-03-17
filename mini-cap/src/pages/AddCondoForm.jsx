import React from "react";
import "react-toastify/dist/ReactToastify.css";
import "../styling/AddCondoForm.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import AddCondoFormComponent from "../components/AddCondoFormComponent";
 
 
 
 
const AddCondoForm = () => {
  return (
    <div>
      <Header/>
 
      <main>
        
        <AddCondoFormComponent />
      </main>
 
      <Footer />
    </div>
  );
};
 
 
  
  export default AddCondoForm;