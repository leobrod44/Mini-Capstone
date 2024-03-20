import { getStorage, uploadBytes, getDownloadURL, deleteObject, ref, listAll} from "firebase/storage";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "./FirebaseConfig";
import { RENTER_OWNER } from "./Constants";
import {getCondo } from "./PropertyHandler";
import store from "storejs";
import { getUserData } from "./UserHandler";
initializeApp(firebaseConfig);

const storage = getStorage();

const profilePictureRef = 'profilePictures/';
const condoPictureRef = 'condoPictures/';
const propertyPictureRef = 'propertyPictures/';
const propertyFileRef = 'propertyFiles/';

/**
 * Retrieves the profile picture URL associated with the specified email.
 * 
 * @param {string} email - The email address of the user whose profile picture URL is to be retrieved.
 * @returns {Promise<string|null>} A Promise that resolves with the profile picture URL if found, otherwise null.
 */
export async function getProfilePicture(email) {
    const storage = getStorage();
    const storageRef = ref(storage, profilePictureRef + email);

    try {
        // Get download URL for the profile picture
        const url = await getDownloadURL(storageRef);
        // Return the URL
        return url;
    } catch (err) {
        // Return null if profile picture URL cannot be retrieved
        return null;
    }
}
/**
 * Retrieves the picture URL associated with the specified property name.
 * 
 * @param {string} name - The name of the property whose picture URL is to be retrieved.
 * @returns {Promise<string|null>} A Promise that resolves with the picture URL if found, otherwise null.
 */
export async function getPropertyPicture(name) {
    const storage = getStorage();
    const storageRef = ref(storage, propertyPictureRef + name);

    try {
        // Get download URL for the property picture
        const url = await getDownloadURL(storageRef);
        // Return the URL
        return url;
    } catch (err) {
        // Return null if property picture URL cannot be retrieved
        return null;
    }
}


/**
 * Retrieves the picture URL associated with the specified condo ID.
 * 
 * @param {string} id - The ID of the condo whose picture URL is to be retrieved.
 * @returns {Promise<string|null>} A Promise that resolves with the picture URL if found, otherwise null.
 */
export async function getCondoPicture(id) {
    const storage = getStorage();
    const storageRef = ref(storage, condoPictureRef + id);

    try {
        // Get download URL for the condo picture
        const url = await getDownloadURL(storageRef);
        // Return the URL
        return url;
    } catch (err) {
        // Return null if condo picture URL cannot be retrieved
        return null;
    }
}



/**
 * Updates the profile picture of the user with the specified email.
 * 
 * @param {string} email - The email address of the user whose profile picture is to be updated.
 * @param {File} photo - The new profile picture file to be uploaded.
 * @throws {Error} If an error occurs during the picture update process.
 */
export async function updateUserPicture(email, photo){
    try{
        // Get storage reference
        const storage = getStorage();
        const desertRef = ref(storage, profilePictureRef + email);
        
        try {
            // Check if previous profile picture exists and delete it
            await deleteObject(desertRef);
            // Upload new profile picture
            await uploadBytes(desertRef, photo);
        } catch (e) {
            // Log error if download URL cannot be retrieved or picture upload fails
            throw e
        }
    }
    catch(e){
        // Throw error if an error occurs during the process
        throw new Error("Error changing picture: ", e);
    }
}

/**
 * Uploads a picture to the specified path in the storage.
 * 
 * @param {object} data - The data object containing the picture to upload.
 * @param {string} path - The path in the storage where the picture will be uploaded.
 * @throws {Error} If an error occurs during the picture upload process.
 */
export async function setPicture(data, path){
    try{
        // Extract picture data from the data object
        var pictureData = data.picture;
        // Check if picture data exists
        if(pictureData){

            // Upload picture data to the specified path

            await uploadBytes(ref(storage,path + data.email), pictureData);
        }
    }
    catch(e){
        // Throw error if an error occurs during the process
        throw new Error("Error adding picture: ", e);
    }
}
/**
 * Uploads a picture to the specified path in the storage with a given ID.
 * 
 * @param {object} data - The data object containing the picture to upload.
 * @param {string} path - The path in the storage where the picture will be uploaded.
 * @param {string} id - The ID used for naming the picture in the storage.
 * @throws {Error} If an error occurs during the picture upload process.
 */
export async function setPictureWithID(data, path, id){
    try{
        // Extract picture data from the data object
        var pictureData = data.picture;
        // Check if picture data exists
        if(pictureData){
            // Generate storage reference with the specified path and ID
            var r = ref(storage,path + id);
            // Upload picture data to the generated storage reference
            var pic = await uploadBytes(r, pictureData);
        }
    }
    catch(e){
        // Throw error if an error occurs during the process
        throw new Error("Error adding picture: ", e);
    }
}



/**
 * Uploads a file associated with a property to the storage.
 * 
 * @param {string} propertyID - The ID of the property for which the file is being uploaded.
 * @param {File} file - The file to upload.
 */
export async function uploadFile(propertyID, file) {
    try{
        // Check if file exists
        if(file){
            // Get the count of existing files for the property
            var count  = (await listAll(ref(storage, propertyFileRef +"/"+propertyID))).items.length;
            // Upload the file to the storage
            var resp = await uploadBytes(ref(storage, propertyFileRef +"/"+propertyID+"/"+file.name), file);
        }
    }
    catch(e){
        throw e;
    }
}
/**
 * Retrieves an array of files associated with a property.
 * 
 * @param {string} propertyID - The ID of the property for which files are being retrieved.
 * @returns {Promise<Array<string>|null>} A Promise that resolves with an array of file URLs associated with the property, or null if an error occurs.
 */
export async function getPropertyFiles(propertyID) {
    try{
        // List all items in the property file storage directory
        var propertyItems = await listAll(ref(storage, propertyFileRef +"/"+propertyID));
        // Retrieve URLs for each item in parallel
        var files  = await Promise.all(propertyItems.items.map(async (itemRef) => {
            // Get download URL for the item
            const url = await getDownloadURL(itemRef);
            // Return the URL

            return {url: url, name: itemRef.name};
        }));
        // Return the array of file URLs
        return files;
    } catch(e) {
        // Return null if an error occurs
        return null;
    }
}


/**
 * Retrieves an array of files associated with the specified user.
 * 
 * @param {string} userID - The ID of the user for whom files are being retrieved.
 * @returns {Promise<Array<Array<string>>|null>} A Promise that resolves with an array of arrays of file URLs associated with the user, or null if an error occurs.
 * @throws {Error} If the user is a management company or not logged in.
 */
export async function getUsersFiles(userID) {
    try {
        // Check if the user is a management company
        if(store("role") != RENTER_OWNER){
            throw new Error("Management companies cannot have files associated with them.");
        } else if(store("role") == ""){
            // Check if the user is not logged in
            throw new Error("User is not logged in");
        } else {
            // Retrieve data of owned condos by the user
            var owned = await getUserData(userID);
            // Retrieve condos data associated with the user's ownership

            var condos = await Promise.all(owned.owns.map(async element => {
                var c = await getCondo(element);
                return c;
            }));

            // Extract unique property IDs from the owned condos
            var properties = Array.from(new Set(condos.map(c => c.property)));
            // Retrieve files associated with each property

            var files = await Promise.all(properties.map(async property => {
                var f = await getPropertyFiles(property);
                return f;
            }));

            // Return the array of arrays of file URLs
            return files;
        }
    } catch (e) {
        // Throw error if any errors occur during the process
        throw e;
    }
}

