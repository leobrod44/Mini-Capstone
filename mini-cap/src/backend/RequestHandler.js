import { initializeApp } from "firebase/app";
import {
    doc,
  addDoc,
  getDocs,
  collection,
  getFirestore,
  getDoc,
  updateDoc
} from "firebase/firestore";
import { firebaseConfig } from "./FirebaseConfig";
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const sampleRequest = {
    "requestID": "1",
    "condoID": "1",
    "type": "Financial",
    "notes": "this is a sample",
    "step": 1,
    "viewed": false,
  }
  import { getCondo } from "./PropertyHandler";
import { ADMINISTRATIVE_STEPS, FINANCIAL_STEPS, TYPES } from "./Constants";
import { cleanData } from "./DataCleaner";

//Sprint 3

//Provide: condo id, request type, notes of request
//Returns: nothing
export async function submitRequest(condoID, type, notes) {
    if (!TYPES.includes(type)) {
        console.error("Invalid request type");
        return;
    }
    try {
        const docRef = await addDoc(collection(doc(db, 'Condo', condoID), 'Requests'), {
            type: type,
            notes: notes,
            step: 0,
            viewed: false,
            condoID: condoID,
            requestID: null 
        });
        const requestID = docRef.id;

        await updateDoc(docRef, { requestID: requestID });
        try{
            await assignWorker(requestID);
            return requestID;
        }
        catch(e){
            console.error("Error assigning worker: ", e);
        }
        
    } catch(e) {
        console.error("Error submitting request: ", e);
    }
}

//Provide: condo id
//Returns: array of requests associated with the condo
export async function getRequests(condoID){
    try {
        const condoRef = doc(db, 'Condo', condoID);
        const requestCollection = collection(condoRef, 'Requests');
        const requestSnapshot = await getDocs(requestCollection);
        var requests = [];

        await Promise.all(
            requestSnapshot.docs.map(async (doc) => {
                var data = doc.data();
                requests.push(data);
            }));
        return requests;
    } catch(e) {
        console.error("Error getting requests: ", e);
    }
}

//Provide: condo id and request id (all request updates will be done backend)
//Returns: nothing
export async function updateRequest(condoID, requestID) {
    try {
        const condoRef = doc(db, 'Condo', condoID);
        const requestRef = doc(collection(condoRef, 'Requests'), requestID);
        const requestDoc = await getDoc(requestRef);
        if (!requestDoc.exists()) {
            console.error("Request does not exist");
            return;
        }
        const requestData = requestDoc.data();
        requestData.step += 1;
        var stepType
        if(requestData.type === "Administrative"){
            stepType = ADMINISTRATIVE_STEPS;
        }
        else if(requestData.type === "Financial"){
            stepType = FINANCIAL_STEPS;
        }
        else if(requestData.type === "Maintenance"){
            stepType = MAINTENANCE_STEPS;
        }
        else{
            console.error("Invalid request type");
        }
        if(requestData.step >= stepType.length){
            await updateDoc(requestRef, requestData);
            return "Completed"
        }
        else{
            await updateDoc(requestRef, requestData);
            return stepType[requestData.step];
        }
    } catch (e) {
        console.error("Error updating request: ", e);
    }
}


//BACKEND ONLY
export async function assignWorker(requestID) {

}

//BACKEND ONLY
export async function getAssignedWorker(requestID) {

}

//SPRINT 4

//Provide: userID
//Returns: array of new notifications
export async function getNotifications(userID){

}

//Provide: userID, requestID
//Returns: nothing
export async function setNotificationViewed(userID, notification){

}
