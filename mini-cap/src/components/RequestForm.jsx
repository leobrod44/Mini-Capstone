import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { submitRequest } from '../backend/RequestHandler';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "../styling/RequestForm.css";

const RequestForm = ({handleClickClose}) => {
    const [subject, setSubject] = useState("Administrative");
    const [description, setDescription] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            if (
                !subject ||
                !description
              ) {
                toast.error("Please fill all fields");
                return;
              }
            const requestID = await submitRequest("condoID", subject, description);
        } catch (error) {
            toast.error("Request failed to submit for unexpected reasons")
            console.error(error);
        } finally {
            setSubject("Administrative");
            setDescription("");
            setSubmitting(false); // Set submitting state back to false
        }
        toast.success("Request submitted successfully"); // Show success popup
        console.log("The request was submitted successfully")
    };

    return (
    <div className="Requestcontainer">
        <form className="form-box" onSubmit={handleSubmit}>
        <h2 className="titleform">Submit Request</h2>
        <h3 className="Requesttitle"> Condo + UnitNumber</h3>
        <label className="dropdown" htmlFor="dropdown">Subject:</label>
        <select id="dropdown" value={subject} onChange={(e) => setSubject(e.target.value)}>
            <option value="1">Moving Request</option>
            <option value="2">Request Access</option>
            <option value="3">Report Violation</option>
            <option value="4">Report Damage in Common Area</option>
            <option value="5">Request Maintenance</option>
            <option value="6">General Question</option>
        </select>
        <label className="dropdown" htmlFor="description">Description:</label>
        <textarea id="description" name="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Enter request description here..."></textarea>
        <button type="button" className="cancel-button" onClick={handleClickClose}>
            Cancel
        </button>
        <button type="submit" className="submit-button" disabled={submitting}>
            {submitting ? "Submitting..." : "Submit"}
        </button>
        </form>
        <ToastContainer position="top-right" autoClose={3000}/>
    </div>
    );
};

RequestForm.propTypes = {
    handleClickClose: PropTypes.func.isRequired,
};

export default RequestForm;