import {collection, doc,addDoc, getDoc, getDocs, getFirestore, updateDoc} from "firebase/firestore";
import {initializeApp} from "firebase/app";
import {firebaseConfig} from "./FirebaseConfig";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


export async function addFacility(facility) {

    try{
        const propertyRef = doc(db, "Property", facility.propertyID);
        // Retrieve the collection of amenities from the property
        const amenitiesColl = collection(propertyRef, "Facilities");
        // Add a new document to the amenities collection
        var dailyAvailabilities;
        var blockSize;
        switch(facility.title) {
            case "Gym":
                blockSize = 1
                break;
            case "Pool":
                blockSize = 2
                break;
            case "Spa":
                blockSize = 3
                break;
        }
        facility.dailyAvailabilities = [1]*24/blockSize;
        facility.blockSize = blockSize;
        await addDoc(amenitiesColl, {
            propertyID: facility.propertyID,
            type: facility.title,
            description: facility.description,
            dailyAvailabilities: facility.dailyAvailabilities,
            blockSize: facility.blockSize
        });
    } catch (e) {
        throw e;
    }
  
}

export async function makeReservation(reservation){
    try{
        const userRef = doc(db, "Users", reservation.userID);
        const reservationRef = collection(userRef, "Reservations");
        const propertyRef = doc(userRef, "Properties", reservation.propertyID);
        const facilityRef = doc(propertyRef, "Facilities", reservation.facilityID);

        await addDoc(reservationRef, reservation);
    } catch (e) {
        throw e;
    }
}

