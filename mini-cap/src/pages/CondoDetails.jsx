import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import "../index.css";
import "../styling/CondoDetails.css";
import React, {useEffect, useState} from "react";
import BackArrowBtn from "../components/BackArrowBtn.jsx";
// import PropTypes from 'prop-types';
import DeleteModal from '../components/DeleteModal.jsx';
import Popup_SendKey from '../components/Popup_SendKey.js';
import {getCondo} from "../backend/PropertyHandler";
import {getCondoPicture} from "../backend/ImageHandler";
import {toast} from "react-toastify";
import {useNavigate} from "react-router-dom";
//import {getCondoPicture} from "../backend/ImageHandler";

export default function CondoDetails(){
	// export default function CondoDetails({ propertyName, address, parkingNumber, lockerNumber, unitNumber, price, unitSize, squareFeet, pricesf, status, contact, currentPrice, rentDueDate }){
	const [condoDetails, setCondoDetails] = useState(false);
	const [showPopup, setShowPopup] = useState(false);
	const [show, setShow] = useState(false);
	let [condoPicURL, setCondoPicURL] = useState(null);
	const navigate = useNavigate();

	const condoStatus = 'vacant';
	const role = 'company';

	useEffect(() => {
		const fetchCondo = async () => {
			try {
				const condo = await getCondo("H7bG17pfeajqniUoG9O7");
				condoPicURL = await getCondoPicture(
					condo.propertyName + "/" + condo.unitNumber
				);
				setCondoPicURL(condoPicURL);
				condo.picture = condoPicURL;
				setCondoDetails(condo);

				console.log("PROPERTY ID: " + propertyID);
				console.log(propertyName);
				console.log(address);
			} catch (err) {
				console.error(err);
			}
		};
		fetchCondo();
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
		propertyID
	} = condoDetails;

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
							<div className='pic-and-tag'>
							{condoStatus === "vacant" && role === 'company' && (
									<>
									<div>
										<div className={`user-tag vacant`}>{"Vacant"}{"status"}</div>
										{role === "company" && (
										<>
											<button className="sendkey-button" onClick={handlePopupToggle}>Send Key</button>
										</>)}
									</div>
									</>)}
							{condoStatus === "rented" && role === 'company' && (
									<>
										<div className={`user-tag rented`}>{"Rented"}{"status"}</div>

									</>)}
							</div>


						</div>
							<div className='other-info'>
							<h2 className="DB_title"> {propertyName} <br /><br /></h2>

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

							<div className='other-info1'>
								<div className='other-info2'><h5>Price/sq ft.: </h5></div>
								<div className='other-info2'>{"pricesf"}</div>
							</div>

							<div className='other-info1'>
								<div className='other-info2'><h5>Unit Price: </h5></div>
								<div className='other-info2'>{"price"}</div>

							</div>

							<div className='other-info1'>
							{condoStatus === "rented" && (
									<>
										<div className='other-info2'><h5>Current Rent Price: </h5></div>
										<div className='other-info2'>{"currentPrice"}</div>
									</>)}
							</div>

							<div className='other-info1'>
							{role === "renter" && condoStatus === "rented" && (
									<>
										<div className='other-info2'><h5>Next Rent Due Date: </h5></div>
										<div className='other-info2'>{"rentDueDate"}</div>

									</>)}
							</div>

							<div className='other-info1'>
							{role === "company" && (
									<>
										<div className='other-info2'><h5>Contact of Renter/Owner: </h5></div>
										<div className='other-info2'>{"contact"}</div>
										<br /><br />
									</>)}
							</div>
							<div className='other-info1'>
							{role === "renter" && (
									<>
										<div className='other-info2'><h5>Contact: </h5></div>
										<div className='other-info2'>{"contact"}</div>
										<br /><br />
									</>)}
							</div>
							<div className='other-info1'>
							{role === "owner" && (
									<>
										<div className='other-info2'><h5>Contact: </h5></div>
										<div className='other-info2'>{"contact"}</div>
										<br /><br />
									</>)}
							</div>
						</div>
							<div>
								{role === "company" && (
									<>
										<button className="edit-button"> Edit</button>
										<button className="delete-button" data-testid="delete-button-test" onClick={() => handleClickDelete()}>Delete</button>
									</>)}
							</div>
					</div>
				</div>
				{showPopup && <Popup_SendKey handleClose={handlePopupToggle}/>}
				<div data-testid="popup-delete-test">
				<DeleteModal
				show={show}
				handleClose={handleClose}
				handleDeleteItem={deleteCondoAttempt}
				message={
				"Are you sure you want to delete this Condo?"
				}
				/></div>

			</div>
			</div>

			<BackArrowBtn/>
			<div style={{zIndex: 1, position: 'relative'}}><Footer/></div>
		</>
		</div>
	);

}

