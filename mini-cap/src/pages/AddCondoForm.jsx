import React from "react";
import "react-toastify/dist/ReactToastify.css";
import "../styling/AddCondoForm.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import AddCondoFormComponent from "../components/AddCondoFormComponent";
 
 
 /**
 * Represents a form for adding a new condo.
 * Renders a header, the main content area containing the AddCondoFormComponent,
 * and a footer.
 * @returns {JSX.Element} The rendered AddCondoForm component.
 */
 
const AddCondoForm = () => {
  return (
    <div> 
      {/* Render the header component */}
      <Header/>
        {/* Main content area */}
      <main>
       {/* Render the AddCondoFormComponent */}

        <AddCondoFormComponent />

      </main>
      {/* Render the footer component */}
      <Footer />
    </div>
  );
};
 
 
  // Export the AddCondoForm component

  export default AddCondoForm;