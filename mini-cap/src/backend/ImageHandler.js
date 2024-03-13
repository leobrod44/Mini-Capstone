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
            await uploadBytes(ref(storage,path + data.email), pictureData);
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
            console.log("pic: ", pic);
        }
    }
    catch(e){
        throw new Error("Error adding picture: ", e);
    }
}

//Provide property id, condo file to upload
//Returns: nothing
export async function uploadFile(propertyID, file) {
    try{
        if(file){
            var count  = (await listAll(ref(storage, propertyFileRef +"/"+propertyID))).items.length;
            console.log("count: ", count);
            var resp = await uploadBytes(ref(storage, propertyFileRef +"/"+propertyID+"/"+count), file);
            console.log("resp: ", resp);
        }
    }
    catch(e){
        console.log("Uploading file to property: ", propertyID, file);
    }
}   
//Provide propertyId
//Returns: array of files associated with the property
export async function getPropertyFiles(propertyID) {
    try{
        var propertyItems = await listAll(ref(storage, propertyFileRef +"/"+propertyID));
        var files  = await Promise.all(propertyItems.items.map(async (itemRef) => {
            const url = await getDownloadURL(itemRef);
            return url;
        }));
        return files;
    }catch(e){
        console.log("Error getting property files: ", e);
    }
}

//Provide: userID of renter/owner
//Returns: array of files associated with the user
export async function getUsersFiles(userID) {

    // try{
        if(store("role") != RENTER_OWNER){
            throw new Error("Management companies cannot have files associated with them.");
        }
        else if(store("role") == ""){
            throw new Error("User not isn't logged in");
        }
        else{
            var owned = await getUserData(userID);
            var condos = await Promise.all(owned.owns.map(async element => {
                var c = await getCondo(element);
                return c;
            }));
            var properties = Array.from(new Set(condos.map(c => c.property)));
            var files = await Promise.all(properties.map(async property => {
                var f = await getPropertyFiles(property);
                return f;
            }));
            return files;
        }
    //}
    // catch(e){
    //     throw new Error("Error getting user files: ", e);
    // }

}