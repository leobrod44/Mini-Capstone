import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const db = getFirestore(app);
export const storage = getStorage(app);