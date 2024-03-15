import React, { useEffect, useState } from 'react';
import "../styling/CondoRequestsView.css";
import PropTypes from "prop-types";
import { MANAGEMENT_COMPANY } from "../backend/Constants";

const CondoRequestsView = ({ role, type, notes, step }) => {
    const [currentStep, setCurrentStep] = useState(step);

    useEffect(() => {
    }, []);

    const handleAdvance = () => {
        if (currentStep < 4)
            setCurrentStep(currentStep + 1);

        // updateRequest(condoId, requestId);
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
                    <div className="tracker-element">
                        <div className={`step ${currentStep === 1 ? 'active' : currentStep > 1 ? 'completed' : ''}`}></div>
                        <div className="step-label">Submitted</div>
                    </div>
                    <div className="tracker-element">
                        <div className={`step ${currentStep === 2 ? 'active' : currentStep > 2 ? 'completed' : ''}`}></div>
                        <div className="step-label">Received</div>
                    </div>
                    <div className="tracker-element">
                        <div className={`step ${currentStep === 3 ? 'active' : currentStep > 3 ? 'completed' : ''}`}></div>
                        <div className="step-label">In Progress</div>
                    </div>
                    <div className="tracker-element">
                        <div className={`step ${currentStep === 4 ? 'active' : currentStep > 4 ? 'completed' : ''}`}></div>
                        <div className="step-label">Complete</div>
                    </div>
                </div>
            </div>
            <div className="button-container">
                {role === MANAGEMENT_COMPANY && (
                    <div>
                        <button className="tracker-button" onClick={handleAdvance}>Advance</button>
                    </div>
                )}
            </div>
        </div>
    );
};

CondoRequestsView.propTypes = {
    role: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    notes: PropTypes.string.isRequired,
    step: PropTypes.number.isRequired
};

export default CondoRequestsView;
