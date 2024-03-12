import React, { useEffect, useState } from 'react';
import "../styling/FinancialDetails.css";
import { FaCheck, FaTimes } from 'react-icons/fa'; // Import icons from react-icons library

const FinancialDetails = () => {
    {/* TO DO is RentPaid */}
    const [isRentPaid, setIsRentPaid] = useState(false); // State to track whether rent is paid

    const toggleRentPaid = () => {
        setIsRentPaid(!isRentPaid);
    };

    {/* TO DO */}
    useEffect(() => {
        const getFinanceDetails = async () => {
            try{
                const getFinanceDetails = await getFinanceDetails ()
            }catch (error) {
                console.error(error);
            }
        };
        getFinanceDetails();
    })

    return (
        <div className="Financial-info">
            <div className="other-info1">
                <div className="other-info2"><h5>Base Price:</h5></div>
            </div>
            <div className="other-info1">
                <div className="other-info2"><h5>Parking Price:</h5></div>
            </div>
            <div className="other-info1">
                <div className="other-info2"><h5>Locker Price:</h5></div>
            </div>
            <div className="other-info1">
                <div className="other-info2"><h5>Additional Fees:</h5></div>
            </div>
            <div className="other-info1">
                <div className="other-info2"><h5>Total Unit Price:</h5></div>
            </div>
            <br></br>
            <div className="other-info1">
                <span className="FinanceText">Rent Paid:</span>
                {isRentPaid ? <FaCheck className="green-check" /> : <FaTimes className="red-cross" />}
            </div>
            {/* REMOVE ~ Toggle button to switch between rent paid and not paid */}
            <button onClick={toggleRentPaid}>Toggle Rent Paid</button>
        </div>
    );
};

export default FinancialDetails;