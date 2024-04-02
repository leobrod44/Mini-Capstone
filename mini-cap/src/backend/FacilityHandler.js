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
        var docRef = await addDoc(amenitiesColl, {
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
        var month = reservation.month;
        const propertyRef = doc(db, "Property", reservation.propertyID);
        // Retrieve the collection of amenities from the property
        const facilityRef = collection(propertyRef, "Facilities");
        const facility = doc(facilityRef, reservation.facilityID);
        const monthCollectionRef = collection(facility, month+"");
        // Add a placeholder document in the month collection if needed
        await addDoc(monthCollectionRef, {
            date: reservation.date,
            startTime: reservation.startTime,
            endTime: reservation.endTime,
            userID: reservation.userID
        });
    } catch (e) {
        throw e;
    }
}
export async function getMonthlyReservations(propertyID,facilityID,month){
    try {
        const propertyRef = doc(db, "Property", propertyID);
        // Retrieve the collection of amenities from the property
        const facilityRef = collection(propertyRef, "Facilities");
        const facility = doc(facilityRef, facilityID);
        const monthCollectionRef = collection(facility, month+"");
        const monthCollection = await getDocs(monthCollectionRef);
        var reservations = {};
        monthCollection.forEach(doc => {
            if(reservations.hasOwnProperty(doc.data().date)){
                reservations[doc.data().date].push(doc.data().startTime);
            }
            else{
                reservations[doc.data().date] = [doc.data().startTime];
            }
        });
        
        return reservations;
    } catch (e) {
        throw e;
    }

}

