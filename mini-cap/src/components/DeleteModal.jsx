import React from "react";
import PropTypes from "prop-types";
import { Modal, Button } from "react-bootstrap";
import "../styling/DeleteModal.css";

/**
 * Functional component representing a delete confirmation modal.
 * @param {Object} props - The props object containing show, handleClose, handleDeleteItem, and message.
 * @returns {JSX.Element} - The JSX for the delete modal.
 */

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
                <Button variant="danger" onClick={handleDeleteItem} data-testid="delete-account">
                    Delete
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

// PropTypes for type-checking props
DeleteModal.propTypes = {
    show: PropTypes.bool.isRequired, // Whether the modal should be shown
    handleClose: PropTypes.func.isRequired, // Function to handle closing the modal
    handleDeleteItem: PropTypes.func.isRequired,// Function to handle deleting the item
    message: PropTypes.string.isRequired,  // Message to be displayed in the modal body
};

export default DeleteModal;
