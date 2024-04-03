import {collection, doc,addDoc, getDoc, getDocs, getFirestore, updateDoc} from "firebase/firestore";
import {initializeApp} from "firebase/app";
import {firebaseConfig} from "./FirebaseConfig";
import { getPropertyData, getUserCondos } from "./PropertyHandler";

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
        var docRef = await addDoc(monthCollectionRef, {
            date: reservation.date,
            startTime: reservation.startTime,
            endTime: reservation.endTime,
            userID: reservation.userID
        });
        var userRef = doc(db, "Users", reservation.userID);
        var userDoc = await getDoc(userRef);
        var data = userDoc.data()   
        var path = `Property/${reservation.propertyID}/Facilities/${reservation.facilityID}/${month}/${docRef.id}`
        if(data.hasOwnProperty("reservations")){
            await updateDoc(userRef, {
                reservations: [...userDoc.data().reservations,path]
            });
        }
        else{
            await updateDoc(userRef, {
                reservations: [path]
            });
        }
        
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
        monthCollection.forEach(async doc => {
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
export async function getFacilities(propertyID){
    try {
        const propertyRef = doc(db, "Property", propertyID);
        // Retrieve the collection of amenities from the property
        const facilityRef = collection(propertyRef, "Facilities");
        const facilityCollection = await getDocs(facilityRef);
        var facilities = [];
        facilityCollection.forEach(doc => {
            facilities.push(doc.data());
        });
        return facilities;
    } catch (e) {
        throw e;
    }
}

export async function getPropertiesJoinReservationAndFacilities(userID){
    try {
        //var userID = "leo@gmail.com"
        const userRef = doc(db, "Users", userID);
        const userDoc = await getDoc(userRef);
        const condos = await getUserCondos(userID);
        var propertiesArray = await Promise.all(condos.map(async (condo) => {
            var prop = await getPropertyData(condo.property);
            prop.id = condo.property;
            return prop;
        }));
        const uniquePropertyArray = Array.from(new Set(propertiesArray.map(JSON.stringify))).map(JSON.parse);
        const reservations = userDoc.data().reservations;
        var propertiesData = await Promise.all(uniquePropertyArray.map(async (property) => {
            property.facilities = await getFacilities(property.id);
            property.reservations = await Promise.all(reservations.map(async (reservation) => {
                if(reservation.split("/")[1]==property.id){
                    var docu = await getDoc(doc(db,reservation))
                    return docu.data();
                }
            }));
            property.reservations = property.reservations.filter(Boolean);
            return property;
        }));

        return propertiesData;

    } catch (e) {
        throw e;
    }
}
export async function getReservationUpdates(userID){
    try {
        const userRef = doc(db, "Users", userID);
        const userDoc = await getDoc(userRef);
        const reservations = userDoc.data().reservations;
        var reservationsData = await Promise.all(reservations.map(async (reservation) => {
            var docu = await getDoc(doc(db,reservation))
            if(docu.data().date >= new Date()){
                var facility = await getDoc(doc(db, "Facility", docu.data().facilityID));
                const newNotification = {
                    message: reservation.startTime + "-"+reservation.endTime,
                    path: "my-reservations",
                    date: reservation.date,
                    type: facility.data().type,
                    viewed: false
                }
                return newNotification;
            }
        }));
        return reservationsData;
    } catch (e) {
        throw e;
    }
}