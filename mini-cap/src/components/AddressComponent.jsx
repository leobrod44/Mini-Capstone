import React, { useRef, useEffect } from "react";
import { StandaloneSearchBox, LoadScript } from "@react-google-maps/api";
import "../styling/propertyform.css";
import "../index.css";

const AddressComponent = ({ name,  value, onChange, setFormData }) => {
  const inputRef = useRef();

  const handlePlaceChanged = () => {
    const [place] = inputRef.current.getPlaces();

    if (place) {
      const formattedAddress = place.formatted_address;
      console.log(place.formatted_address);
      console.log(place.geometry.location.lat());
      console.log(place.geometry.location.lng());

      onChange({
        target: {
          name,
          value: formattedAddress,
        },
      });
    }
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.addListener("places_changed", handlePlaceChanged);
    }
  }, [inputRef, onChange, setFormData, name]);

  return (
    <LoadScript
      googleMapsApiKey="AIzaSyDlPYqT8dRx491JOYQWKRRCleR0GP72Wwk"
      libraries={["places"]}
    >
      <StandaloneSearchBox
        onLoad={(ref) => (inputRef.current = ref)}
        onPlacesChanged={handlePlaceChanged}
      >
           <div className="input-group">
  <label className="input-label" htmlFor="address">Address:</label>
            <input
              type="text"
              className="input"
              placeholder=""
              name={name}
              value={value} 
              onChange={onChange}
            />
              
            
         
        </div>
      </StandaloneSearchBox>
      
    </LoadScript>
  );
};

export default AddressComponent;
