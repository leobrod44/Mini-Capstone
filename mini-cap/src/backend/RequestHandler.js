import { initializeApp } from "firebase/app";
import {
    doc,
    addDoc,
    getDocs,
    collection,
    getFirestore,
    getDoc,
    updateDoc, arrayUnion
} from "firebase/firestore";
import { firebaseConfig } from "./FirebaseConfig";
import store from "storejs";
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
import { sortArray } from "./DataCleaner";

const sampleRequest = {
    "requestID": "1",
    "condoID": "1",
    "type": "Financial",
    "notes": "this is a sample",
    "step": 1,
    "viewed": false,
  }
  import { getCondo, getPropertyData } from "./PropertyHandler";
import {ADMINISTRATIVE_STEPS, FINANCIAL_STEPS, OPERATIONAL_STEPS, TYPES} from "./Constants";
import { cleanData } from "./DataCleaner";
import {getPropertyPicture} from "./ImageHandler";

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

    try {
        var r = {
            type: type,
            notes: notes,
            step: 0,
            viewed: false,
            condoID: condoID,
            requestID: null,
            assignedWorkerID: ""
        }
        // Add a new request document to the condo's requests collection
        const docRef = await addDoc(collection(doc(db, 'Condo', condoID), 'Requests'), r);
        // Get the ID of the newly added request document
        const requestID = docRef.id;

        // Update the request document with its own ID
        await updateDoc(docRef, { requestID: requestID });
        var condo = await getCondo(condoID);
        var property = await getPropertyData(condo.property);

        await addRequestNotification(1,property.companyOwner, r);

        // Return the ID of the submitted request
        return requestID;
        
    } catch(e) {
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
            // Return null if the request does not exist
            return null;
        }
        
        // Get the data of the request
        const requestData = requestDoc.data();
        // Increment the step of the request
        requestData.step += 1;


        // Update the request document
        await updateDoc(requestRef, requestData);

        // If it's the first step, assign a worker
        if(requestData.step === 1){
            try{
                await assignWorker(requestData);
            } catch(e){
                console.error("Error assigning worker: ", e);
            }
        }
        else{
            var userEmail = (await getCondo(condoID)).occupant;
            await addRequestNotification(0, userEmail, requestData);
        }
        return requestData.step;

    } catch (e) {
        // throw error
         throw e;
    }
}



/**
 * Assigns a worker to a specific request in a condominium.
 * @param {Object} requestData - The request data including the condo ID, request ID, and worker type.
 * @param {string} requestData.condoID - The ID of the condominium.
 * @param {string} requestData.requestID - The ID of the request.
 * @param {string} requestData.type - The type of worker needed for the request.
 * @returns {Promise<void|null>} A promise that resolves when the worker is assigned, or null if there was an error.
 */
export async function assignWorker(requestData) {
    try{
        // Retrieve the document reference for the specified condo ID from the "Condo" collection
        const condoRef = doc(db, "Condo", requestData.condoID);
        // Fetch the snapshot of the condo document
        const condoSnap = await getDoc(condoRef);
        // Extract condo data from the snapshot
        const condoData = condoSnap.data();

        const requestDocRef = doc(db, "Condo", requestData.condoID, "Requests", requestData.requestID);

        // Get document reference for the specified property ID
        const propertyRef = doc(db, "Property", condoData.property);

        const workersCollRef = collection(propertyRef, "Workers")
        const workersSnapshot = await getDocs(workersCollRef);

        workersSnapshot.docs.map(async (doc) => {
            if(requestData.type == doc.data().type){
                //add worker to request data
                await updateDoc(requestDocRef, {
                    assignedWorkerID: doc.ref.id
                });
            }
        })

    } catch (e) {
        // Return null if an error occurs
        return null;
    }

}

/**
 * Retrieves the assigned worker for a specific request in a condominium.
 * @param {string} condoID - The ID of the condominium.
 * @param {string} requestID - The ID of the request.
 * @returns {Promise<Object|null>} A promise that resolves with the assigned worker data (contains fields type and name), or null if there was an error.
 */
export async function getAssignedWorker(condoID, requestID) {
    try{
        // Retrieve the document reference for the specified condo ID from the "Condo" collection
        const condoRef = doc(db, "Condo", condoID);
        // Fetch the snapshot of the condo document
        const condoSnap = await getDoc(condoRef);
        // Extract condo data from the snapshot
        const condoData = condoSnap.data();

        const requestDocRef = doc(db, "Condo", condoID, "Requests", requestID);
        // Fetch the snapshot of the request document
        const requestSnap = await getDoc(requestDocRef);
        // Extract request data from the snapshot
        const requestData = requestSnap.data();

        // Get document reference for the specified property ID
        const workerDocRef = doc(db, "Property", condoData.property, "Workers", requestData.assignedWorkerID);
        // Fetch the snapshot of the worker document
        const workerSnap = await getDoc(workerDocRef);
        // Return worker data (contains fields type and name)
        return workerSnap.data();

    } catch (e) {
        // Return null if an error occurs
        return null;
    }
}

//SPRINT 4

///Provide: userID
//Returns: array of new notifications containing message to display and path
export async function getNotifications(userID){
    try {
        const notificationCollection = collection(doc(db, 'Users', userID), 'Notifications');
        const notificationSnapshot = await getDocs(notificationCollection);
        var notifications = [];
        await Promise.all(
            notificationSnapshot.docs.map(async (doc) => {
                var data = doc.data();
                notifications.push(data);
            }));
        return sortArray(notifications, 'date');
    } catch(e) {
        console.error("Error getting notifications: ", e);
    }
}

//Provide: userID, requestID
//Returns: nothing
export async function setNotificationViewed(email, notificationID){
    try {
        const notificationRef = doc(collection(doc(db, 'Users', email), 'Notifications'), notificationID);
        await updateDoc(notificationRef, { viewed: true });
    } catch(e) {
        console.error("Error setting notification viewed: ", e);
    }
}

export async function addRequestNotification(destinatiorType, email, requestData){
    try {
        var collectionRef = destinatiorType == 0 ? "Users" : "Company";
        const docRef = await addDoc(collection(doc(db, collectionRef, email), 'Notifications'), {
            type: requestData.type,
            message: requestData.notes,
            path: `/condo-details/${requestData.condoID}`,
            date: new Date().toISOString(),
            viewed: false
        });
         return docRef.id;
    } catch(e) {
        console.error("Error adding notification: ", e);
    }
}