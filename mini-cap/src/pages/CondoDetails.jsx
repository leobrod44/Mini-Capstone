import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import "../index.css";
import "../styling/CondoDetails.css";
import React, { useState } from "react";
import AddCondoBtn from "../components/AddCondoBtn.jsx";
import { Link, useNavigate } from "react-router-dom";
import BackArrowBtn from "../components/BackArrowBtn.jsx";

import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Import the FontAwesome library
import { faBars } from '@fortawesome/free-solid-svg-icons';
import DeleteModal from '../components/DeleteModal.jsx';
import Popup_SendKey from '../components/Popup_SendKey.js';



export default function CondoDetails({ name, profilePicture, address, parkingCount, lockerCount, unitNumber, price, size, squareFeet, pricesf, status, contact, currentPrice, rentDueDate }){
	
	const [showPopup, setShowPopup] = useState(false);
    const handlePopupToggle = () => {
        setShowPopup(!showPopup);
    }

    const [show, setShow] = useState(false);
    const handleClickDelete = () => {
        setShow(true);
    };
    const handleClose = () => {
        setShow(false);
	};

	const condoStatus = 'vacant';
    const role = 'company';

	CondoDetails.propTypes = {
        name: PropTypes.string.isRequired,
        profilePicture: PropTypes.string,
        address: PropTypes.string.isRequired,
        parkingCount: PropTypes.string,
        lockerCount: PropTypes.string,
        unitNumber: PropTypes.string,
        price: PropTypes.string,
        size: PropTypes.string,
        squareFeet: PropTypes.string,
        pricesf: PropTypes.string,
        status: PropTypes.string,
        contact: PropTypes.string,
        currentPrice: PropTypes.string,
        rentDueDate: PropTypes.string
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
									{<img src="https://ksquarecondos.com/wp-content/uploads/2019/09/q7l25-ts-c80_Gro-.%E5%89%AF%E6%9C%AC.jpg" alt="Profile" className="profile-picture" />}
								</div>
								<div className='pic-and-tag'>
								{condoStatus === "vacant" && role === 'company' && ( 
										<>
										<div>
											<div className={`user-tag vacant`}>{"Vacant"}{status}</div>
											{role === "company" && ( 
											<>
												<button className="sendkey-button" onClick={handlePopupToggle}>Send Key</button>
											</>)}
										</div>
										</>)}
								{condoStatus === "rented" && role === 'company' && ( 
										<>
											<div className={`user-tag rented`}>{"Rented"}{status}</div>
											
										</>)}
								</div>

							</div>
								<div className='other-info'>
								<h2 className="DB_title"> {"[Condo Name]"} {name} <br /><br /></h2>

								<div className='other-info1'>
									<div className='other-info2'><h5>Address: </h5></div> 
									<div className= 'other-info2'>{"[text]"} {address}</div>
								</div>
								
								<div className='other-info1'>
									<div className='other-info2'><h5>Unit Number: </h5></div> 
									<div className='other-info2'>{"[text]"}{unitNumber}</div>
								</div>

								<div className='other-info1'>
									<div className='other-info2'><h5>Square Feet: </h5></div> 
									<div className= 'other-info2'>{"[text]"}{squareFeet} sq ft</div>
								</div> 

								<div className='other-info1'>
									<div className='other-info2'><h5>Unit size: </h5></div> 
									<div className= 'other-info2'>{"[text]"}{size} sq ft</div>
								</div> 
								<div className='other-info1'>
									<div className='other-info2'><h5>Parking spot number: </h5></div> 
									<div className= 'other-info2'>{"[text]"}{parkingCount}</div>
								</div>  

								<div className='other-info1'>
									<div className='other-info2'><h5>Locker number: </h5></div> 
									<div className= 'other-info2'>{"[text]"}{lockerCount}</div>
								</div>

								<div className='other-info1'>
									<div className='other-info2'><h5>Price/sq ft.: </h5></div> 
									<div className='other-info2'>{"[text]"}{pricesf}</div>
								</div>  

								<div className='other-info1'>
									<div className='other-info2'><h5>Unit Price: </h5></div> 
									<div className='other-info2'>{}{price}</div>
									
								</div>

								<div className='other-info1'>
								{condoStatus === "rented" && ( 
										<>
											<div className='other-info2'><h5>Current Rent Price: </h5></div> 
											<div className='other-info2'>{}{currentPrice}</div>
										</>)}
								</div> 

								<div className='other-info1'>
								{role === "renter" && condoStatus === "rented" && ( 
										<>
											<div className='other-info2'><h5>Next Rent Due Date: </h5></div> 
											<div className='other-info2'>{}{rentDueDate}</div>

										</>)}
								</div> 

								<div className='other-info1'>
								{role === "company" && ( 
										<>
											<div className='other-info2'><h5>Contact of Renter/Owner: </h5></div> 
											<div className='other-info2'>{}{contact}</div>
											<br /><br />
										</>)}
								</div>   
								<div className='other-info1'>
								{role === "renter" && ( 
										<>
											<div className='other-info2'><h5>Contact: </h5></div> 
											<div className='other-info2'>{}{contact}</div>
											<br /><br />
										</>)}
								</div>
								<div className='other-info1'>
								{role === "owner" && ( 
										<>
											<div className='other-info2'><h5>Contact: </h5></div> 
											<div className='other-info2'>{}{contact}</div>
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

	};

