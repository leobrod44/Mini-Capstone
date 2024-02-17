import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styling/propertyform.css";
import Header from "../components/Header";
import Footer from "../components/Footer";

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
  
    if (
      !["image/png", "image/jpeg", "image/jpg"].includes(file.type)
    ) {
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

  const handleAddCondo = () => {
    setProperty({
      ...property,
      condos: [...property.condos, {}],
    });
  };

  const handleCondoFileChange = (e, index) => {
    const file = e.target.files[0];

    if (!file) {
      toast.error("File not supported");
      return;
    }

    if (
      !["image/png", "image/jpeg", "image/jpg"].includes(file.type)
    ) {
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

   

    setProperty({
      ...property,
      condos: updatedCondos,
    });
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProperty({
      ...property,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted:", property);
    // Add your logic to handle form submission, e.g., send data to the server
  };

  const handleCondoSubmit = (index) => {
    console.log("Condo Submitted:", property.condos[index]);
    setVisibleCondoForms((prevVisibleCondoForms) => [
      ...prevVisibleCondoForms,
      index,
    ]);
  };

  return (
    <div>
      <Header />
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
            <label className="input-label" htmlFor="propertyName">
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
              required
            />
          </div>
          <div className="input-group">
            <label className="input-label" htmlFor="address">
              Address:
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={property.address}
              onChange={(e) => handleInputChange(e)}
              required
            />
          </div>
          <div className="input-group">
            <label className="input-label" htmlFor="unitCount">
              Unit Count:
            </label>
            <input
              type="number"
              id="unitCount"
              name="unitCount"
              value={property.unitCount}
              onChange={(e) => handleInputChange(e)}
              required
            />
          </div>
          <div className="input-group">
            <label className="input-label" htmlFor="parkingCount">
              Parking Count:
            </label>
            <input
              type="number"
              id="parkingCount"
              name="parkingCount"
              value={property.parkingCount}
              onChange={(e) => handleInputChange(e)}
              required
            />
          </div>
          <div className="input-group">
            <label className="input-label" htmlFor="lockerCount">
              Locker Count:
            </label>
            <input
              type="number"
              id="lockerCount"
              name="lockerCount"
              value={property.lockerCount}
              onChange={(e) => handleInputChange(e)}
              required
            />
          </div>

          <div className="condo-list">
          {property.condos.map((condo, index) => (
  <div key={index}>
    {visibleCondoForms.includes(index) ? (
      <div className="condo-preview">
        <h5>{`Condo ${condo.unitNumber} `}</h5>
        <p>Unit Number: {condo.unitNumber}</p>
        <p>Unit Price: {condo.unitPrice}</p>
        <p>Unit Size: {condo.unitSize}</p>
        {condo.condoPicture && (
          <img
            src={URL.createObjectURL(condo.condoPicture)}
            alt={`Condo ${condo.unitNumber} Preview`}
          />
        )}
      </div>
                ) : (
                  <div className="condo-form">
 <link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css"
  integrity="sha384-rbsA2VBKQhggwzxH7pPCaAqO46MgnOM80zW1RWuH61DGLwZJEdK2Kadq2F9CUG65"
  crossOrigin="anonymous"
/>
                    <h5>Condo {index + 1}</h5>
                    <label>Unit Number:</label>
                    <input
                      type="text"
                      value={condo.unitNumber}
                      onChange={(e) => handleCondoInputChange(e, index)}
                      name="unitNumber"
                    />
                    <label>Unit Price:</label>
                    <input
                      type="text"
                      value={condo.unitPrice}
                      onChange={(e) => handleCondoInputChange(e, index)}
                      name="unitPrice"
                    />
                    <label>Unit Size:</label>
                    <input
                      type="text"
                      value={condo.unitSize}
                      onChange={(e) => handleCondoInputChange(e, index)}
                      name="unitSize"
                    />
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
      <Footer />
    </div>
  );
};

export default PropertyForm;
