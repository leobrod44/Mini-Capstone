import {deleteDoc, getFirestore} from "firebase/firestore";
import {initializeApp,storageRef} from "firebase/app";
import { getDocs, collection, doc, addDoc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import {cleanData} from "./DataCleaner";
import { getStorage, uploadBytes, getDownloadURL, deleteObject, ref } from "firebase/storage";
import store from "storejs";
import { MANAGEMENT_COMPANY, MANGEMENT_COMPANY, RENTER_OWNER } from "./Constants";
import {useState} from "react";
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
const condoPictureRef = 'condoPictures/';
const propertyPictureRef = 'propertyPictures/';


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

export async function updateUserPicture(email, photo){
    try{
        const storage = getStorage();
        const desertRef = ref(storage, profilePictureRef+ email);
        var pic = await getDownloadURL(desertRef);
        // If the getDownloadURL call succeeds, the file exists, so we can proceed with deleting and uploading
        await deleteObject(desertRef);
        var resp = await deleteObject(desertRef);
        var pic = await uploadBytes(ref(storage,profilePictureRef + email), photo);

    }
    catch(e){
        throw new Error("Error changing picture: ", e);
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

export async function storeCondoKey(data){
    const keyCollection = collection(db, "Keys");

    try{
        //const clean = cleanData(keyCollection, data);
        const docRef = await addDoc(collection(db, "Keys"), data);
    }
    catch(e){
        throw new Error("Error adding document: ", e);
    }
}

export async function addUser(data) {
    //are these 2 lines needed?
    const usersCollection = collection(db, "Users");
    const clean = cleanData("Users",data);

    try {
        const userDoc = await getDoc(doc(db, "Users", data['email']));
        if (userDoc.exists()) {
            throw new Error("User already exists.");
        }

        try{
            await setPicture(data, profilePictureRef);
        }catch(e){
            throw new Error("Error adding picture: ", e);
        }

        try{
            await storeData("Users",data,data['email']);
            store("user", data["email"]);
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
        const companyDoc = await getDoc(doc(db, "Company", data['email']));
        if (companyDoc.exists()) {
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
           window.location.href = '/';
        }catch(e){
            throw new Error("Error adding document: ", e);
        }
    } catch (e) {
        throw new Error(e);
    }
}

export async function loginUser(data) {

    try{

        const userDoc = await getDoc(doc(db, "Users", data['email']));
        const companyDoc = await getDoc(doc(db, "Company", data['email']));

        store("user", data["email"]);

        if (userDoc.exists()) {
            if(data['password'] != userDoc.data().password){
                throw new Error("Incorrect password.");
            }
            store("role", RENTER_OWNER)
        }
        else if (companyDoc.exists()) {
            if(data['password'] != companyDoc.data().password){
                throw new Error("Incorrect password.");
            }
            store("role", MANAGEMENT_COMPANY)
        }
        else
            throw new Error("User does not exist.");

        window.location.href = '/';
    }
    catch(e){
        throw new Error(e);
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

export async function addCondo(data, propertyID, propertyName){
    var pictureData = data.picture;

    try{
        data["property"] = propertyID;
        const clean = cleanData("Condo",data);
        const docRef = await addDoc(collection(db, "Condo"), clean);
        if(pictureData){
            try{
                await setPictureWithID(data, condoPictureRef,propertyName+"/"+ data['unitNumber']);
            }
            catch(e){
                throw new Error("Error adding picture: ", e);
            }
        }
    }
    catch(e){
        throw new Error("Error adding document: ", e);
    }

}
export async function addProperty(data){
    var pictureData = data.picture;
    data["companyOwner"] = store("user");
    try{
        const clean = cleanData("Property",data);
        const docRef = await addDoc(collection(db, "Property"), clean);
        if(pictureData){
            try{
                await setPictureWithID(data, propertyPictureRef, data['propertyName']);
            }
            catch(e){
                throw new Error("Error adding picture: ", e);
            }
        }
        if(data["condos"] != ""){
            try{
                data["condos"].forEach(async function(condoData){
                    await addCondo(condoData,docRef.id, data["propertyName"]);
                });
            }
            catch(e){
                throw new Error("Error adding condo: ", e);
            }
        }
    }
    catch(e){
        throw new Error("Error adding document: ", e);
    }
}

export async function getProperties(company) {
    try {
        const propertyCollection = collection(db, "Property");
        const propertySnapshot = await getDocs(propertyCollection);
        var properties = [];

        await Promise.all(propertySnapshot.docs.map(async (doc) => {
            if (doc.data().companyOwner == company) {
                var data = doc.data();
                data["propertyID"] = doc.id;
                try {
                    data["picture"] = await getPropertyPicture(data['propertyName']);
                } catch (e) {
                    throw new Error("Error getting picture: " + e);
                }

                properties.push(data);
            }
        }));
        return properties;
    } catch (error) {
        throw new Error("Error getting properties: " + error);
    }
}

export async function getCondos(propertyID){
    try{
        const condoCollection = collection(db, "Condo");
        const condoSnapshot = await getDocs(condoCollection);
        var condos = [];
        condoSnapshot.forEach((doc) => {
            if(doc.data().property == propertyID){
                condos.push(doc.data());
            }
        });
        return condos;
    }
    catch(e){
        throw new Error("Error getting condos: ", e);
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


        window.location.href = '/login';
    } catch (e) {
        throw new Error(e.message);
    }
}