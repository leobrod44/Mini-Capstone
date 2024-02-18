import {getFirestore} from "firebase/firestore";
import {initializeApp,storageRef} from "firebase/app";
import { getDocs, collection, doc, addDoc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import {cleanData} from "./DataCleaner";
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import store from "storejs";

//npm install firebase
//npm install storejs --save

const firebaseConfig = {
    apiKey: "AIzaSyA9EVUOQ3j8g5W_lad6GeAK2CnT9oCXIVQ",
    authDomain: "condoconnect-54ccc.firebaseapp.com",
    projectId: "condoconnect-54ccc",
    storageBucket: "condoconnect-54ccc.appspot.com",
    messagingSenderId: "915299313041",
    appId: "1:915299313041:web:a9832780ad51a84fb1e630",
    measurementId: "G-MQJCJCX0ET"
};


const app = initializeApp(firebaseConfig)
const db = getFirestore(app);
const storage = getStorage();
const profilePictureRef = 'profilePictures/';

export async function getUserData(email) {

    try {
        const docRef = doc(db, "Users", email);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return docSnap.data();
        } else {
            console.log("No such document!");
        }

    } catch (err) {
        console.error(err);
    }
}

export async function updateUserInfo(email, data) {

    try {
        const docRef = doc(db, "Users", email);
        await updateDoc(docRef, {
            firstName: data.firstName,
            lastName: data.lastName,
            phoneNumber: data.phoneNumber
        });

    } catch (err) {
        console.error(err);
    }

}

export async function changePassword(email, data) {

    try {
        const docRef = doc(db, "Users", email);
        const docSnap = await getDoc(docRef);
        const docData = docSnap.data();

        if (docSnap.exists()) {
            if(docData.password != data.currentPassword){
                return {message: "Incorrect current password"};
            }else if(docData.password === data.newPassword){
                return {message: "New password cannot be the same as previous password"};
            }
        } else {
            console.log("No such document!");
            return;
        }

        await updateDoc(docRef, {
            password: data.newPassword,
        });

        return {message: "Password updated successfully"};
    } catch (err) {
        console.error(err);
    }

}

export async function getProfilePicture(email) {

    const storage = getStorage();
    const storageRef = ref(storage, "profilePictures/" + email);

    try {
        const url = await getDownloadURL(storageRef);
        return url;
    } catch (err) {
        console.error(err);
    }
}

export async function addUser(data) {
    const usersCollection = collection(db, "Users");
    const clean = cleanData("Users",data);
    try {
        const userDoc = await getDoc(doc(db, "Users", data['email']));
        if (userDoc.exists()) {
            throw new Error("User already exists.");
        }
        //console.log(data);
       setPicture(data, profilePictureRef);
       await storeData("Users",data,data['email']);

       store("loggedUser", data["email"]);
       store("role", data["role"]);
       window.location.href = '/';
    } catch (e) {
        throw new Error(e);
    }
}
export async function addCompany(data) {
    const companyCollection = collection(db, "Company");

    try {

        const userDoc = await getDoc(doc(db, "Company", data['email']));
        if (userDoc.exists()) {
            throw new Error("Company already exists.");
        }

        setPicture(data, profilePictureRef);

        storeData("Company",data,data['email']);

    } catch (e) {
        throw new Error(e);
    }
}

export async function loginUser(data) {

    try{
        const userDoc = await getDoc(doc(db, "Users", data['email']));
        if (!userDoc.exists()) {
            throw new Error("User does not exist.");
        }
        if(data['password'] != userDoc.data().password){
            throw new Error("Incorrect password.");
        }

        store("loggedUser", data["email"]);
        store("role", userDoc.data().role);

        window.location.href = '/';
    }
    catch(e){
        throw new Error(e);
    }
}

async function setPicture(data, path){
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

export async function updatePicture(email, path){
    try{
        const storage = getStorage();
        const desertRef = ref(storage, 'profilePictures/'+ email);
        await deleteObject(desertRef);;
        var pic = await uploadBytes(ref(storage,profilePictureRef + email), path);

    }
    catch(e){
        throw new Error("Error changing picture: ", e);
    }
}

async function storeData(collection, data, key){
    try{
        const clean = cleanData(collection,data);
        const docRef = await setDoc(doc(db, collection, key), clean);
    }
    catch(e){
        throw new Error("Error adding document: ", e);
    }
}








