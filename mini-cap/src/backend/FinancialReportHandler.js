import {doc, getDoc, getFirestore} from "firebase/firestore";
import {getPropertyData} from "./PropertyHandler";
import jsPDF from "jspdf";
import {calculateCondoFees, checkRentPaid} from "./FinancialHandler";
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

/**
 * Generates a financial report for a condominium, including details on rent payment and fees.
 * @param {string} condoID - The ID of the condominium.
 * @returns {Promise<void>} A promise that resolves when the financial report is generated.
 * @throws {Error} Throws an error if there was an issue generating the report.
 */
export async function generateFinancialReport(condoID) {
    try {
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
        const monthName = currentDate.toLocaleString('default', {month: 'long'});

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
    } catch (error) {
        throw error;
    }
}