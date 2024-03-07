import { deleteDoc, getFirestore } from "firebase/firestore";
import { initializeApp, storageRef } from "firebase/app";
import {
  getDocs,
  collection,
  doc,
  addDoc,
  setDoc,
  getDoc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { cleanData } from "./DataCleaner";
import store from "storejs";
import emailjs from "@emailjs/browser";
import { MANAGEMENT_COMPANY, RENTER_OWNER } from "./Constants";
import { firebaseConfig } from "./FirebaseConfig";
import { setPictureWithID, getPropertyPicture } from "./ImageHandler";
import s from "storejs";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const condoPictureRef = "condoPictures/";
const propertyPictureRef = "propertyPictures/";
emailjs.init({
  publicKey: "Gw4N_w4eDx939VEBl",
});
// returns user data using email
export async function storeCondoKey(data) {
  const keyCollection = collection(db, "Keys");

  try {
    const docRef = await addDoc(collection(db, "Keys"), data);
    await updateDoc(docRef, {
      used: false,
    });
    return docRef.id;
  } catch (e) {
    throw new Error("Error adding document: ", e);
  }
}

// returns user data using email
export async function sendCondoKey(email, key) {
  console.log(email);
  emailjs
    .send(
      "service_htocwjs",
      "template_h1oyvhl",
      { to_recipient: email, message: key },
      {
        publicKey: "Gw4N_w4eDx939VEBl",
      }
    )
    .then(
      () => {
        console.log("Successfully sent key!");
      },
      (error) => {
        console.log("Failed to send key: ", error.text);
      }
    );
}
// returns user data using email
export async function linkCondoToUser(email, key) {
  try {
    const docRef = doc(db, "Keys", key);
    const docSnap = await getDoc(docRef);
    let data;

    if (docSnap.exists()) {
      data = docSnap.data();
    } else {
      return "Key is not valid!";
    }

    if (data.email !== email) {
      return "This key is not associated to your account";
    }
    if (data.used) {
      return "This key has already been used";
    }

    const userRef = doc(db, "Users", email);
    const userSnap = await getDoc(docRef);

    if (data.role === "renter") {
      if (userSnap.data().hasOwnProperty("rents")) {
        await updateDoc(userRef, {
          rents: [data.condo],
        });
      } else {
        await updateDoc(userRef, {
          rents: arrayUnion(data.condo),
        });
      }
    }
    if (data.role === "owner") {
      if (userSnap.data().hasOwnProperty("owns")) {
        await updateDoc(userRef, {
          owns: [data.condo],
        });
      } else {
        await updateDoc(userRef, {
          owns: arrayUnion(data.condo),
        });
      }
    }

    //set key to used
    await updateDoc(docRef, {
      used: true,
    });
  } catch (err) {
    console.error(err);
  }
  return "Condo added!";
}

// returns user data using email
export async function addCondo(data, propertyID, propertyName) {
  var pictureData = data.picture;

  try {
    data["property"] = propertyID;
    const clean = cleanData("Condo", data);
    const docRef = await addDoc(collection(db, "Condo"), clean);
    const docID = docRef.id;

    await updateDoc(docRef, {
      id: docID,
    });

    if (pictureData) {
      try {
        await setPictureWithID(
          data,
          condoPictureRef,
          propertyName + "/" + data["unitNumber"]
        );
      } catch (e) {
        throw new Error("Error adding picture: ", e);
      }
    }
  } catch (e) {
    throw new Error("Error adding document: ", e);
  }
}
// returns user data using email
export async function addProperty(data) {
  var pictureData = data.picture;
  data["companyOwner"] = store("user");
  try {
    const clean = cleanData("Property", data);
    const docRef = await addDoc(collection(db, "Property"), clean);
    if (pictureData) {
      try {
        await setPictureWithID(data, propertyPictureRef, data["propertyName"]);
      } catch (e) {
        throw new Error("Error adding picture: ", e);
      }
    }
    if (data["condos"] != "") {
      try {
        data["condos"].forEach(async function (condoData) {
          await addCondo(condoData, docRef.id, data["propertyName"]);
        });
      } catch (e) {
        throw new Error("Error adding condo: ", e);
      }
    }
  } catch (e) {
    throw new Error("Error adding document: ", e);
  }
}

// Provide: company id
// Returns: array of properties associated with the company
export async function getProperties(companyID) {
  try {
    const propertyCollection = collection(db, "Property");
    const propertySnapshot = await getDocs(propertyCollection);
    var properties = [];

    await Promise.all(
      propertySnapshot.docs.map(async (doc) => {
        if (doc.data().companyOwner == companyID) {
          var data = doc.data();
          data["propertyID"] = doc.id;
          try {
            data["picture"] = await getPropertyPicture(data["propertyName"]);
          } catch (e) {
            throw new Error("Error getting picture: " + e);
          }

          properties.push(data);
        }
      })
    );
    return properties;
  } catch (error) {
    throw new Error("Error getting properties: " + error);
  }
}
// returns all condos associated with a user
export async function getUserCondos(email) {
  try {
    const userCollection = collection(db, "Users");
    const userSnapshot = await getDocs(userCollection);
    const condos = [];

    await Promise.all(
      userSnapshot.docs.map(async (userDoc) => {
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
                } else return null;
              } else return null;
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
                } else return null;
              } else return null;
            });

            const userRentedCondos = await Promise.all(rentedCondoPromises);
            condos.push(...userRentedCondos);
          }
        }
      })
    );

    return condos;
  } catch (e) {
    throw new Error("Error getting condos: " + e);
  }
}
// returns condos based on propertyID
export async function getCondos(propertyID) {
  try {
    const condoCollection = collection(db, "Condo");
    const condoSnapshot = await getDocs(condoCollection);
    var condos = [];
    condoSnapshot.forEach((doc) => {
      if (doc.data().property == propertyID) {
        condos.push(doc.data());
      }
    });
    return condos;
  } catch (e) {
    throw new Error("Error getting condos: ", e);
  }
}

export async function getPropertyData(id) {
    try {
        const docRef = doc(db, "Property", id);
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

//Sprint 3

const sampleAmenity = {
  "amenityID": "1",
  "price": 100,
  "unitNumber": 1,
}


//Provide: property id
//Returns: amenity array associated with a property
export async function getAmenities(propertyID) {
  return [sampleAmenity, sampleAmenity,sampleAmenity]
}

//Provide: property id, number of lockers to create, price of a locker
//Returns: nothing
export async function addLockers(propertyID, count, price) {

}

//Provide: property id, number of parking spots to create, price of a parking spot
//Returns: nothing
export async function addParkings(property, count, price) {
}

//Provide: condo id to assign a locker
//Returns: nothing
export async function assignLocker(condoID) {

}

//Provide: condo id to assign a parking spot
//Returns: nothing
export async function assignParking(condo) {

}

//Provide: condo id 
//Returns: locker amenity associated with the condo
export async function getAssignedLocker(condo) {
   return sampleAmenity
}

//Provide: condo id
//Returns: parking amenity associated with the condo
export async function getAssignedParking(condo) {
  return sampleAmenity
}

//Provide property id, condo file to upload
//Returns: nothing
export async function uploadFile(propertyID, file) {

}

//Provide: property id, updated property JSON
//Returns: nothing
export async function updateProperty(propertyID, data) {

}

//Provide: property id
//Returns: nothing
export async function deleteProperty(propertyID) {

}


