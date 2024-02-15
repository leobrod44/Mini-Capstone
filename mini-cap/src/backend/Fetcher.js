import {getFirestore} from "firebase/firestore";
import {initializeApp} from "firebase/app";
import { getDocs, collection } from "firebase/firestore";

const firebaseConfig = {
    // apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    // authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    // projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    // storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    // messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    // appId: process.env.REACT_APP_FIREBASE_APP_ID,
    // measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
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




