import { React, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styling/EditPropertyComponent.css";
import DeleteModal from "../components/DeleteModal";
import AddressComponent from "../components/AddressComponent";
import BackArrowBtn from "../components/BackArrowBtn.jsx";
import {
  getProperties,
  deleteProperty,
  editProperty,
} from "../backend/PropertyHandler";
import store from "storejs";
import { PropTypes } from "prop-types";

const EditPropertyComponent = ({ propertyDetails, onUpdate, toggleEdit }) => {
  const { propertyID } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(propertyDetails);

  const backgroundColor = "#f0f4f8";
  document.body.style.backgroundColor = backgroundColor;

  useEffect(() => {
    const fetchPropertyData = async () => {
      try {
        const company = store("user"); // Assuming you have the company information in user storage
        const properties = await getProperties(company);
        const selectedProperty = properties.find(
          (prop) => prop.propertyID === propertyID
        );

        if (selectedProperty) {
          setProperty(selectedProperty);
          setPreviewPropertyImage(selectedProperty.picture);
        } else {
          toast.error("Property not found");
          navigate("/MGMTDashboard"); // Redirect to dashboard if the property is not found
        }
      } catch (error) {
        console.error(error);
        toast.error("Error fetching property data");
      }
    };
    fetchPropertyData();
  }, [propertyID, navigate]);

  const [previewPropertyImage, setPreviewPropertyImage] = useState(null);
  const [showDeleteModal, setShow] = useState(false);
  const handleClickDelete = () => {
    setShow(true);
  };
  const handleCloseDeleteModal = () => {
    setShow(false);
  };

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
    const parsedValue = type === "number" ? parseInt(value, 10) : value;

    // Check for minimum value validation
    if (type === "number" && parsedValue < 0) {
      toast.error(`Count must be greater than or equal to 0`);
      return;
    }

    setProperty({
      ...property,
      [name]: parsedValue,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Check for empty Property Name
    if (property.propertyName.trim() === "") {
      toast.error("Property Name cannot be empty");
      return;
    }

    // Check for non-empty and valid Unit Count, Parking Count, and Locker Count
    if (
      !property.unitCount ||
      property.unitCount < 1 ||
      property.unitCount > 499
    ) {
      toast.error("Unit Count must be a number between 1 and 499");
      return;
    }

    if (
      !property.parkingCount ||
      property.parkingCount < 1 ||
      property.parkingCount > 499
    ) {
      toast.error("Parking Count must be a number between 1 and 499");
      return;
    }

    if (
      !property.lockerCount ||
      property.lockerCount < 1 ||
      property.lockerCount > 499
    ) {
      toast.error("Locker Count must be a number between 1 and 499");
      return;
    }

    // Check for valid Parking Price and Locker Price
    if (property.parkingCost < 0 || property.parkingCost > 149) {
      toast.error("Parking Price must be between 0 and 149");
      return;
    }

    if (property.lockerCost < 0 || property.lockerCost > 149) {
      toast.error("Locker Price must be between 0 and 149");
      return;
    }

    try {
      const success = await editProperty(propertyID, property);
      if (success) {
        toast.success("Property details updated successfully");
        onUpdate(property); // Pass the updated property details to the parent component
        toggleEdit(); // Close the edit form
        navigate("/MGMTDashboard"); // Navigate to the dashboard after successful update
      } else {
        throw new Error("Failed to update property details");
      }
    } catch (error) {
      toast.error("Error updating property: " + error.message);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteProperty(propertyID);
      toast.success("Property deleted successfully");
      navigate("/MGMTDashboard"); // Navigate to the dashboard after successful deletion
    } catch (err) {
      console.error(err);
      toast.error("Error deleting property");
    }
  };

  return (
    <div style={{ backgroundColor: "f0f4f8" }}>
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
        <div className="input">
          <AddressComponent
            id="address"
            type="address"
            labelText="Address"
            name="address"
            onChange={(e) => handleInputChange(e)}
            setFormData={setProperty}
            value={property.address}
          />
        </div>

        <div className="input-group">
          <label className="input-label" htmlFor="unitCount">
            Unit Count:
          </label>
          <input
            type="number"
            min="0"
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
            type="number"
            min="0"
            id="parkingCount"
            name="parkingCount"
            value={property.parkingCount}
            onChange={(e) => handleInputChange(e)}
          />
        </div>
        <div className="input-group">
          <label className="input-label" htmlFor="parkingCost">
            Parking Price:
          </label>
          <input
            type="number"
            min="0"
            id="parkingCost"
            name="parkingCost"
            value={property.parkingCost}
            onChange={(e) => handleInputChange(e)}
          />
        </div>
        <div className="input-group">
          <label className="input-label" htmlFor="lockerCount">
            Locker Count:
          </label>
          <input
            type="number"
            min="0"
            id="lockerCount"
            name="lockerCount"
            value={property.lockerCount}
            onChange={(e) => handleInputChange(e)}
          />
        </div>

        <div className="input-group">
          <label className="input-label" htmlFor="lockerCost">
            Locker Price:
          </label>
          <input
            type="number"
            min="0"
            id="lockerCost"
            name="lockerCost"
            value={property.lockerCost}
            onChange={(e) => handleInputChange(e)}
          />
        </div>

        <div className="button-container">
          <button
            className="cancel-button"
            type="button"
            onClick={() => toggleEdit()}
          >
            Cancel
          </button>

          <button className="add-condo-button" type="submit">
            Save Changes
          </button>
        </div>
        <div className="button-container">
          <button
            type="button"
            className="delete-property-button"
            onClick={() => handleClickDelete()}
          >
            Delete Property
          </button>
        </div>
      </form>
      <BackArrowBtn />
      <DeleteModal
        show={showDeleteModal}
        handleClose={handleCloseDeleteModal}
        message="Are you sure you want to delete this Property?"
        handleDeleteItem={handleDelete} // Call handleDelete when the user confirms
      />
    </div>
  );
};

EditPropertyComponent.propTypes = {
  toggleEdit: PropTypes.func.isRequired,
};

export default EditPropertyComponent;
