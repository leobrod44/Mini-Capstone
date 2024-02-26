import {deleteDoc, getFirestore} from "firebase/firestore";
import {initializeApp,storageRef} from "firebase/app";
import { getDocs, collection, doc, addDoc, setDoc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import {cleanData} from "./DataCleaner";
import { getStorage, uploadBytes, getDownloadURL, deleteObject, ref } from "firebase/storage";
import store from "storejs";
import emailjs from '@emailjs/browser';
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

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage();
const profilePictureRef = 'profilePictures/';
const condoPictureRef = 'condoPictures/';
const propertyPictureRef = 'propertyPictures/';
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
        const docRef = await addDoc(collection(db, "Keys"), data);
        await updateDoc(docRef, {
            used: false
        })
        return docRef.id;
    }
    catch(e){
        throw new Error("Error adding document: ", e);
    }
}

export async function sendCondoKey(email, key){
    console.log(email);
    emailjs
        .send('service_htocwjs', 'template_h1oyvhl', {to_recipient: email, message: key}, {
            publicKey: 'Gw4N_w4eDx939VEBl',
        })
        .then(
            () => {
                console.log('Successfully sent key!');
            },
            (error) => {
                console.log('Failed to send key: ', error.text);
            },
        );
}

export async function linkCondoToUser(email, key){
    try {
        const docRef = doc(db, "Keys", key);
        const docSnap = await getDoc(docRef);
        let data;

        if (docSnap.exists()) {
            data = docSnap.data();
        } else {
            return "Key is not valid!";
        }

        if(data.email !== email){
            return "This key is not associated to your account";
        }
        if(data.used){
            return "This key has already been used";
        }

        const userRef = doc(db, "Users", email);
        const userSnap = await getDoc(docRef);

        if(data.role === "renter"){
            if(userSnap.data().hasOwnProperty('rents')){
                await updateDoc(userRef, {
                    rents: [data.condo]
                });
            }else{
                await updateDoc(userRef, {
                    rents: arrayUnion(data.condo)
                });
            }
        }
        if(data.role === "owner"){
            if(userSnap.data().hasOwnProperty('owns')){
                await updateDoc(userRef, {
                    owns: [data.condo]
                });
            }else{
                await updateDoc(userRef, {
                    owns: arrayUnion(data.condo)
                });
            }
        }

        //set key to used
        await updateDoc(docRef, {
            used: true
        })

    } catch (err) {
        console.error(err);
    }
    return "Condo added!";
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
        const docID = docRef.id;

        await updateDoc(docRef, {
            id: docID
        });

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

export async function getUserCondos(email) {
    try {
        const userCollection = collection(db, "Users");
        const userSnapshot = await getDocs(userCollection);
        const condos = [];

        await Promise.all(userSnapshot.docs.map(async (userDoc) => {
            const userData = userDoc.data();
            if (userData.email === email) {

                if (userData.owns && userData.owns.length > 0) {
                    // check owns array
                    const ownedCondoPromises = userData.owns.map(async (condoId) => {
                        const condoDocRef = doc(db, "Condo", condoId);
                        const condoDoc = await getDoc(condoDocRef);

                        if (condoDoc.exists()) {
                            const condoData = condoDoc.data();
                            const propertyDocRef = doc(db, "Property", condoData.property);
                            const propertyDoc = await getDoc(propertyDocRef);

                            if (propertyDoc.exists()) {
                                condoData.property = propertyDoc.data().address;
                                condoData.propertyName = propertyDoc.data().propertyName;
                                condoData.userType = "Owner";
                                return condoData;
                            } else
                                return null;
                        }
                        else
                            return null;
                    });

                    const userOwnedCondos = await Promise.all(ownedCondoPromises);
                    condos.push(...userOwnedCondos);
                }

                if (userData.rents && userData.rents.length > 0) {
                    // check rents array
                    const rentedCondoPromises = userData.rents.map(async (condoId) => {
                        const condoDocRef = doc(db, "Condo", condoId);
                        const condoDoc = await getDoc(condoDocRef);

                        if (condoDoc.exists()) {
                            const condoData = condoDoc.data();
                            const propertyDocRef = doc(db, "Property", condoData.property);
                            const propertyDoc = await getDoc(propertyDocRef);

                            if (propertyDoc.exists()) {
                                condoData.property = propertyDoc.data().address;
                                condoData.propertyName = propertyDoc.data().propertyName;
                                condoData.userType = "Renter";
                                return condoData;
                            } else
                                return null;
                        }
                        else
                            return null;
                    });

                    const userRentedCondos = await Promise.all(rentedCondoPromises);
                    condos.push(...userRentedCondos);
                }
            }
        }));

        return condos;
    } catch (e) {
        throw new Error("Error getting condos: " + e);
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