// PropertyForm.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import DeleteModal from "../components/DeleteModal";
import AddressComponent from "../components/AddressComponent";
import CondoForm from "../components/CondoForm";
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

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [condoToDelete, setCondoToDelete] = useState(null);

  const [previewPropertyImage, setPreviewPropertyImage] = useState(null);
  const [condoPreviewImages, setCondoPreviewImages] = useState([]);

  const [visibleCondoForms, setVisibleCondoForms] = useState([]);

  const navigate = useNavigate();

  const handleFileChange = (e) => {
    // Existing logic for handling file change
  };

  const handleCondoInputChange = (e, index) => {
    // Existing logic for handling condo input change
  };

  const handleCondoFileChange = (e, index) => {
    // Existing logic for handling condo file change
  };

  const handleInputChange = (e) => {
    // Existing logic for handling input change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Existing logic for handling form submission
  };

  const handleAddCondo = () => {
    // Existing logic for adding a condo
  };

  const handleCondoSubmit = (index) => {
    // Existing logic for handling condo submission
  };

  const handleDeleteCondo = (index) => {
    // Existing logic for handling condo deletion
  };

  const handleDeleteConfirmed = () => {
    // Existing logic for handling delete confirmation
  };

  const handleCloseDeleteModal = () => {
    // Existing logic for handling close delete modal
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
          {/* Property form JSX */}
          <div className="condo-list">
            {property.condos.map((condo, index) => (
              <CondoForm
                key={index}
                condo={condo}
                onInputChange={(e) => handleCondoInputChange(e, index)}
                onFileChange={(e) => handleCondoFileChange(e, index)}
                onCondoSubmit={() => handleCondoSubmit(index)}
              />
            ))}
          </div>
          {/* Button container */}
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
