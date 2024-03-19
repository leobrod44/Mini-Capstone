import React, { useEffect, useState } from 'react';
import "../styling/FinancialDetails.css";
import { FaCheck, FaTimes } from 'react-icons/fa'; // Import icons from react-icons library
import { useParams } from "react-router-dom";
import { MANAGEMENT_COMPANY } from "../backend/Constants";
import { getFinanceDetails } from '../backend/PropertyHandler';
import { getCondo } from '../backend/PropertyHandler';
import { checkRentPaid } from '../backend/PropertyHandler';
import store from "storejs";

/**
 * Represents a component for displaying financial details of a condo.
 * Retrieves the condo ID from the URL parameters.
 * Manages condo details availability, rent payment status,
 * and financial details such as base price, parking price, locker price, additional price, and total price.
 * @returns {JSX.Element} The rendered FinancialDetails component.
 **/
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


/**
 * Fetches condo details and sets the user role state using local storage.
 * Retrieves the condo ID from the URL parameters.
 * Executes once when the component mounts.
 * @returns {void}
 **/
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

    /**
     * Destructures the "status" property from the condoDetails object.
     * This property presumably represents the status of the condo, such as "Rented", "Owned" and "vacant"
     * @type {string} status - The status of the condo.
     **/
    const {
        status
    } = condoDetails;


    /**
     * Temporarily toggles the rent payment status state between true and false.
     * If rent is currently paid, it sets the state to unpaid, and vice versa.
     * @returns {void}
     **/
    const toggleRentPaid = () => {
        setIsRentPaid(!isRentPaid);
    };

    /**
     * Fetches financial details asynchronously and updates the financial details state.
     * Executes once when the component mounts.
     * @returns {void}
     **/
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

    /**
    * Sets the rent payment status state based on the result of an asynchronous rent payment check.
    * Fetches the rent payment status and updates the isRentPaid state accordingly.
    * @returns {void}
    **/
    const setRentPaidStatus = async () => {
        try {
            const rentPaid = await checkRentPaid();
            setIsRentPaid(rentPaid);
        } catch (error) {
            console.error(error);
        }
    };

    /**
    * Calls the setRentPaidStatus function once when the component mounts.
    * This useEffect hook is used to initiate the process of checking the rent payment status.
    * @returns {void}
    **/
    useEffect(() => {
        setRentPaidStatus();
    }, []);

    /**
    * Destructures financial details properties from the fDetails object.
    * These properties include BasePrice, ParkingPrice, LockerPrice, AdditionalPrice, and TotalPrice.
    * @type {number} BasePrice - The base price of the condo otherwise known as rent.
    * @type {number} ParkingPrice - The price for parking spot/spots associated with the condo.
    * @type {number} LockerPrice - The price for locker/lockers associated with the condo.
     * @type {number} AdditionalPrice - Any additional charges associated with requests.
    * @type {number} TotalPrice - The total price calculated based on all the financial details.
    **/
    const {
        BasePrice,
        ParkingPrice,
        LockerPrice,
        AdditionalPrice,
        TotalPrice
    } = fDetails;

    /**
    * Retrieves the rent payment status.
    * Returns "Paid" if rent is paid, otherwise returns "Unpaid".
    * @returns {string} The rent payment status.
    **/
    const getRentPaymentStatus = () => {
        return isRentPaid ? "Paid" : "Unpaid";
    };

    return (
        <div className="Financial-info">
            <div className="other-info1">
                <div className="other-info2"><h5>Base Price:</h5></div>
                <div className="textDetail">{BasePrice} $</div>
            </div>
            <div className="other-info1">
                <div className="other-info2"><h5>Parking Price:</h5></div>
                <div className="textDetail">{ParkingPrice} $</div>
            </div>
            <div className="other-info1">
                <div className="other-info2"><h5>Locker Price:</h5></div>
                <div className="textDetail">{LockerPrice} $</div>
            </div>
            <div className="other-info1">
                <div className="other-info2"><h5>Additional Fees:</h5></div>
                <div className="textDetail">{AdditionalPrice} $</div>
            </div>
            <div className="other-info1">
                <div className="other-info2"><h5>Total Unit Price:</h5></div>
                <div className="textDetail">{TotalPrice} $</div>
            </div>
            <br></br>
            <div className="other-info1">
                <span className="FinanceText">Rent Paid: </span>
                <span className="textDetail">{getRentPaymentStatus()}</span>
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