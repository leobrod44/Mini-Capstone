import React from "react";
import PropTypes from "prop-types";
import { Modal, Button } from "react-bootstrap";
import "../styling/DeleteModal.css";

const DeleteModal = ({ show, handleClose, handleDeleteItem, message }) => {
    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header>
                <Modal.Title>Confirm Delete</Modal.Title>
                <button
                    type="button"
                    className="btn-close"
                    onClick={handleClose}
                ></button>
            </Modal.Header>
            <Modal.Body><p>{message}</p></Modal.Body>
            <Modal.Footer>
                <Button variant="danger" onClick={handleDeleteItem}>
                    Delete Account
                </Button>
                <Button
                    className="cancelButton"
                    variant="primary"
                    onClick={handleClose}
                >
                    Cancel
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

DeleteModal.propTypes = {
    show: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    handleDeleteItem: PropTypes.func.isRequired,
    message: PropTypes.string.isRequired,
};

export default DeleteModal;
