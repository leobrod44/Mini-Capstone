import React from 'react';
import { Link } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import "../styling/RequestForm.css";
import Header from "../components/Header";
import Footer from "../components/Footer";

const RequestForm = () => {
    return (
        <div>
            <Header/>
            <div className="container">
                <h3 className="title"> Condo + UnitNumber</h3>
                <form className="form-box">
                    <h2 className="titleform">Submit Request</h2>
                    <label className="dropdown" htmlFor="dropdown">Subject:</label>
                    <select id="dropdown">
                        <option value="MovingRequest">Moving Request</option>
                        <option value="RequestAccess">Request Access</option>
                        <option value="ReportViolation">Report Violation</option>
                        <option value="DamageCommonArea">Report Damage in Common Area</option>
                        <option value="RequestMaintenance">Request Maintenance</option>
                        <option value="GeneralQuestion">General Question</option>
                    </select>
                    <label className="dropdown" htmlFor="description">Description:</label>
                    <textarea id="description" name="description" placeholder="Enter request description here..."></textarea>
                    <Link to="/condo-details" className="cancel-button">
                        {" "}
                        Cancel
                    </Link>
                    <button className="submit-button">
                        Submit
                    </button>
                </form>
            </div>
            <Footer/>
        </div>
    );
};

export default RequestForm;