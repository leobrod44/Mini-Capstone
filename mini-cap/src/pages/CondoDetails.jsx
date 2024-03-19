import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import "../index.css";
import "../styling/CondoDetails.css";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BackArrowBtn from "../components/BackArrowBtn.jsx";
import DeleteModal from '../components/DeleteModal.jsx';
import Popup_SendKey from '../components/Popup_SendKey.js';
import RequestForm from "../components/RequestForm.jsx";
import FinancialDetails from "../components/FinancialDetails.jsx";
import {getCondo} from "../backend/PropertyHandler";
import {getCondoPicture} from "../backend/ImageHandler";
import {toast} from "react-toastify";
import store from "storejs";
import {getCompanyEmail} from "../backend/UserHandler";
import {MANAGEMENT_COMPANY} from "../backend/Constants";
import CondoRequests from "../components/CondoRequestsView.jsx";
import { MdExpandLess, MdExpandMore } from "react-icons/md";
import { getRequests } from "../backend/RequestHandler";
import { FaCheck, FaTimes } from 'react-icons/fa'; // Import icons from react-icons library

export default function CondoDetails(){
	let { condoId } = useParams();
	const [condoDetails, setCondoDetails] = useState(false);
	const [showPopup, setShowPopup] = useState(false);
	const [show, setShow] = useState(false);
	let [condoPicURL, setCondoPicURL] = useState(null);
	const navigate = useNavigate();
	const [role, setTheRole] = useState("");
	const [companyEmail, setCompanyEmail] = useState(null);
	const [displayForm, setDisplayForm] = useState(false);
	const [requests, setRequests] = useState([]);

	useEffect(() => {
		const fetchCondo = async () => {
			try {
				setTheRole(store("role"));
				const condo = await getCondo(condoId);
				condoPicURL = await getCondoPicture(
					condo.propertyName + "/" + condo.unitNumber
				);
				setCondoPicURL(condoPicURL);
				condo.picture = condoPicURL;
				setCondoDetails(condo);
				setCompanyEmail(await getCompanyEmail(condoId));
			} catch (err) {
				console.error(err);
			}
		};

		const fetchRequests = async () => {
			try {
				setRequests(await getRequests(condoId));
			} catch (error) {
				console.error("Error fetching requests:", error);
			}
		};

		fetchCondo();
		fetchRequests();
	}, []);

	if (condoDetails === null) {
		// If condoDetails is still null, return a loading state or handle it accordingly
		return <div>Loading...</div>;
	}

	//NOT FINISHED
	const deleteCondoAttempt = async () => {
		try {
			//logic to delete condo
		} catch (error) {
			toast.error("Error deleting account");
		}
		setShow(false);
		navigate(`/propertydetailspage/${propertyID}/${propertyName}`);
	};

    const handlePopupToggle = () => {
        setShowPopup(!showPopup);
    }

    const handleClickDelete = () => {
        setShow(true);
    };

	const handleClickRequest = () => {
		setDisplayForm(true);
	};

	const handleClickClose = () => {
        setDisplayForm(false);
    };
    const handleClose = () => {
        setShow(false);
	};

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
		status
	} = condoDetails;

	const [showCondoRequests, setShowCondoRequests] = useState(false);

	const toggleCondoRequests = () => {
		setShowCondoRequests(!showCondoRequests);
	}
	const[showFinancialDetails, setShowFinancialDetails] = useState(false);

	const toggleFinancialDetails = () => {
		setShowFinancialDetails(!showFinancialDetails);
	}

	{/* TO DO is RentPaid */}
    const [isRentPaid, setIsRentPaid] = useState(false); // State to track whether rent is paid

    const toggleRentPaid = () => {
        setIsRentPaid(!isRentPaid);
    };

		return(
			<div className='pageContainer'>
			<>
				<Header/>
				
				<div className="details" style={{zIndex: 2, position: 'relative', marginTop: '20px'}}>
				<div className="title_container">
					<link
						rel="stylesheet"
						href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css"
						integrity="sha384-rbsA2VBKQhggwzxH7pPCaAqO46MgnOM80zW1RWuH61DGLwZJEdK2Kadq2F9CUG65"
						crossOrigin="anonymous"
					/>
					<div className="condo-details-container">
						<div className="condo-info">
							<div className='name-and-number'>
								<div className= 'pic-and-num'>
									{picture && <img src={picture} alt="Profile" className="profile-picture" />}
								</div>
								<div>
									{role !== MANAGEMENT_COMPANY && (
										<>
											{isRentPaid ? <FaCheck className="Ownergreen-check" /> : <FaTimes className="Ownerred-cross" />}
										</>
									)}
									{role === MANAGEMENT_COMPANY && status !== "Vacant" && (
										<>
											{isRentPaid ? <FaCheck className="CONDOgreen-check" /> : <FaTimes className="CONDOred-cross" />}
										</>
									)}
								</div>
								<div className='pic-and-tag'>
								{status === "Vacant" && role === MANAGEMENT_COMPANY && (
									<>
									<div>
										<div className={`user-tag vacant`}>{status}</div>
										{role === MANAGEMENT_COMPANY && (
										<>
											<button className="sendkey-button" onClick={handlePopupToggle}>Send Key</button>
										</>)}
									</div>
									</>
								)}
								{status  === "Rented" && role === MANAGEMENT_COMPANY && (
									<>
										<div className={`user-tag renter`}>{status}</div>
									</>
								)}
								{status  === "Owned" && role === MANAGEMENT_COMPANY && (
									<>
										<div className={`user-tag owner`}>{status}</div>
									</>
								)}
							</div>

							</div>
							<div className='other-info'>
								<h2 className="DB_title"> {propertyName} <br /><br /></h2>

								<h5 style={{paddingTop:"25px", paddingLeft:"25%", color:"#2f2c9"}}>General Information</h5>
           
								<div className='other-info1'>
									<div className='other-info2'><h5>Address: </h5></div>
									<div className= 'other-info2'>{address}</div>
								</div>

								<div className='other-info1'>
									<div className='other-info2'><h5>Unit Number: </h5></div>
									<div className='other-info2'>{unitNumber}</div>
								</div>

								<div className='other-info1'>
									<div className='other-info2'><h5>Square Feet: </h5></div>
									<div className= 'other-info2'>{squareFeet} sq ft</div>
								</div>

								<div className='other-info1'>
									<div className='other-info2'><h5>Unit size: </h5></div>
									<div className= 'other-info2'>{unitSize} sq ft</div>
								</div>
								<div className='other-info1'>
									<div className='other-info2'><h5>Parking spot number: </h5></div>
									<div className= 'other-info2'>{parkingNumber}</div>
								</div>

								<div className='other-info1'>
									<div className='other-info2'><h5>Locker number: </h5></div>
									<div className= 'other-info2'>{lockerNumber}</div>
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

								<div className='other-info1'>
								{role === MANAGEMENT_COMPANY && status !== "Vacant" && (
										<>
											<div className='other-info2'><h5>Renter/Owner Email: </h5></div>
											<div className='other-info2'>{occupant}</div>
										</>)}
								</div>

								<div className='other-info1'>
								{role !== MANAGEMENT_COMPANY && (
										<>
											<div className='other-info2'><h5>Property Company Email: </h5></div>
											<div className='other-info2'>{companyEmail}</div>
										</>)}
								</div>
								
							</div>

							<div style={{display: "flex" , alignItems: "center"}}>
								<h5 style={{paddingTop:"25px",  paddingBottom:"5%", paddingLeft:"25%", color:"#2f2c9", marginRight:"auto"}}>Condo Requests</h5>
								<div>
									<button id="toggleButton" className="requests-button" onClick={toggleCondoRequests}>
										{showCondoRequests ? <MdExpandLess/> : <MdExpandMore />} </button>
								</div>
							</div>

							<div className="other-info">
								{showCondoRequests && (
									requests.length > 0 ? (
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
										<p className="request-container">There are no current requests</p>
									)
								)}
							</div>

							{/*NEED TO IMPLEMENT FUNCTIONALITY for edit*/}
							<div>
								{role === MANAGEMENT_COMPANY && (
									<>
										<button className="edit-button"> Edit</button>
										<button className="delete-button" data-testid="delete-button-test" onClick={() => handleClickDelete()}>Delete</button>
									</>)}
							</div>
							<div style={{display: "flex" , alignItems: "center"}}>
							<h5 style={{paddingTop:"25px",  paddingBottom:"5%", paddingLeft:"25%", color:"#2f2c9", marginRight:"auto"}}>My financial details</h5>
								<div>
									<button id="toggleButton" className="finance-button" onClick={toggleFinancialDetails}>
										{showFinancialDetails ? <MdExpandLess/> : <MdExpandMore />}
									</button>
								</div>
							</div>
							<div className="other-info">
								{showFinancialDetails && (
									<FinancialDetails/>
								)}
							</div>
							<div>
								{role !== MANAGEMENT_COMPANY && (
									<>
										<button className="modal-button" onClick={() => handleClickRequest()}> Create Request</button>
									</>)}
							</div>
							<div id="modal" className="modal" style={{ display: displayForm ? 'block' : 'none' }}>
								<RequestForm
									handleClickClose={handleClickClose}
								/>
							</div>
						</div>
					</div>
					{showPopup && <Popup_SendKey handleClose={handlePopupToggle}/>}
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
				<button onClick={toggleRentPaid}>Toggle Rent Paid</button>)
			}
			{role === MANAGEMENT_COMPANY && status !=="Vacant" && (					
				<button onClick={toggleRentPaid}>Toggle Rent Paid</button>)
			}
			{ !displayForm && (
				<BackArrowBtn/>
			)}
			<div style={{zIndex: 1, position: 'relative'}}><Footer/></div>
		</>
		</div>
	);
}