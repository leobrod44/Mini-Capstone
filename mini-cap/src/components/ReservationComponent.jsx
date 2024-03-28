import React, {useEffect} from 'react';
import PropTypes from 'prop-types';
import "../styling/FacilityComponent.css";
import  { useState } from "react";
import DeleteModal from "../components/DeleteModal";

const ReservationComponent = () => {

    const [showDeleteModal, setShow] = useState(false);
    const handleClickDelete = () => {
        setShow(true);
    };
    const handleCloseDeleteModal = () => {
        setShow(false);
    };
    const handleDelete = async () => {
        console.log("Reservation Delete Called")
    };

    return (
        <div className="component-container">
            <link
                rel="stylesheet"
                href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css"
                integrity="sha384-rbsA2VBKQhggwzxH7pPCaAqO46MgnOM80zW1RWuH61DGLwZJEdK2Kadq2F9CUG65"
                crossOrigin="anonymous"
            />
            <div className="facility-title">Reservation Component</div>
            <div className="facility-description">Little Description</div>
            <div className="facility-description">Date and Time</div>
            <button className="close-button" onClick={() => handleClickDelete()}>×</button>
            <DeleteModal
                show={showDeleteModal}
                handleClose={handleCloseDeleteModal}
                message="Are you sure you want to delete this Reservation?"
                handleDeleteItem={handleDelete}
            />
        </div>
        
    );
};


export default ReservationComponent;