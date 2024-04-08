import React, { useState } from 'react';
import "../styling/CondoRequestsView.css";
import PropTypes from "prop-types";
import { MANAGEMENT_COMPANY } from "../backend/Constants";
import { updateRequest } from "../backend/RequestHandler";

/**
 * Represents a component for displaying condo request information.
 * @param {Object} props - The properties passed to the component.
 * @param {string} props.role - The role of the user viewing the request.
 * @param {string} props.type - The type of request.
 * @param {string} props.notes - Description for the request.
 * @param {number} props.step - The current step or status of the request.
 * @param {string} props.condoId - The ID of the condo related to the request.
 * @param {string} props.requestId - The ID of the request.
 * @returns {JSX.Element} The rendered CondoRequestsView component.
 */
const CondoRequestsView = ({ role, type, notes, step, condoId, requestId }) => {
    // State to manage the current step of the request
    const [currentStep, setCurrentStep] = useState(step);

    /**
     * Handles advancing the request status to the next step.
     * Calls the backend function to update the request status and updates the current step accordingly.
     * @returns {void}
     */
    const handleAdvance = async () => {
        // Ensure that the request is not already in the final step
        if (currentStep < 4) {
            // Call the backend function to update the request status
            let newStep = await updateRequest(condoId, requestId);
            console.log(newStep);
            // Update the current step with the new step returned from the backend
            setCurrentStep(newStep);

            //send notification
        }
    };

    return (
        <div className="Requests-info">
            <div className="other-info1">
                <div className="other-info2"><h5>Request Type:</h5></div>
                <p className="type">{type}</p>
            </div>
            <div className="other-info1">
                <div className="other-info2"><h5>Description:</h5></div>
                <p className="description">{notes}</p>
            </div>
            <div className="tracker-container">
                <div className="other-info2"><h5>Status:</h5></div>
                <div className="progressive-tracker">
                    {[1, 2, 3, 4].map((stepNumber) => (
                        <div className="tracker-element" key={stepNumber}>
                            <div className={`step ${currentStep === stepNumber ? 'active' : currentStep > stepNumber ? 'completed' : ''}`}></div>
                            <div className="step-label">{stepNumber === 1 ? 'Submitted' : stepNumber === 2 ? 'Received' : stepNumber === 3 ? 'In Progress' : 'Complete'}</div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="button-container">
                {role === MANAGEMENT_COMPANY && currentStep < 4 && (
                    <div>
                        <button className="tracker-button" onClick={handleAdvance} data-testid="advance-button">Advance</button>
                    </div>
                )}
            </div>
        </div>
    );
};

// PropTypes for type checking and validation
CondoRequestsView.propTypes = {
    role: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    notes: PropTypes.string.isRequired,
    step: PropTypes.number.isRequired,
    condoId: PropTypes.string.isRequired,
    requestId: PropTypes.string.isRequired
};

export default CondoRequestsView;
