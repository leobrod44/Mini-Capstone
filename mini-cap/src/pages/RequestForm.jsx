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
    const [error, setError] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        
        try {
            // Description is mandatory: Check if description is longer than 15 words
            const words = description.trim().split(/\s+/);
            if (words.length < 15) {
                throw new Error("Description must be at least 15 words long.");
            }

            // Call submitRequest function with form data
            console.log("The request was submitted successfully")
            const requestID = await submitRequest("condoID", subject, description);
            toast.success("Request submitted successfully"); // Show success popup
            setSubject("Administrative");
            setDescription("");
            setError(null);
        } catch (error) {
            setError(error.message);
            toast.error("Error submitting request"); // Show error popup
        } finally {
            setSubmitting(false); // Set submitting state back to false
        }
    };

    return (
        <div>
            <Header/>
            <div className="container">
                <h3 className="title"> Condo + UnitNumber</h3>
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
                    <div className="error">{error}</div>
                    <Link to="/condo-details" className="cancel-button">
                        {" "}
                        Cancel
                    </Link>
                    <button type="submit" className="submit-button" disabled={submitting}>
                        {submitting ? "Submitting..." : "Submit"}
                    </button>
                </form>
                <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
            </div>
            <BackArrowBtn/>
            <Footer/>
        </div>
    );
};

export default RequestForm;