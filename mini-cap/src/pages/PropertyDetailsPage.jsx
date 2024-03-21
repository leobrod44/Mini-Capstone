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
import { getCondos, getPropertyData } from "../backend/PropertyHandler";
//import { getCondos, getPropertyData } from "../backend/PropertyHandler";
import { getCondoPicture } from "../backend/ImageHandler";
import Pagination from "../components/Pagination";
import "../styling/Pagination.css";

const PropertyDetailsPage = () => {
  let { propertyID, propertyName } = useParams();
  // State to represent whether the user has registered condos or not, since i dont have backend right now
  const navigate = useNavigate();
  const [condoDetails, setCondoDetails] = useState([]);
  const [hasCondos, setHasCondos] = useState(false);
  let [condoPicURL, setCondoPicURL] = useState(null);
  const [showEdit, setShowEdit] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchCondos = async () => {
      try {
        const condos = await getCondos(propertyID);
        await Promise.all(
          condos.map(async (condo) => {
            const propertyData = await getPropertyData(condo.property);
            condoPicURL = await getCondoPicture(
              propertyData["propertyName"] + "/" + condo.unitNumber
            );
            setCondoPicURL(condoPicURL);
            condo.picture = condoPicURL;
            return { ...condo };
          })
        );
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

  const condosPerPage = 4;
  const indexOfLastCondo = currentPage * condosPerPage;
  const indexOfFirstCondo = indexOfLastCondo - condosPerPage;

  const condosToDisplayPaginated = condoDetails.slice(
    indexOfFirstCondo,
    indexOfLastCondo
  );

  return (
    <div>
      <Header />
      <BackArrowBtn /> {/* Include BackArrowBtn here */}
      <div className="center-page">
        <div className="title_container">
          <h3 className="DB_title"> {propertyName}</h3>
        </div>

        <div className="buttons_container">
          {showEdit ? (
            <div className="top-button-container">
              <div>
                <button className="property-buttons" onClick={toggleEdit}>
                  Edit Property
                </button>
              </div>
              
              <div>
                <Link
                className="property-link"
                to={`/condo-files/${propertyID}/${propertyName}`}
                >
                  Add Property Files
                </Link>
              </div>
            </div>
          ) : (
            <div className="edit_container">
              <EditPropertyComponent toggleEdit={toggleEdit} />
            </div>
          )}
        </div>

        {showEdit && (
          <div>
            {hasCondos ? (
              <div className="condo_list">

                {condosToDisplayPaginated.map((condo, index) => (
                  <CondoMgmtComponent key={index} {...condo} condoId={condo.id} />
                ))}

              </div>
            ) : (
              <div className="content_container">
                <div className="white_card">
                  <p className="card_title">You have not added any condos yet.</p>
                  {/*<p className="button"> Add a condo</p>*/}
                  <Link
                    className="buttonDetails"
                    to={`/add-condo/${propertyID}/${propertyName}`}
                  >
                    Add a condo
                  </Link>
                </div>
              </div>
            )}
            <div className="pagination-container">
              <Pagination
                itemsPerPage={condosPerPage}
                totalItems={condoDetails.length}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
              />
            </div>
          </div>
        )}
        {hasCondos && (
          <AddCondoBtn
            data-testid="add-condo-btn"
            onClick={() => navigate(`/add-condo/${propertyID}/${propertyName}`)}
          />
        )}
      </div >
      <Footer />
    </div >
  );
};

export default PropertyDetailsPage;
