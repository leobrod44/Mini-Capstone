import Header from "../components/Header";
import Footer from "../components/Footer";
import CondoComponent from "../components/CondoComponent.jsx";
import "../index.css";
import "../styling/Dashboard.css";
import React, { useEffect, useState } from "react";
import Popup from "../components/Popup";
import AddCondoBtn from "../components/AddCondoBtn";
import { getCondoPicture } from "../backend/ImageHandler.js";
import { getUserCondos, linkCondoToUser } from "../backend/PropertyHandler.js";

import store from "storejs";
import { toast } from "react-toastify";
import Pagination from "../components/Pagination";
import "../styling/Pagination.css";

import { Link, useParams } from "react-router-dom";


/**
 * Functional component representing the dashboard page.
 * @returns {JSX.Element} - The JSX for the dashboard page.
 */
const Dashboard = () => {
  const { userID } = useParams();
  // State to represent whether the user has registered condos or not, since i dont have backend right now
  const [hasCondos, setHasCondos] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [condoDetails, setCondoDetails] = useState([]);
  let [condoPicURL, setCondoPicURL] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchCondos = async () => {
      try {
        // Fetch condos for the user
        const condos = await getUserCondos(store("user"));

        // Fetch and set picture for each condo
        await Promise.all(
          condos.map(async (condo) => {
            condoPicURL = await getCondoPicture(
              condo.propertyName + "/" + condo.unitNumber
            );
            setCondoPicURL(condoPicURL);
            condo.picture = condoPicURL;
            return { ...condo };
          })
        );
        // Update state based on whether user has condos or not
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

  // Function to toggle the registration popup
  const handlePopupToggle = () => {
    setShowPopup(!showPopup);
  };

  // Function to handle registering a condo
  const handleRegisterCondo = async (key) => {
    let msg = "";
    try {
      msg = await linkCondoToUser(store("user"), key);
    } catch (e) {
      console.log("Error adding condo: ", e);
      msg=e;
    }
    if (msg === "Condo added!") {
      setTimeout(function () {
        window.location.reload();
      }, 1700);
      toast.success(msg);
    } else {
      toast.error(msg);
    }
    setShowPopup(false);
    //setHasCondos(true);
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
      <div className="center-page">
        <div className="title_container">
          <h3 className="DB_title"> Welcome to your Condo Dashboard ! </h3>
        </div>
        <Link
          className="property-buttonsUF"
          to={`/view-files/${userID}`} // Pass userID to the ViewFilesPage
        >
          View My Files
        </Link>
        <div className="content_container">
          {hasCondos ? (
            <div className="condo_list">
              {/* Render properties */}
              {condosToDisplayPaginated.map((condo, index) => (
                <CondoComponent
                  key={index}
                  condo={{
                    property: condo.propertyName,
                    picture: condo.picture,
                    address: condo.propertyAddress,
                    unitNumber: condo.unitNumber,
                    parkingNumber: condo.parkingNumber,
                    lockerNumber: condo.lockerNumber,
                    userType: condo.userType,
                    condoId: condo.id
                  }}
                  data-testid="condo-component"
                />
              ))}
              <div className="pagination-container" style={{ display: "flex", justifyContent: "center", width: "100%" }}>
                <Pagination
                  itemsPerPage={condosPerPage}
                  totalItems={condoDetails.length}
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                />
              </div>
            </div>
          ) : (
            // Render registration section if the user has no properties
            <div className="white_card">
              <p className="card_title">You have not registered a condo yet.</p>
              <button className="button" onClick={handlePopupToggle}>
                Register my first condo
              </button>
            </div>
          )}
        </div>

        {showPopup && (
          <Popup
            handleClose={handlePopupToggle}
            handleRegisterCondo={handleRegisterCondo}
          />
        )}

        {!showPopup && hasCondos && (
          <AddCondoBtn
            data-testid="add-condo-btn"
            onClick={handlePopupToggle}
          />
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;
