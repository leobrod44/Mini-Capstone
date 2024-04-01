import { getFirestore } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import {
    getDocs,
    collection,
    doc,
    addDoc,
    getDoc,
    updateDoc,
    deleteDoc,
    arrayUnion,
    query,
    where,
} from "firebase/firestore";
import { cleanData, sortArray } from "./DataCleaner";
import store from "storejs";
import emailjs from "@emailjs/browser";
import { firebaseConfig } from "./FirebaseConfig";
import { setPictureWithID, getPropertyPicture } from "./ImageHandler";
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