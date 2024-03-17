import React, { useEffect, useState } from 'react';
import "../styling/FinancialDetails.css";
import { FaCheck, FaTimes } from 'react-icons/fa'; // Import icons from react-icons library
import { useParams } from "react-router-dom";
import { MANAGEMENT_COMPANY } from "../backend/Constants";

const FinancialDetails = () => {
    let { condoId } = useParams();
    const [role, setTheRole] = useState("");
    const [condoDetails, setCondoDetails] = useState(false);
    const [isRentPaid, setIsRentPaid] = useState(false); // State to track whether rent is paid
    const [fDetails, setFDetails] = useState({
        BasePrice: 0,
        ParkingPrice: 0,
        LockerPrice: 0,
        AdditionalPrice: 0,
        TotalPrice: 0
    });

    useEffect(() => {
        const fetchCondo = async () => {
            try {
                setTheRole(store("role"));
                const condo = await getCondo(condoId);
                setCondoDetails(condo);
            } catch (err) {
                console.error(err);
            }
        };
        fetchCondo();

    }, []);

    const {
        status
    } = condoDetails;

    const toggleRentPaid = () => {
        setIsRentPaid(!isRentPaid);
    };

    useEffect(() => {
        const fetchingFinanceDetails = async () => {
            try {
                const financeDetails = await getFinanceDetails();
                setFDetails(financeDetails);
            } catch (error) {
                console.error(error);
            }
        };
        fetchingFinanceDetails();
    }, []);

    const setRentPaidStatus = async () => {
        try {
            const rentPaid = await checkRentPaid();
            setIsRentPaid(rentPaid);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        setRentPaidStatus();
    }, []);

    const {
        BasePrice,
        ParkingPrice,
        LockerPrice,
        AdditionalPrice,
        TotalPrice
    } = fDetails;

    const getRentPaymentStatus = () => {
        return isRentPaid ? "Paid" : "Unpaid";
    };

    return (
        <div className="Financial-info">
            <div className="other-info1">
                <div className="other-info2"><h5>Base Price:</h5></div>
                <div className="other-info2">{BasePrice} $</div>
            </div>
            <div className="other-info1">
                <div className="other-info2"><h5>Parking Price:</h5></div>
                <div className="other-info2">{ParkingPrice} $</div>
            </div>
            <div className="other-info1">
                <div className="other-info2"><h5>Locker Price:</h5></div>
                <div className="other-info2">{LockerPrice} $</div>
            </div>
            <div className="other-info1">
                <div className="other-info2"><h5>Additional Fees:</h5></div>
                <div className="other-info2">{AdditionalPrice} $</div>
            </div>
            <div className="other-info1">
                <div className="other-info2"><h5>Total Unit Price:</h5></div>
                <div className="other-info2">{TotalPrice} $</div>
            </div>
            <br></br>
            <div className="other-info1">
                <span className="FinanceText">Rent Paid: </span>
                <span>{getRentPaymentStatus()}</span>
                {role !== MANAGEMENT_COMPANY && (
                    <>
                        {isRentPaid ? <FaCheck className="green-check" /> : <FaTimes className="red-cross" />}
                    </>
                )}
                {role == MANAGEMENT_COMPANY && status !== "Vacant" && (
                    <>
                        {isRentPaid ? <FaCheck className="green-check" /> : <FaTimes className="red-cross" />}
                    </>
                )}
            </div>
            <button onClick={toggleRentPaid}>Toggle Rent Paid</button>
        </div>
    );
};

export default FinancialDetails;