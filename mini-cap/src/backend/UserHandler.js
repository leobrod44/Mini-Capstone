import {deleteDoc, getFirestore} from "firebase/firestore";
import {initializeApp,storageRef} from "firebase/app";
import { getDocs, collection, doc, addDoc, setDoc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import {cleanData} from "./DataCleaner";
import { getStorage, uploadBytes, getDownloadURL, deleteObject, ref } from "firebase/storage";
import store from "storejs";
import emailjs from '@emailjs/browser';
import { MANAGEMENT_COMPANY, MANGEMENT_COMPANY, RENTER_OWNER } from "./Constants";
import { firebaseConfig } from "./FirebaseConfig";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const profilePictureRef = 'profilePictures/';
emailjs.init({
    publicKey: "Gw4N_w4eDx939VEBl",
});

// returns user data using email
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

// returns company data using email
export async function getCompanyData(email) {
    try {
        const docRef = doc(db, "Company", email);
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

// updates user info using email
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

export async function updateCompanyInfo(email, data) {
    try {
        const docRef = doc(db, "Company", email);
        await updateDoc(docRef, {
            companyName: data.companyName,
            phoneNumber: data.phoneNumber
        });

    } catch (err) {
        console.error(err);
    }
}

// sends email to user with link to reset password
export async function changePassword(email, data) {
    try {
        const userDoc = await getDoc(doc(db, "Users", data['email']));
        const companyDoc = await getDoc(doc(db, "Company", data['email']));
        const userDocData = userDoc.data();
        const companyDocData = companyDoc.data();

        if (userDoc.exists()) {
            if(userDocData.password !== data.currentPassword) {
                throw new Error("Incorrect current password");
            } else if(userDocData.password === data.newPassword) {
                throw new Error("New password cannot be the same as the previous password");
            }

            await updateDoc(doc(db, "Users", email), {
                password: data.newPassword,
            });
        } else if (companyDoc.exists()) {
            if(companyDocData.password !== data.currentPassword) {
                throw new Error("Incorrect current password");
            } else if(companyDocData.password === data.newPassword) {
                throw new Error("New password cannot be the same as the previous password");
            }

            await updateDoc(doc(db, "Company", email), {
                password: data.newPassword,
            });
        } else {
            throw new Error("Cannot find user");
        }

        return {message: "Password updated successfully"};
    } catch (err) {
        throw err;
    }
}


export async function checkEmailExists(email) {
    try {
        const userDoc = await getDoc(doc(db, "Users", email));
        if (!userDoc.exists()) {
            throw new Error("Cannot find any users with this email.");
        }
    } catch (e) {
        throw new Error(e);
    }
}

export async function addUser(data) {
    //are these 2 lines needed?
    const usersCollection = collection(db, "Users");
    const clean = cleanData("Users",data);

    try {
        const userDoc = await getDoc(doc(db, "Users", data['email']));
        const companyDoc = await getDoc(doc(db, "Company", data['email']));
        if (userDoc.exists()) {
            throw new Error("User already exists.");
        }
        else if (companyDoc.exists()) {
            throw new Error("Company already exists.");
        }

        try{
            await setPicture(data, profilePictureRef);
        }catch(e){
            throw new Error("Error adding picture: ", e);
        }

        try{
            await storeData("Users",data,data['email']);
            store("user", data["email"]);
            store("role", RENTER_OWNER);
            window.location.href = '/';
        }catch(e){
            throw new Error("Error adding document: ", e);
        }
    } catch (e) {
        throw new Error(e);
    }
}

export async function addCompany(data) {
    //are these 2 lines needed?
    const companyCollection = collection(db, "Company");
    const clean = cleanData("Users",data);

    try {
        const userDoc = await getDoc(doc(db, "Users", data['email']));
        const companyDoc = await getDoc(doc(db, "Company", data['email']));
        if (userDoc.exists()) {
            throw new Error("User already exists.");
        }
        else if (companyDoc.exists()) {
            throw new Error("Company already exists.");
        }

        try{
            await setPicture(data, profilePictureRef);
        }catch(e){
            throw new Error("Error adding picture: ", e);
        }
        
        try{
           await storeData("Company",data,data['email']);
           store("user", data["email"]);
           store("role", MANAGEMENT_COMPANY);
           window.location.href = '/';
        }catch(e){
            throw new Error("Error adding document: ", e);
        }
    } catch (e) {
        throw new Error(e);
    }
}


async function storeData(collection, data, key){
    try{
     const clean = cleanData(collection,data);
     const docRef = await setDoc(doc(db, collection, key), clean).then((res) => {
        console.log("response:", res);
      })
      .catch((err) => {
        console.log("unable to add user to database", err);
      });
    return docRef;
    }
    catch(e){
        throw new Error("Error adding document: ", e);
    }
}

export async function deleteAccount(email) {
    try {
        const userDoc = await getDoc(doc(db, "Users", email));
        const companyDoc = await getDoc(doc(db, "Company", email));

        if (userDoc.exists())
            await deleteDoc(doc(db, "Users", email));
        else if (companyDoc.exists())
            await deleteDoc(doc(db, "Company", email));
        else
            throw new Error("User does not exist.");
    } catch (e) {
        throw new Error(e.message);
    }
}