import { initializeApp } from "firebase/app";
import {
  addDoc,
  getFirestore,
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

//Sprint 3

//Provide: condo id, request type, notes of request
//Returns: nothing
export async function submitRequest(condoID, type, notes) {
    
    try{
        var property
        try{
            const condo = await getCondo(condoID);
            const docRef = await addDoc(collection(db, `Condo/${condoID}`), clean);

        } catch(e){
            console.log("Error getting condo for request: ", e);
        }
        

    }catch(e){
        console.log("Error submitting request: ", e);
    }
}

//Provide: condo id
//Returns: array of requests associated with the condo
export async function getRequests(condoID){
    return [sampleRequest, sampleRequest, sampleRequest]
}

//Provide: request id (all request updates will be done backend)
//Returns: nothing
export async function updateRequest(requestID) {


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
