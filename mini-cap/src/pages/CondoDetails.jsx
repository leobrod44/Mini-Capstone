import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import "../index.css";
import "../styling/CondoDetails.css";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BackArrowBtn from "../components/BackArrowBtn.jsx";
import DeleteModal from "../components/DeleteModal.jsx";
import Popup_SendKey from "../components/Popup_SendKey.js";
import RequestForm from "../components/RequestForm.jsx";
import FinancialDetails from "../components/FinancialDetails.jsx";
import { getCondo, editCondo, deleteCondo } from "../backend/PropertyHandler";
import { getCondoPicture } from "../backend/ImageHandler";
import { toast } from "react-toastify";
import store from "storejs";
import { getCompanyEmail } from "../backend/UserHandler";
import { MANAGEMENT_COMPANY } from "../backend/Constants";
import CondoRequests from "../components/CondoRequestsView.jsx";
import { MdExpandLess, MdExpandMore } from "react-icons/md";
import { getRequests } from "../backend/RequestHandler";
import { FaCheck, FaTimes } from "react-icons/fa"; // Import icons from react-icons library

/**
 * Component for displaying details of a condo.
 * @returns {JSX.Element} The rendered CondoDetails component.
 */
export default function CondoDetails() {
  // Retrieve condoId from URL parameters
  let { condoId } = useParams();

  // State to manage condo details
  const [condoDetails, setCondoDetails] = useState(false);
  // State to manage showing popup
  const [showPopup, setShowPopup] = useState(false);
  // State to manage showing delete confirmation modal
  const [show, setShow] = useState(false);
  // State to manage condo picture URL
  let [condoPicURL, setCondoPicURL] = useState(null);
  // Navigation hook
  const navigate = useNavigate();
  // State to manage user role
  const [role, setTheRole] = useState("");
  // State to manage company email
  const [companyEmail, setCompanyEmail] = useState(null);
  const [displayForm, setDisplayForm] = useState(false);
  // State to manage condo requests
  const [requests, setRequests] = useState([]);
  // State to manage showing condo requests
  const [showCondoRequests, setShowCondoRequests] = useState(false);
  // State to manage showing financial details
  const [showFinancialDetails, setShowFinancialDetails] = useState(false);
  // State to track whether rent is paid
  const [isRentPaid, setIsRentPaid] = useState(false);
  const [editedDetails, setEditedDetails] = useState({});
  const [isEditMode, setIsEditMode] = useState(false);
  useEffect(() => {
    const fetchCondo = async () => {
      try {
        // Retrieve user role from local storage
        setTheRole(store("role"));
        // Retrieve condo details
        const condo = await getCondo(condoId);
        // Retrieve condo picture URL
        condoPicURL = await getCondoPicture(
          condo.propertyName + "/" + condo.unitNumber
        );
        setCondoPicURL(condoPicURL);
        condo.picture = condoPicURL;
        // Set condo details state
        setCondoDetails(condo);
        // Retrieve company email
        setCompanyEmail(await getCompanyEmail(condoId));
      } catch (err) {
        console.error(err);
      }
    };

    const fetchRequests = async () => {
      try {
        // Retrieve condo requests
        setRequests(await getRequests(condoId));
      } catch (error) {
        console.error("Error fetching requests:", error);
      }
    };

    fetchCondo();
    fetchRequests();
  }, []);

  // Function to handle delete condo attempt
  const deleteCondoAttempt = async () => {
    try {
      const success = await deleteCondo(condoId);
      if (success) {
        toast.success("Condo deleted successfully");
        navigate(
          `/propertydetailspage/${condoDetails.propertyID}/${condoDetails.propertyName}`
        );
      } else {
        throw new Error("Failed to delete condo");
      }
    } catch (error) {
      toast.error(error.message);
    }
    setShow(false);
  };

  // Function to toggle popup visibility
  const handlePopupToggle = () => {
    setShowPopup(!showPopup);
  };

  // Function to handle click on delete button
  const handleClickDelete = () => {
    setShow(true);
  };

  // Function to open request form modal
  const handleClickRequest = () => {
    setDisplayForm(true);
  };

  // Funcion to close request form modal
  const handleClickClose = () => {
    setDisplayForm(false);
  };

  // Function to close delete confirmation modal
  const handleClose = () => {
    setShow(false);
  };

  const handleInputChange = (e) => {
    setEditedDetails({
      ...editedDetails,
      [e.target.name]: e.target.value,
    });
  };

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
    setEditedDetails(condoDetails);
  };

  const handleSaveChanges = async () => {
    // Check for empty Unit Number and Square Feet
    if (!editedDetails.unitNumber.trim()) {
      toast.error("Unit Number cannot be empty");
      return;
    }
    if (!editedDetails.squareFeet.trim()) {
      toast.error("Square Feet cannot be empty");
      return;
    }

    // Validation for Unit Number
    if (
      !/^\d*$/.test(editedDetails.unitNumber) ||
      parseInt(editedDetails.unitNumber, 10) <= 0 ||
      parseInt(editedDetails.unitNumber, 10) > 999
    ) {
      toast.error("Unit Number must be a positive integer between 1 and 999");
      return;
    }

    // Validation for Square Feet
    if (
      !/^\d*$/.test(editedDetails.squareFeet) ||
      parseInt(editedDetails.squareFeet, 10) <= 0 ||
      parseInt(editedDetails.squareFeet, 10) > 4999
    ) {
      toast.error("Square Feet must be a positive integer between 1 and 4999");
      return;
    }

    try {
      await editCondo(condoId, editedDetails);
      setIsEditMode(false);
      setCondoDetails(editedDetails);
      toast.success("Condo details updated successfully");
    } catch (error) {
      toast.error("Failed to update condo details");
    }
  };

  // Destructure condoDetails for easier access
  const {
    propertyName,
    address,
    unitNumber,
    squareFeet,
    unitSize,
    parkingNumber,
    lockerNumber,
    picture,
    propertyID,
    occupant,
    status,
  } = condoDetails;

  // Function to toggle showing condo requests
  const toggleCondoRequests = () => {
    setShowCondoRequests(!showCondoRequests);
  };

  // Function to toggle showing financial details
  const toggleFinancialDetails = () => {
    setShowFinancialDetails(!showFinancialDetails);
  };

  // Function to toggle rent paid status
  const toggleRentPaid = () => {
    setIsRentPaid(!isRentPaid);
  };

  return (
    <div className="pageContainer">
      <>
        <Header />

        <div
          className="details"
          style={{ zIndex: 2, position: "relative", marginTop: "20px" }}
        >
          <div className="title_container">
            <link
              rel="stylesheet"
              href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css"
              integrity="sha384-rbsA2VBKQhggwzxH7pPCaAqO46MgnOM80zW1RWuH61DGLwZJEdK2Kadq2F9CUG65"
              crossOrigin="anonymous"
            />
            <div className="condo-details-container">
              {isEditMode ? (
                <form className="condo-info">
                  <div className="edit-mode-image-container">
                    <div className="name-and-number">
                      {picture && (
                        <img
                          src={picture}
                          alt="Condo"
                          className="profile-picture edit-mode-image"
                        />
                      )}
                    </div>
                  </div>
                  <h2 className="DB_title">{editedDetails.propertyName}</h2>
                  <div className="other-info">
                    <div
                      className="edit-mode-fields"
                      style={{ color: "#2f2c9b", fontSize: "20px" }}
                    >
                      <div className="input-group">
                        <label htmlFor="unitNumber" className="field-label">
                          Unit Number:
                        </label>
                        <input
                          id="unitNumber"
                          type="text"
                          name="unitNumber"
                          className="edit-input"
                          value={editedDetails.unitNumber}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="input-group">
                        <label htmlFor="squareFeet" className="field-label">
                          Square Feet:
                        </label>
                        <input
                          id="squareFeet"
                          type="text"
                          name="squareFeet"
                          className="edit-input"
                          value={editedDetails.squareFeet}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="input-group">
                        <label htmlFor="unitSize" className="field-label">
                          Unit Size:
                        </label>
                        <select
                          id="unitSize"
                          name="unitSize"
                          className="edit-input"
                          value={editedDetails.unitSize}
                          onChange={handleInputChange}
                        >
                          <option value="" disabled style={{ color: "gray" }}>
                            Select Unit Size
                          </option>
                          <option value="1.5">1 1/2</option>
                          <option value="2.5">2 1/2</option>
                          <option value="3.5">3 1/2</option>
                          <option value="4.5">4 1/2</option>
                          <option value="5.5">5 1/2</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="edit-buttons">
                    <button
                      type="button"
                      className="edit-button"
                      onClick={handleSaveChanges}
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      className="cncl-btn"
                      onClick={toggleEditMode}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="condo-info">
                  <div className="name-and-number">
                    <div className="pic-and-num">
                      {picture && (
                        <img
                          src={picture}
                          alt="Profile"
                          className="profile-picture"
                        />
                      )}
                    </div>
                    <div>
                      {role !== MANAGEMENT_COMPANY && (
                        <>
                          {isRentPaid ? (
                            <FaCheck className="Ownergreen-check" />
                          ) : (
                            <FaTimes className="Ownerred-cross" />
                          )}
                        </>
                      )}
                      {role === MANAGEMENT_COMPANY && status !== "Vacant" && (
                        <>
                          {isRentPaid ? (
                            <FaCheck className="CONDOgreen-check" />
                          ) : (
                            <FaTimes className="CONDOred-cross" />
                          )}
                        </>
                      )}
                    </div>
                    <div className="pic-and-tag">
                      {status === "Vacant" && role === MANAGEMENT_COMPANY && (
                        <>
                          <div>
                            <div className={`user-tag vacant`}>{status}</div>
                            {role === MANAGEMENT_COMPANY && (
                              <>
                                <button
                                  className="sendkey-button"
                                  onClick={handlePopupToggle}
                                >
                                  Send Key
                                </button>
                              </>
                            )}
                          </div>
                        </>
                      )}
                      {status === "Rented" && role === MANAGEMENT_COMPANY && (
                        <>
                          <div className={`user-tag renter`}>{status}</div>
                        </>
                      )}
                      {status === "Owned" && role === MANAGEMENT_COMPANY && (
                        <>
                          <div className={`user-tag owner`}>{status}</div>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="other-info">
                    <h2 className="DB_title">
                      {" "}
                      {propertyName} <br />
                      <br />
                    </h2>

                    <h5
                      style={{
                        paddingTop: "25px",
                        paddingLeft: "25%",
                        color: "#2f2c9",
                      }}
                    >
                      General Information
                    </h5>

                    <div className="other-info1">
                      <div className="other-info2">
                        <h5>Address: </h5>
                      </div>
                      <div className="other-info2">{address}</div>
                    </div>

                    <div className="other-info1">
                      <div className="other-info2">
                        <h5>Unit Number: </h5>
                      </div>
                      <div className="other-info2">{unitNumber}</div>
                    </div>

                    <div className="other-info1">
                      <div className="other-info2">
                        <h5>Square Feet: </h5>
                      </div>
                      <div className="other-info2">{squareFeet} sq ft</div>
                    </div>

                    <div className="other-info1">
                      <div className="other-info2">
                        <h5>Unit size: </h5>
                      </div>
                      <div className="other-info2">{unitSize} sq ft</div>
                    </div>
                    <div className="other-info1">
                      <div className="other-info2">
                        <h5>Parking spot number: </h5>
                      </div>
                      <div className="other-info2">{parkingNumber}</div>
                    </div>

                    <div className="other-info1">
                      <div className="other-info2">
                        <h5>Locker number: </h5>
                      </div>
                      <div className="other-info2">{lockerNumber}</div>
                    </div>

                    {/*	THIS ALL PRICE LOGIC:*/}
                    {/*------------------------------------------------------------------------------------------*/}
                    {/*<div className='other-info1'>*/}
                    {/*	<div className='other-info2'><h5>Price/sq ft.: </h5></div>*/}
                    {/*	<div className='other-info2'>{"pricesf"}</div>*/}
                    {/*</div>*/}

                    {/*<div className='other-info1'>*/}
                    {/*	<div className='other-info2'><h5>Unit Price: </h5></div>*/}
                    {/*	<div className='other-info2'>{"price"}</div>*/}

                    {/*</div>*/}

                    {/*<div className='other-info1'>*/}
                    {/*{condoStatus === "rented" && (*/}
                    {/*		<>*/}
                    {/*			<div className='other-info2'><h5>Current Rent Price: </h5></div>*/}
                    {/*			<div className='other-info2'>{"currentPrice"}</div>*/}
                    {/*		</>)}*/}
                    {/*</div>*/}

                    {/*<div className='other-info1'>*/}
                    {/*{role === "renter" && condoStatus === "rented" && (*/}
                    {/*		<>*/}
                    {/*			<div className='other-info2'><h5>Next Rent Due Date: </h5></div>*/}
                    {/*			<div className='other-info2'>{"rentDueDate"}</div>*/}

                    {/*		</>)}*/}
                    {/*</div>*/}
                    {/*------------------------------------------------------------------------------------------*/}

                    <div className="other-info1">
                      {role === MANAGEMENT_COMPANY && status !== "Vacant" && (
                        <>
                          <div className="other-info2">
                            <h5>Renter/Owner Email: </h5>
                          </div>
                          <div className="other-info2">{occupant}</div>
                        </>
                      )}
                    </div>

                    <div className="other-info1">
                      {role !== MANAGEMENT_COMPANY && (
                        <>
                          <div className="other-info2">
                            <h5>Property Company Email: </h5>
                          </div>
                          <div className="other-info2">{companyEmail}</div>
                        </>
                      )}
                    </div>
                  </div>
                  <div>
                    {/* Check if condo status is "Rented" */}
                    {(condoDetails.status === "Owned" ||
                      role === MANAGEMENT_COMPANY) && (
                      <div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            paddingTop: "8%",
                          }}
                        >
                          <h5
                            style={{
                              paddingTop: "25px",
                              paddingBottom: "5%",
                              paddingLeft: "25%",
                              color: "#2f2c9",
                              marginRight: "auto",
                            }}
                          >
                            Condo Requests
                          </h5>
                          <div>
                            <button
                              id="toggleButton"
                              className="requests-button"
                              onClick={toggleCondoRequests}
                            >
                              {showCondoRequests ? (
                                <MdExpandLess />
                              ) : (
                                <MdExpandMore />
                              )}
                            </button>
                          </div>
                        </div>

                        <div className="other-info">
                          {showCondoRequests && (
                            <>
                              {requests.length > 0 ? (
                                requests.map((request, index) => (
                                  <CondoRequests
                                    key={index}
                                    type={request.type}
                                    notes={request.notes}
                                    role={role}
                                    step={request.step}
                                    condoId={condoId}
                                    requestId={request.requestID}
                                  />
                                ))
                              ) : (
                                <p
                                  className="request-container"
                                  style={{ fontSize: "17px" }}
                                >
                                  You have no current requests
                                </p>
                              )}

                              {/* Code snippet to appear when status is "Owned" */}
                              {status === "Owned" && (
                                <div>
                                  <button
                                    className="modal-button"
                                    onClick={() => handleClickRequest()}
                                    style={{ marginTop: "10%" }}
                                  >
                                    Create Request
                                  </button>
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <h5
                      style={{
                        paddingTop: "15%",
                        paddingBottom: "5%",
                        paddingLeft: "25%",
                        color: "#2f2c9",
                        marginRight: "auto",
                      }}
                    >
                      My financial details
                    </h5>
                    <div>
                      <button
                        id="toggleButton"
                        className="finance-button"
                        onClick={toggleFinancialDetails}
                      >
                        {showFinancialDetails ? (
                          <MdExpandLess />
                        ) : (
                          <MdExpandMore />
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="other-info">
                    {showFinancialDetails && <FinancialDetails />}
                  </div>
                  <div
                    id="modal"
                    className="modal"
                    style={{ display: displayForm ? "block" : "none" }}
                  >
                    <RequestForm
                      handleClickClose={handleClickClose}
                      condoInfo={condoDetails}
                    />
                  </div>
                  {/*NEED TO IMPLEMENT FUNCTIONALITY for edit*/}
                  <div>
                    {role === MANAGEMENT_COMPANY && (
                      <>
                        <button
                          className="edit-button"
                          onClick={toggleEditMode}
                        >
                          Edit
                        </button>
                        <button
                          className="delete-button"
                          data-testid="delete-button-test"
                          onClick={() => handleClickDelete()}
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
            {showPopup && <Popup_SendKey handleClose={handlePopupToggle} />}
            <div data-testid="popup-delete-test">
              <DeleteModal
                show={show}
                handleClose={handleClose}
                handleDeleteItem={deleteCondoAttempt}
                message={"Are you sure you want to delete this Condo?"}
              />
            </div>
          </div>
        </div>
        {role !== MANAGEMENT_COMPANY && (
          <button onClick={toggleRentPaid}>Toggle Rent Paid</button>
        )}
        {role === MANAGEMENT_COMPANY && status !== "Vacant" && (
          <button onClick={toggleRentPaid}>Toggle Rent Paid</button>
        )}
        {!displayForm && <BackArrowBtn />}
        <div style={{ zIndex: 1, position: "relative" }}>
          <Footer />
        </div>
      </>
    </div>
  );
}
