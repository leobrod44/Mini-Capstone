import React from "react";
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
      <Modal.Body>{message}</Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={handleDeleteItem}>
          Delete Permanently
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

export default DeleteModal;
