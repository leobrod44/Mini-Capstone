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
        throw new Error("Error paying rent: " + error);
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
            if (condoDocSnap.data().hasOwnProperty("rentPaid"))
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