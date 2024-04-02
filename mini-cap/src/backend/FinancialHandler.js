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
import {calculateCondoFees, getPropertyData} from "./PropertyHandler";


export async function generateFinancialReport(condoID) {
    try{
        //pull from main after financialhandler changes (calculateCondoFees changed files)
        const financialDetails = await calculateCondoFees(condoID);
        //const rentPaid = await checkRentPaid(condoID);

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
        //********* a changer pour rentPaid
        const rentPaidString = monthName.toString() + "'s rent paid: " + (false ? 'Yes' : 'No');
        const amountString = false ? 'paid: ' : 'to be paid: ';
        document.text(rentPaidString, 10, 55);
        document.text('Total amount ' + amountString + financialDetails['totalPrice'] + '$', 10, 65);
        document.text('- Rent amount ' + amountString + financialDetails['rent'] + '$', 15, 75);
        document.text('- Amenities amount ' + amountString + financialDetails['amenitiesPrice'] + '$', 15, 85);

        document.save(`${year}-${month}-${day}_` + propertyData['propertyName'] + "_" + condoData.unitNumber + "_Financial_Report.pdf");
    }catch (error){
        throw error;
    }
}