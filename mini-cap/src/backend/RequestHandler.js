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


/**
 * Submits a request associated with the specified condo ID, request type, and notes.
 * 
 * @param {string} condoID - The ID of the condo related to the request.
 * @param {string} type - The type of the request.
 * @param {string} notes - The notes/details of the request.
 * @returns {Promise<string|null>} A Promise that resolves with the ID of the submitted request if successful, or null if an error occurs.
 */
export async function submitRequest(condoID, type, notes) {
    // Check if the request type is valid
    if (!TYPES.includes(type)) {
        console.error("Invalid request type");
        return null;
    }
    try {
        // Add a new request document to the condo's requests collection
        const docRef = await addDoc(collection(doc(db, 'Condo', condoID), 'Requests'), {
            type: type,
            notes: notes,
            step: 0,
            viewed: false,
            condoID: condoID,
            requestID: null 
        });
        // Get the ID of the newly added request document
        const requestID = docRef.id;

        // Update the request document with its own ID
        await updateDoc(docRef, { requestID: requestID });


        // Return the ID of the submitted request
        return requestID;
        
    } catch(e) {
        // Log any errors that occur during the process
        console.error("Error submitting request: ", e);
        // Return null if an error occurs
        return null;
    }
}


/**
 * Retrieves an array of requests associated with the specified condo ID.
 * 
 * @param {string} condoID - The ID of the condo for which requests are being retrieved.
 * @returns {Promise<Array<object>|null>} A Promise that resolves with an array of request objects associated with the condo, or null if an error occurs.
 */
export async function getRequests(condoID){
    try {
        // Get reference to the condo document
        const condoRef = doc(db, 'Condo', condoID);
        // Get reference to the requests collection under the condo document
        const requestCollection = collection(condoRef, 'Requests');
        // Get snapshot of requests documents
        const requestSnapshot = await getDocs(requestCollection);
        // Initialize an array to store requests
        var requests = [];

        // Iterate through each request document
        await Promise.all(
            requestSnapshot.docs.map(async (doc) => {
                // Get data of the request
                var data = doc.data();
                // Push the request data to the array
                requests.push(data);
            }));
        
        // Return the array of requests
        return requests;
    } catch(e) {
        // Log any errors that occur during the process
        console.error("Error getting requests: ", e);
        // Return null if an error occurs
        return null;
    }
}


/**
 * Updates the request associated with the specified condo ID and request ID.
 * 
 * @param {string} condoID - The ID of the condo related to the request.
 * @param {string} requestID - The ID of the request to be updated.
 * @returns {Promise<string|null>} A Promise that resolves with the next step in the request process if successful, or "Completed" if the request process is finished, or null if an error occurs.
 */
export async function updateRequest(condoID, requestID) {
    try {
        // Get references to the condo and request documents
        const condoRef = doc(db, 'Condo', condoID);
        const requestRef = doc(collection(condoRef, 'Requests'), requestID);
        
        // Get the request document
        const requestDoc = await getDoc(requestRef);
        
        // Check if the request exists
        if (!requestDoc.exists()) {
            console.error("Request does not exist");
            return null;
        }
        
        // Get the data of the request
        const requestData = requestDoc.data();
        // Increment the step of the request
        requestData.step += 1;

        
        // If it's the first step, assign a worker
        if(requestData.step === 1){
            try{
                await assignWorker(requestData);
            } catch(e){
                console.error("Error assigning worker: ", e);
            }
        }
        
        // Determine the type of steps based on the request type
        let stepType;

        if(requestData.type === "Administrative"){
            stepType = ADMINISTRATIVE_STEPS;
        } else if(requestData.type === "Financial"){
            stepType = FINANCIAL_STEPS;
        } else if(requestData.type === "Maintenance"){
            stepType = MAINTENANCE_STEPS;
        } else {
            console.error("Invalid request type");
        }

        
        // Update the request document
        await updateDoc(requestRef, requestData);
      
        //  COMMENTED OUT THIS BECAUSE IN CONDOREQUESTSVIEW.JSX YOU CAN ONLY DO MAX 4 ADVANCES
        // if(requestData.step >= stepType.length){
        //     return "Completed"
        // }
        // else{
            return requestData.step;
        // }
    } catch (e) {
        console.error("Error updating request: ", e);
        return null;
    }
}



//BACKEND ONLY
export async function assignWorker(requestData) {

}

//BACKEND ONLY
export async function getAssignedWorker(requestID) {

}

//SPRINT 4

//Provide: userID
//Returns: array of new notifications containing message to display and path
export async function getNotifications(userID){

    
    //request update, event reminder
    //provide message to display and path for when clicked
}

//Provide: userID, requestID
//Returns: nothing
export async function setNotificationViewed(userID, notification){

    //called when clicked on notificaton
}
