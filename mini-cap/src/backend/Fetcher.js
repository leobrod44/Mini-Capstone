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
const profilePictureRef = ref(storage, 'profilePictures/');

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
            console.log("User already exists.");
            throw new Error("User already exists.");
        }
        const docRef = await setDoc(doc(db, "Users", data['email']), {
            data
        });
        console.log("Document written with ID: ", docRef);
        return true;
    } catch (e) {
        throw new Error("Error adding document: ", e);
    }
}
export async function addCompany(data) {
    const companyCollection = collection(db, "Company");
    const clean = cleanData("Company",data);

    try {
        const userDoc = await getDoc(doc(db, "Company", data['email']));
        if (userDoc.exists()) {
            throw new Error("Company already exists.");
        }

        const docRef = await setDoc(doc(db, "Company", data['email']), {
            data
        });
        console.log("Document written with ID: ", docRef);
    } catch (e) {
        throw new Error("Error adding document: ", e);
    }
}
function setPicture(data){
    var pictureData = data.picture;
    if(pictureData){
        uploadBytes(profilePictureRef, pictureData).then((snapshot) => {
            console.log('Uploaded a blob or file!');
          });
    }
}








