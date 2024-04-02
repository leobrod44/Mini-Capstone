import React from "react";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import BackArrowBtn from "../components/BackArrowBtn.jsx";
import { useState } from 'react';
import { MdExpandMore, MdExpandLess } from 'react-icons/md';
import Pagination from "../components/Pagination";
import "../styling/Pagination.css";
import "../styling/Reservations.css";
import ReservationComponent from "../components/ReservationComponent.jsx";
import FacilityComponent from "../components/FacilityComponent.jsx"

const Reservations = () => {
    const [visibleFacilities, setVisibleFacilities] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const condosPerPage = 4; // Adjust as needed
    const condos = [
        {
            id: 1,
            unitNumber: '101',
            facilities: [
                { id: 1, name: 'Gym' },
                { id: 2, name: 'Swimming Pool' },
                // Other facilities...
            ],
            reservations: [
                { id: 1, date: '2023-04-21', description: 'Pool Party' },
                { id: 2, date: '2023-04-22', description: 'Private Gym Session' },
                // other reservations...
              ],
        },
        {
            id: 2,
            unitNumber: '102',
            facilities: [
                { id: 3, name: 'Sauna' },
                { id: 4, name: 'BBQ Pit' },
                // Other facilities...
            ],
            reservations: [
               
                // no reserv
              ],
        },
        // More condos...
        
    ];

    const toggleFacilities = (id) => {
        setVisibleFacilities(prevState => ({
            ...prevState,
            [id]: !prevState[id],
        }));
    };
   
    const indexOfLastCondo = currentPage * condosPerPage;
    const indexOfFirstCondo = indexOfLastCondo - condosPerPage;
  
    const condosToDisplayPaginated = condos.slice(
      indexOfFirstCondo,
      indexOfLastCondo
    );
  
    return (
        <div>
            <Header />
            <BackArrowBtn />
            < div className="reservations-page-container">
            <h2 style={{ textAlign: 'center', fontSize: '32px', margin: '20px 0' }}>My Reservations</h2>


            {condosToDisplayPaginated.map((condo, index) => ( 

               <div key={condo.id} className="reserve-container">
              <h3 style={{ marginBottom: '20px' }}>Unit Number: {condo.unitNumber}</h3>
              <h5>Upcoming Reservations</h5>
              <div className="reservation">
              {condo.reservations && condo.reservations.length > 0 ? (
                        <ReservationComponent reservations={condo.reservations} />
                    ) : (
                        <p>No upcoming reservations.</p> // Display this message if there are no reservations
                    )}

                </div>
                    <div className="facilities-header">
                        
                    <h5 style={{ marginRight: '20px' }}>Show Condo Facilities</h5>
                        <button
                            className="facilities-button"
                            onClick={() => toggleFacilities(condo.id)}
                        >
                            {visibleFacilities[condo.id] ? <MdExpandLess /> : <MdExpandMore />}
                        </button>
                    </div>
                    
                    {visibleFacilities[condo.id] && (
                        <FacilityComponent facilities={condo.facilities}  />
                    )}
                    {index < condos.length - 1 && <hr />}
                </div>
               
            ))}
            <div className="pagination-container" style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                <Pagination
                    itemsPerPage={condosPerPage}
                    totalItems={condos.length}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                />
            </div>
            </div>
            <Footer />
        </div>
    );

};
    

export default Reservations;