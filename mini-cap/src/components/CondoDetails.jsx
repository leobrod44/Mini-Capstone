import React from 'react';
import "../styling/CondoDetails.css"
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Import the FontAwesome library
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { Link } from "react-router-dom";

const CondoDetails = ({ name, profilePicture, address, parkingCount, lockerCount, unitNumber, price, size, squareFeet, pricesf, status, contact, currentPrice, rentDueDate }) => {

    CondoDetails.propTypes = {
        name: PropTypes.string.isRequired,
        profilePicture: PropTypes.string,
        address: PropTypes.string.isRequired,
        unitCount: PropTypes.string.isRequired,
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

    const condoStatus = 'vacant';
    const role = 'company';
    
    return (
        <div className="title_container">
				{/* <h3 className="DB_title"> {"[Condo Name]"} </h3> */}
                
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
                                            <button className="sendkey-button">Send Key</button>
                                        </>)}
                                    </div>
                                    </>)}
                            {condoStatus === "rented" && role === 'company' && ( 
                                    <>
                                        <div className={`user-tag rented`}>{"Rented"}{status}</div>
                                        
                                    </>)}
                            </div>
                            {/* <div className='condo-name pic-and-num'>
                                <h2>{"[Condo Name]"}{name}</h2>
                                <h2>{"Unit Number:"}{" [text]"}{unitNumber}</h2>
                            </div> */}
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
                                        <button className="edit-button">Edit</button>
                                        <button className="delete-button">Delete</button>
                                    </>)}
                            </div>
                        
                        
                    </div>
                </div>
		</div>

        
    );
    
  };


  
  
  export default CondoDetails;