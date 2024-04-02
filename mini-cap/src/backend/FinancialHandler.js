import {collection, doc, getDoc, getDocs, getFirestore, updateDoc} from "firebase/firestore";
import {initializeApp} from "firebase/app";
import emailjs from "@emailjs/browser";
import {firebaseConfig} from "./FirebaseConfig";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const condoPictureRef = "condoPictures/";
const propertyPictureRef = "propertyPictures/";
emailjs.init({
    publicKey: "Gw4N_w4eDx939VEBl",
});
import { jsPDF } from "jspdf";
import {getPropertyData} from "./PropertyHandler";


/**
 * Updates the rentPaid field of a condominium to mark that rent has been paid.
 * @param {string} condoID - The ID of the condominium.
 * @returns {Promise<void>} A promise that resolves when the rent has been successfully marked as paid.
 * @throws {Error} Throws an error if there was an issue updating the rentPaid field.
 */
export async function payRent(condoID) {
    try {
        const docRef = doc(db, "Condo", condoID);
        // Fetch the snapshot of the condo document

        await updateDoc(docRef, {
            rentPaid: true,
        });

    } catch (error) {
        // If an error occurs during the process, throw an error with a descriptive message
        throw new Error(error);
    }
}

/**
 * Checks whether rent has been paid for a condominium.
 * @param {string} condoID - The ID of the condominium.
 * @returns {Promise<boolean>} A promise that resolves with a boolean indicating whether rent has been paid.
 * @throws {Error} Throws an error if there was an issue checking the rentPaid field.
 */
export async function checkRentPaid(condoID) {
    try {
        // Get document reference for the specified condo ID
        const condoDocRef = doc(db, "Condo", condoID);
        // Fetch document snapshot
        const condoDocSnap = await getDoc(condoDocRef);

        // Check if condo document exists
        if (condoDocSnap.exists) {
            if (!condoDocSnap.data().hasOwnProperty("rentPaid"))
                return false;
            else
                return condoDocSnap.data().rentPaid;
        } else {
            throw new Error("Condo doc not found in checkRentPaid");
        }
    } catch (error) {
        // Throw error to propagate it up the call stack
        throw error;
    }
}

/**
 * Calculates the fees for a condominium based on its amenities and status (rented or owned).
 * Will return only monthly fees for a renter, and monthly and total fees for an owner
 * @param {string} condoId - The ID of the condominium.
 * @returns {Promise<{monthlyFees: number, totalFees: number}|null>} A promise that resolves with an object containing the monthly fees and total fees if successful, or null if there was an error.
 */
export async function calculateCondoFees(condoId) {
    try {
        // Retrieve the document reference for the specified condo ID from the "Condo" collection
        const docRef = doc(db, "Condo", condoId);
        // Fetch the snapshot of the condo document
        const docSnap = await getDoc(docRef);

        // Extract condo data from the snapshot
        const condoData = docSnap.data();

        let returnVals = {};
        returnVals.rent = parseFloat(condoData.unitPrice);
        returnVals.lockerPrice = 0;
        returnVals.parkingPrice = 0;
        //additional fees price is 0 for now
        returnVals.additionalFees = 0;
        let amenitiesPrice = 0;
        // Check if the condo document exists
        if (docSnap.exists) {
            // Retrieve the document reference for the property associated with the condo
            const propertyDocRef = doc(db, "Property", condoData.property);
            // Fetch the snapshot of the property document
            const propertyDoc = await getDoc(propertyDocRef);

            // Check if the property document exists
            if (propertyDoc.exists) {
                const amenitiesCollection = collection(propertyDocRef, "Amenities");
                const amenitiesSnapshot = await getDocs(amenitiesCollection);

                //Get all amenities for the condo and add their price
                amenitiesSnapshot.docs.map(async (doc) => {
                    let tempData = doc.data();
                    if (tempData.condo == condoId) {
                        if (tempData.type == "Locker")
                            returnVals.lockerPrice = parseFloat(tempData.price);
                        else
                            returnVals.parkingPrice = parseFloat(tempData.price);
                        amenitiesPrice += parseFloat(tempData.price);
                    }
                });
            } else {
                // If the property document does not exist, return null
                return null;
            }

            let totalPrice = amenitiesPrice + returnVals.rent + returnVals.additionalFees;
            returnVals.totalPrice = totalPrice;
            returnVals.amenitiesPrice = amenitiesPrice;

            return returnVals;

        } else {
            // If the condo document does not exist, log a message and return null
            return null;
        }
    } catch (error) {
        // Rethrow the error to propagate it up the call stack
        throw error;
    }
}

/**
 * Generates a financial report for a condominium, including details on rent payment and fees.
 * @param {string} condoID - The ID of the condominium.
 * @returns {Promise<void>} A promise that resolves when the financial report is generated.
 * @throws {Error} Throws an error if there was an issue generating the report.
 */
export async function generateFinancialReport(condoID) {
    try{
        const financialDetails = await calculateCondoFees(condoID);
        const rentPaid = await checkRentPaid(condoID);

        const docRef = doc(db, "Condo", condoID);
        // Fetch the snapshot of the condo document
        const docSnap = await getDoc(docRef);

        // Extract condo data from the snapshot
        const condoData = docSnap.data();
        const propertyData = await getPropertyData(condoData.property);

        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Months are zero-based
        const day = String(currentDate.getDate()).padStart(2, '0');
        const formattedDate = `${year}/${month}/${day}`;
        const monthName = currentDate.toLocaleString('default', { month: 'long' });

        const document = new jsPDF();

        // Header
        document.setFontSize(18);
        document.text(propertyData['propertyName'] + " Unit " + condoData.unitNumber + " Financial Report", 10, 20);
        document.setFontSize(14);
        document.text(propertyData['address'], 10, 30);
        document.setFontSize(14);
        document.text('Generated on: ' + formattedDate, 10, 40);

        // Line
        document.setLineWidth(0.5);
        document.line(10, 45, 200, 45);

        // Data
        document.setFontSize(12);
        const rentPaidString = monthName.toString() + "'s rent paid: " + (rentPaid ? 'Yes' : 'No');
        const amountString = rentPaid ? 'paid: ' : 'to be paid: ';
        document.text(rentPaidString, 10, 55);
        document.text('Total amount ' + amountString + financialDetails['totalPrice'] + '$', 10, 65);
        document.text('- Rent amount ' + amountString + financialDetails['rent'] + '$', 15, 75);
        document.text('- Amenities amount ' + amountString + financialDetails['amenitiesPrice'] + '$', 15, 85);

        document.save(`${year}-${month}-${day}_` + propertyData['propertyName'] + "_" + condoData.unitNumber + "_Financial_Report.pdf");
    }catch (error){
        throw error;
    }
}