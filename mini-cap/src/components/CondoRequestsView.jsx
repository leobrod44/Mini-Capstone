import React, { useEffect, useState } from 'react';
import "../styling/CondoRequestsView.css";
import PropTypes from "prop-types";
import { MANAGEMENT_COMPANY } from "../backend/Constants";

const CondoRequestsView = ({ role }) => {
    const [currentStep, setCurrentStep] = useState(1);

    useEffect(() => {
    }, []);

    const handleAdvance = () => {
        if (currentStep < 4)
            setCurrentStep(currentStep + 1);

        // updateRequest(condoId, requestId);
    };

    const handlePrevious = () => {
        if (currentStep > 1)
            setCurrentStep(currentStep - 1);
    };

    return (
        <div className="Requests-info">
            <div className="other-info1">
                <div className="other-info2"><h5>Request Type</h5></div>
                <p>**Add type here**</p>
            </div>
            <div className="other-info1">
                <div className="other-info2"><h5>Description</h5></div>
                <p>**Add description here**</p>
            </div>
            <div className="tracker-container">
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
                        <button className="tracker-button" onClick={handlePrevious}>Previous</button>
                        <button className="tracker-button" onClick={handleAdvance}>Advance</button>
                    </div>
                )}
            </div>
        </div>
    );
};

CondoRequestsView.propTypes = {
    role: PropTypes.string.isRequired,
};

export default CondoRequestsView;
