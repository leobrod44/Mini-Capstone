import {getFirestore} from "firebase/firestore";
import {initializeApp,storageRef} from "firebase/app";
import { getDocs, collection, doc, addDoc, setDoc, getDoc } from "firebase/firestore";
import {cleanData} from "./DataCleaner";
import { getStorage, ref, uploadBytes } from "firebase/storage";

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

export async function getUserData() {

    const usersCollection = collection(db, "Users")

    try {
        const data = await getDocs(usersCollection);
        const userList = data.docs.map(doc => doc.data());
        const userIds = data.docs.map(doc => doc.id);
        console.log(userList.at(0).email);
        console.log(userIds.at(0));
        //console.log(db.collection('User').doc(userIds.at(0)).get());
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
       setPicture(data, profilePictureRef);
       storeData("Users",data,data['email']);

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
async function storeData(collection, data, key){
    try{
        const clean = cleanData(collection,data);
        const docRef = await setDoc(doc(db, collection, key), {
            data
        });
    }
    catch(e){
        throw new Error("Error adding document: ", e);
    }
}








