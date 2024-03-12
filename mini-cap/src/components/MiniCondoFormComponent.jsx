
import React, { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styling/AddCondoForm.css";

const MiniCondoForm  = () => {
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

  const handleCondoInputChange = (e) => {
    const { name, value } = e.target;
  
    // Check if the input is for unitPrice and if it contains only numbers
    if (name === "unitPrice" && !(/^\d*\.?\d*$/).test(value)) {
      toast.error("Please enter a valid number for Unit Price");
      return;
    }
  
    setCondo((prevCondo) => ({ ...prevCondo, [name]: value }));
  };

 

  return (
    <form className="condo-form" key={index}>
      <h5>Unit {index + 1}</h5>

      {/* Condo Form Fields */}
      <div className="mb-3">
        <label htmlFor={`unitNumber${index}`} className="form-label">
          Unit Number:
        </label>
        <input
          type="text"
          className="form-control"
          id={`unitNumber${index}`}
          value={condo.unitNumber}
          onChange={(e) => handleCondoInputChange(e, index)}
          name="unitNumber"
        />
      </div>

      <div className="mb-3">
        <label htmlFor={`squareFeet${index}`} className="form-label">
          Square Feet:
        </label>
        <input
          type="text"
          className="form-control"
          id={`squareFeet${index}`}
          value={condo.squareFeet}
          onChange={(e) => handleCondoInputChange(e, index)}
          name="squareFeet"
        />
      </div>

      <div className="mb-3">
        <label htmlFor={`unitSize${index}`} className="form-label">
          Unit Size:
        </label>
        <select
          className="form-select"
          id={`unitSize${index}`}
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

      <div className="mb-3">
        <label htmlFor={`parkingNumber${index}`} className="form-label">
          Parking Spot:
        </label>
        <input
          type="text"
          className="form-control"
          id={`parkingNumber${index}`}
          value={condo.parkingNumber}
          onChange={(e) => handleCondoInputChange(e, index)}
          name="parkingNumber"
        />
      </div>

      <div className="mb-3">
        <label htmlFor={`lockerNumber${index}`} className="form-label">
          Locker:
        </label>
        <input
          type="text"
          className="form-control"
          id={`lockerNumber${index}`}
          value={condo.lockerNumber}
          onChange={(e) => handleCondoInputChange(e, index)}
          name="lockerNumber"
        />
      </div>

      <div className="mb-3">
        <label htmlFor={`unitPrice${index}`} className="form-label">
          Unit Price:
        </label>
        <div className="input-group">
          <select
            className="form-select"
            id={`currency${index}`}
            value={condo.currency}
            onChange={(e) => handleCondoInputChange(e, index)}
            name="currency"
          >
            <option value="CAD">CAD $</option>
            <option value="USD">USD $</option>
            <option value="Euro">Euro €</option>
          </select>
          <input
            type="text"
            className="form-control"
            id={`unitPrice${index}`}
            value={condo.unitPrice}
            onChange={(e) => handleCondoInputChange(e, index)}
            name="unitPrice"
          />
        </div>
      </div>

      {/* Preview Section */}
      <div>
        <h6>Condo Preview</h6>
        <p>Unit Number: {condo.unitNumber}</p>
        <p>Square Feet: {condo.squareFeet}</p>
        <p>Unit Size: {condo.unitSize}</p>
        <p>Parking Spot: {condo.parkingNumber}</p>
        <p>Locker: {condo.lockerNumber}</p>
        <p>
          Unit Price: {condo.currency} {condo.unitPrice}
        </p>
        {previewCondoImage && (
          <img
            src={previewCondoImage}
            alt={`Condo ${condo.unitNumber} Preview`}
            style={{ width: "100px", height: "100px" }}
          />
        )}
      </div>

    
    </form>
  );
};

export default MiniCondoForm;