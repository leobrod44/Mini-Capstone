import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { submitRequest } from '../backend/RequestHandler';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "../styling/RequestForm.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import BackArrowBtn from '../components/BackArrowBtn';

const RequestForm = () => {
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
        <div>
            <Header/>
            <div className="Requestcontainer">
                <h3 className="Requesttitle"> Condo + UnitNumber</h3>
                <form className="form-box" onSubmit={handleSubmit}>
                    <h2 className="titleform">Submit Request</h2>
                    <label className="dropdown" htmlFor="dropdown">Subject:</label>
                    <select id="dropdown" value={subject} onChange={(e) => setSubject(e.target.value)}>
                        <option value="Administrative">Administrative</option>
                        <option value="Financial">Financial</option>
                        <option value="Maintenance">Maintenance</option>
                    </select>
                    <label className="dropdown" htmlFor="description">Description:</label>
                    <textarea id="description" name="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Enter request description here..."></textarea>
                    <Link to="/condo-details" className="cancel-button">
                        {" "}
                        Cancel
                    </Link>
                    <button type="submit" className="submit-button" disabled={submitting}>
                        {submitting ? "Submitting..." : "Submit"}
                    </button>
                </form>
                <ToastContainer position="top-right" autoClose={3000}/>
            </div>
            <BackArrowBtn/>
            <Footer/>
        </div>
    );
};

export default RequestForm;