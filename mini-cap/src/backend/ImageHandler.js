import { getStorage, uploadBytes, getDownloadURL, deleteObject, ref } from "firebase/storage";
import emailjs from '@emailjs/browser';
import {initializeApp} from "firebase/app";
import {getFirestore} from "firebase/firestore";


const firebaseConfig = {
    apiKey: "AIzaSyA9EVUOQ3j8g5W_lad6GeAK2CnT9oCXIVQ",
    authDomain: "condoconnect-54ccc.firebaseapp.com",
    projectId: "condoconnect-54ccc",
    storageBucket: "condoconnect-54ccc.appspot.com",
    messagingSenderId: "915299313041",
    appId: "1:915299313041:web:a9832780ad51a84fb1e630",
    measurementId: "G-MQJCJCX0ET"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const storage = getStorage();
const profilePictureRef = 'profilePictures/';
const condoPictureRef = 'condoPictures/';
const propertyPictureRef = 'propertyPictures/';
emailjs.init({
    publicKey: "Gw4N_w4eDx939VEBl",
});

export async function getProfilePicture(email) {
    const storage = getStorage();
    const storageRef = ref(storage, profilePictureRef + email);

    try {
        const url = await getDownloadURL(storageRef);
        return url;
    } catch (err) {
        console.error(err);
    }
}
export async function getPropertyPicture(name) {
    const storage = getStorage();
    const storageRef = ref(storage, propertyPictureRef + name);

    try {
        const url = await getDownloadURL(storageRef);
        return url;
    } catch (err) {
        console.error(err);
    }
}

export async function getCondoPicture(id) {
    const storage = getStorage();
    const storageRef = ref(storage, condoPictureRef + id);

    try {
        const url = await getDownloadURL(storageRef);
        return url;
    } catch (err) {
        console.error(err);
    }
}


export async function uploadUserPicture(email, photo) {
    try {
        const storage = getStorage();
        const pictureRef = ref(storage, profilePictureRef + email);

        // Upload the photo to the specified storage path
        await uploadBytes(pictureRef, photo);

        console.log("Picture uploaded successfully!");
    } catch (error) {
        console.error("Error uploading picture: ", error);
        throw new Error("Error uploading picture: " + error.message);
    }
}

export async function updateUserPicture(email, photo){
    try{
        const storage = getStorage();
        const desertRef = ref(storage, profilePictureRef + email);
        try {
            await getDownloadURL(desertRef);
            await deleteObject(desertRef);
            await uploadBytes(desertRef, photo);
        } catch (e) {
            console.error("Error getting download URL or uploading picture: ", e);
        }
    }
    catch(e){
        throw new Error("Error changing picture: ", e);
    }
}

export async function setPicture(data, path){
    try{
        var pictureData = data.picture;
        if(pictureData){
            var pic = await uploadBytes(ref(storage,path + data.email), pictureData);
        }
    }
    catch(e){
        throw new Error("Error adding picture: ", e);
    }
}
export async function setPictureWithID(data, path, id){
    try{

        var pictureData = data.picture;
        if(pictureData){
            var r = ref(storage,path + id);
            var pic = await uploadBytes(r, pictureData);
            var bucketData = await getDownloadURL(r);
            console.log("pic: ", pic);
        }
    }
    catch(e){
        throw new Error("Error adding picture: ", e);
    }
}