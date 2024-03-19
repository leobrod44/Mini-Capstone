import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PropTypes from 'prop-types';
import { submitRequest } from '../backend/RequestHandler';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "../styling/RequestForm.css";
import {getCondo} from "../backend/PropertyHandler";

const RequestForm = ({handleClickClose, condoInfo}) => {
    let { condoID } = useParams();
    const [subject, setSubject] = useState("");
    const [description, setDescription] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [notificationsActive, setNotificationsActive] = useState([]);
    const { propertyName, unitNumber } = condoInfo;

    useEffect(() => {
        const checkNotifications = () => {
          const activeNotifications = [];
          
          if (activeNotifications.length > 0) {
            setNotificationsActive(true);
          } else {
            setNotificationsActive(false);
          }
        };
    
        checkNotifications();
    
        const interval = setInterval(checkNotifications, 1000);
    
        return () => clearInterval(interval);
      }, []);

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
            const condo = await getCondo(condoID);
            const requestID = await submitRequest(condoID, subject, description);
        } catch (error) {
            toast.error("Request failed to submit for unexpected reasons")
            console.error(error);
        } finally {
            setSubject("");
            setDescription("");
            setSubmitting(false); // Set submitting state back to false
        }
        toast.success("Request submitted successfully", {
            onClose: handleClickClose
          });
        console.log("The request was submitted successfully")
    };

    return (
    <div className="Requestcontainer">
        <form className="form-box" onSubmit={handleSubmit}>
        <h2 className="titleform">Submit Request</h2>
        <br></br>
        <h3 className="Requesttitle"> {propertyName}: {unitNumber} </h3>
        <label className="dropdown" htmlFor="dropdown">Subject:</label>
        <select id="dropdown" value={subject} onChange={(e) => setSubject(e.target.value)}>
            <option value="1.1">Moving Request</option>
            <option value="1.2">Request Access</option>
            <option value="1.3">Report Violation</option>
            <option value="2.1">Report Damage in Common Area</option>
            <option value="2.2">Request Maintenance</option>
            <option value="1.4">General Question</option>
            <option value="3.1">Payment Invoice</option>
            <option value="3.2">Fee Inquiries</option>
            <option value="3.3">Insurance Coverage Details</option>
        </select>
        <label className="dropdown" htmlFor="description">Description:</label>
        <textarea id="description" name="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Enter request description here..."></textarea>
        <button type="button" className="cancel-button" onClick={handleClickClose} disabled={notificationsActive}>
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