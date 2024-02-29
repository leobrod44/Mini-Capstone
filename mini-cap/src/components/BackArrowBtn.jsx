import React from "react";
import { useNavigate } from "react-router-dom";
import "../styling/BackArrowBtn.css";

const BackArrowBtn = () => {
    const navigate = useNavigate();

    const goBack = () => {
        navigate(-1); // This function will navigate to the previous page
    };

    return (
        <div className="floating_button1" role="button" onClick={goBack} data-testid="back-arrow-btn" >
            <div className="button_circle1">
                <span className="back_arrow1">&larr; </span>
            </div>
        </div>
    );
};

export default BackArrowBtn;
