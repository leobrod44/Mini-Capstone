import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import AddCondoBtn from "../components/AddCondoBtn";
import BackArrowBtn from "../components/BackArrowBtn";  // Import BackArrowBtn component
import EditPropertyComponent from "../components/EditPropertyComponent";
import "../index.css";
import "../styling/PropertyDetailsPage.css";
import CondoMgmtComponent from "../components/CondoMGMTComponent";
import {getCondos, getPropertyData} from "../backend/PropertyHandler";
import { getCondoPicture } from "../backend/ImageHandler";


const PropertyDetailsPage = () => {
  let { propertyID, propertyName } = useParams();
  // State to represent whether the user has registered condos or not, since i dont have backend right now
  const navigate = useNavigate();
  const [condoDetails, setCondoDetails] = useState([]);
  const [hasCondos, setHasCondos] = useState(false);
  let [condoPicURL, setCondoPicURL] = useState(null);
  const [showEdit, setShowEdit] = useState(true);

  useEffect(() => {
    const fetchCondos = async () => {
      try {
        const condos = await getCondos(propertyID);
        await Promise.all(condos.map(async (condo) => {
          const propertyData = await getPropertyData(condo.property);
          condoPicURL = await getCondoPicture(propertyData["propertyName"] + "/" + condo.unitNumber);
          setCondoPicURL(condoPicURL);
          condo.picture = condoPicURL;
          return { ...condo };
        }));
        if (condos.length > 0) {
          setHasCondos(true);
          setCondoDetails(condos);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchCondos();
  }, []);

  const toggleEdit = () => {
    setShowEdit(!showEdit);
  };

  return (
    <div>
      <Header />
      <BackArrowBtn /> {/* Include BackArrowBtn here */}
      <div className="center-page" >
        <div className="title_container">
          <h3 className="DB_title"> {propertyName}</h3>
        </div>

        <div className="buttons_container">
          {showEdit ? (
            <div>
              <button className="details-button" onClick={toggleEdit}>
                Edit Property
              </button>
            </div>
          ) : (
              <div className="edit_container">
                <EditPropertyComponent />
                <button className="edit-property-button" onClick={toggleEdit}>
                  Cancel
                </button>
              </div>
          )}
        </div>

        {showEdit && (
          <div>
            {hasCondos ? (
              <div className="condo_list">
                {condoDetails.map((condo, index) => (
                  <CondoMgmtComponent key={index} {...condo} condoId={condo.id} />
                ))}

              </div>
            ) : (
              <div className="content_container">
                <div className="white_card">
                  <p className="card_title">You have not added any condos yet.</p>
                  {/*<p className="button"> Add a condo</p>*/}
                  <Link className="button" to={`/add-condo/${propertyID}/${propertyName}`}>Add a condo</Link>
                </div>
              </div>
            )}
          </div>
        )}
        {hasCondos && <AddCondoBtn data-testid="add-condo-btn" onClick={() => navigate(`/add-condo/${propertyID}/${propertyName}`)} />}
      </div>
      <Footer/>
    </div>
  );
};

export default PropertyDetailsPage;
