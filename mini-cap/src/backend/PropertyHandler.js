import { getFirestore } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import {
  getDocs,
  collection,
  doc,
  addDoc,
  getDoc,
  updateDoc,
  arrayUnion,
    query,
    where
} from "firebase/firestore";
import { cleanData, sortArray } from "./DataCleaner";
import store from "storejs";
import emailjs from "@emailjs/browser";
import { firebaseConfig } from "./FirebaseConfig";
import { setPictureWithID, getPropertyPicture } from "./ImageHandler";
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const condoPictureRef = "condoPictures/";
const propertyPictureRef = "propertyPictures/";
emailjs.init({
  publicKey: "Gw4N_w4eDx939VEBl",
});
// returns user data using email
/**
 * Stores condo key data in the database.
 *
 * @param {object} data - The condo key data to be stored.
 * @returns {Promise} A Promise that resolves with the ID of the stored condo key document.
 * @throws {Error} If an error occurs while storing the condo key data.
 */
export async function storeCondoKey(data) {

  try {
    // Add the condo key data to the "Keys" collection in the database
    const docRef = await addDoc(collection(db, "Keys"), data);

    // Update the newly created condo key document to mark it as unused
    await updateDoc(docRef, {
      used: false,
    });

    // Return the ID of the stored condo key document
    return docRef.id;
  } catch (error) {
    // If an error occurs during the process, throw an error with a descriptive message
    throw new Error("Error adding document: " + error);
  }
}

// returns user data using email
/**
 * Sends a condo key to the specified email address using emailjs.
 *
 * @param {string} email - The email address to which the condo key will be sent.
 * @param {string} key - The condo key to be sent.
 * @returns {void}
 */
export async function sendCondoKey(email, key) {
  // Use emailjs to send the condo key via email
  emailjs
    .send(
      "service_htocwjs", // Email service ID
      "template_h1oyvhl", // Email template ID
      { to_recipient: email, message: key }, // Email parameters
      {
        publicKey: "Gw4N_w4eDx939VEBl", // Public key for authentication
      }
    )
    .then();
}
/**
 * Links a condo to a user based on a provided key.
 *
 * @param {string} email - The email address of the user.
 * @param {string} key - The key used to link the condo to the user.
 * @returns {Promise<string>} A Promise that resolves with a message indicating the result of the operation.
 */
export async function linkCondoToUser(email, key) {
  try {
    // Retrieve the document reference for the provided key from the "Keys" collection
    const docRef = doc(db, "Keys", key);
    // Fetch the snapshot of the key document
    const docSnap = await getDoc(docRef);
    let data;

    // Check if the key document exists
    if (docSnap.exists()) {
      // Retrieve the data from the key document
      data = docSnap.data();
    } else {
      // If the key document does not exist, return a message indicating that the key is not valid
      throw new Error("This key is not valid");
    }
    // Check if the key is associated with the provided email address
    if (data.email !== email) {
      throw new Error("This key is not associated with your email");
    }
    // Check if the key has already been used
    if (data.used) {
      throw new Error("This key has already been used");
    }
    // Retrieve the document reference for the user from the "Users" collection
    const userRef = doc(db, "Users", email);
    // Fetch the snapshot of the user document
    const userSnap = await getDoc(userRef);

    // Update user data based on the role specified in the key
    const userData = userSnap.data();
    var status
    userData.rents = userData.rents || [];
    userData.owns = userData.owns || [];
    try{
      if(data.role === "renter"){
        status = "Rented"
        userData.rents.push(data.condo);
        userData.rents = [...new Set(userData.rents)];
      }
      else if(data.role === "owner"){
        status = "Owned"
        userData.owns.push(data.condo);
        userData.owns = [...new Set(userData.owns)];
      }
    }
    catch(e){
      throw new Error("Error updating user data: " + e);
    }
    // Update user's "rents" field with the condo ID
    try{
      await updateDoc(userRef, userData);
    }catch(e){
      throw new Error("Error updating user data: " + e);
    }
    // Update condo status to "Rented"
    try{
        await updateDoc(doc(db, "Condo", data.condo), {
        status: status,
        occupant: data.email
      });
    } catch(e){
      throw new Error("Error updating condo data: " + e);
    }
    
    // Mark the key as used
    await updateDoc(docRef, {
      used: true,
    });

    // Return a message indicating that the condo has been successfully linked to the user
    return "Condo added!";
  } catch (error) {
     throw new Error("Error linking condo to user: " + error);
  }
}

// returns user data using email
/**
 * Adds a condo to the database.
 *
 * @param {object} data - The condo data to be added.
 * @param {string} propertyID - The ID of the property to which the condo belongs.
 * @param {string} propertyName - The name of the property to which the condo belongs.
 * @returns {Promise<string>} A Promise that resolves with the ID of the added condo document.
 * @throws {Error} If an error occurs while adding the condo document.
 */
export async function addCondo(data, propertyID, propertyName) {
  // Extract picture data from the provided data
  var pictureData = data.picture;

  try {
    // Set the "property" field of the condo data to the provided property ID
    data["property"] = propertyID;

    // Clean the condo data and prepare it for insertion into the database
    const clean = cleanData("Condo", data);

    // Add the cleaned condo data to the "Condo" collection in the database
    const docRef = await addDoc(collection(db, "Condo"), clean);

    // Get the ID of the added condo document
    const docID = docRef.id;

    // Update the added condo document with additional fields
    await updateDoc(docRef, {
      id: docID,
      occupant: "",
      status: "Vacant",
    });

    const propertyRef = doc(db, "Property", propertyID);
    // Fetch the snapshot of the property document
    const amenitiesRef = collection(propertyRef, "Amenities");
    const amenitiesSnapshot = await getDocs(amenitiesRef);

    if(data.parkingNumber){
      await assignParking(docID);
    }else{
      await updateDoc(docRef, {
        parkingNumber: "No Parking",
      });
    }

    if(data.lockerNumber){
      await assignLocker(docID);
    }else{
      await updateDoc(docRef, {
        lockerNumber: "No Locker",
      });
    }

    // If picture data is provided, add the picture to storage
    if (pictureData) {
      try {
        await setPictureWithID(
          data,
          condoPictureRef,
          propertyName + "/" + data["unitNumber"]
        );
      } catch (error) {
        // If an error occurs while adding the picture, throw an error with a descriptive message
        throw new Error("Error adding picture: " + error);
      }
    }

    // Return the ID of the added condo document
    return docID;
  } catch (error) {
    // If an error occurs during the process, throw an error with a descriptive message
    throw new Error("Error adding document: " + error);
  }
}

/**
 * Adds a property to the database.
 *
 * @param {object} data - The property data to be added.
 * @returns {Promise<void>} A Promise that resolves when the property and associated condos are successfully added.
 * @throws {Error} If an error occurs while adding the property or associated condos.
 */
export async function addProperty(data) {
  // Extract picture data from the provided data
  var pictureData = data.picture;

  // Set the "companyOwner" field of the property data using store("user") function
  data["companyOwner"] = store("user");

  try {
    // Clean the property data and prepare it for insertion into the database
    const clean = cleanData("Property", data);

    // Add the cleaned property data to the "Property" collection in the database
    const docRef = await addDoc(collection(db, "Property"), clean);

    // If picture data is provided, add the picture to storage
    if (pictureData) {
      try {
        await setPictureWithID(data, propertyPictureRef, data["propertyName"]);
      } catch (error) {
        // If an error occurs while adding the picture, throw an error with a descriptive message
        throw new Error("Error adding picture: " + error);
      }
    }

    // If condo data is provided, add each condo associated with the property
    if (data["condos"] != "") {
      try {
        data["condos"].forEach(async function (condoData) {
          await addCondo(condoData, docRef.id, data["propertyName"]);
        });
      } catch (error) {
        // If an error occurs while adding a condo, throw an error with a descriptive message
        throw new Error("Error adding condo: " + error);
      }
    }
    //Add workers for the new property
    const workersRef = collection(docRef, "Workers")
    await addDoc(workersRef, {
      type: "Financial",
      name: data.propertyName + " Financial Worker",
    });
    await addDoc(workersRef, {
      type: "Administrative",
      name: data.propertyName + " Administrative Worker",
    });
    await addDoc(workersRef, {
      type: "Operational",
      name: data.propertyName + " Operational Worker",
    });

    //add all parking spots in new property
    await addParkings(docRef.id, data.parkingCount, data.parkingCost);

    //add all lockers in new property
    await addLockers(docRef.id, data.lockerCount, data.lockerCost);

  } catch (error) {
    // If an error occurs during the process, throw an error with a descriptive message
    throw new Error("Error adding document: " + error);
  }
}

/**
 * Retrieves properties associated with a company.
 *
 * @param {string} companyID - The ID of the company whose properties are to be retrieved.
 * @returns {Promise<Array<object>>} A Promise that resolves with an array of properties associated with the company.
 * Each property object contains property data along with additional propertyID and picture fields.
 * @throws {Error} If an error occurs while retrieving properties or property pictures.
 */
export async function getProperties(companyID) {
  try {
    // Retrieve the collection of properties from the database
    const propertyCollection = collection(db, "Property");
    // Fetch snapshots of properties from the collection
    const propertySnapshot = await getDocs(propertyCollection);
    // Initialize an array to store properties associated with the specified company
    var properties = [];

    // Asynchronously process each property snapshot
    await Promise.all(
      propertySnapshot.docs.map(async (doc) => {
        // Check if the property belongs to the specified company
        if (doc.data().companyOwner == companyID) {
          // Extract property data from the snapshot
          var data = doc.data();
          // Add propertyID field to the property data
          data["propertyID"] = doc.id;
          try {
            // Retrieve the picture associated with the property
            data["picture"] = await getPropertyPicture(data["propertyName"]);
          } catch (error) {
            // If an error occurs while retrieving the picture, throw an error with a descriptive message
            throw new Error("Error getting picture: " + error);
          }

          // Push the property data to the properties array
          properties.push(data);
        }
      })
    );
    // Sort the properties array by propertyName and return it

    return sortArray(properties, "propertyName");
  } catch (error) {
    // If an error occurs during the process, throw an error with a descriptive message
    throw new Error("Error getting properties: " + error);
  }
}

// returns all condos associated with a user
/**
 * Retrieves condos associated with a user based on their email address.
 *
 * @param {string} email - The email address of the user.
 * @returns {Promise<Array<object>>} A Promise that resolves with an array of condos associated with the user.
 * Each condo object contains condo data along with additional property information and user type.
 * @throws {Error} If an error occurs while retrieving condos or associated property information.
 */

export async function getUserCondos(email) {
  try {
      const userRef = doc(db, "Users", email);
      const userSnap = await getDoc(userRef);
      const userData = userSnap.data();
      const rents = userData.rents;
      const owns = userData.owns;
      const condos = userData.owns.concat(userData.rents);

      const condoDataPromises = condos.map(async (condoId) => {
          const condoDocRef = doc(db, "Condo", condoId);
          const condoDoc = await getDoc(condoDocRef);

          if (condoDoc.exists()) {
              const condoData = condoDoc.data();
              const propertyDocRef = doc(db, "Property", condoData.property);
              const propertyDoc = await getDoc(propertyDocRef);

              if (propertyDoc.exists()) {
                  condoData.property = propertyDoc.data().address;
                  condoData.propertyName = propertyDoc.data().propertyName;
                  return condoData;
              } else return null;
          } else return null;
      });

      const resolvedCondoData = await Promise.all(condoDataPromises);

      resolvedCondoData.forEach(condo => {
          if (rents.includes(condo.id)) {
              condo.userType = "Renter";
          } else if (owns.includes(condo.id)) {
              condo.userType = "Owner";
          }
      });

      // Filter out null values and sort the condos array by unitNumber
      const filteredCondos = resolvedCondoData.filter(condo => condo !== null);
      return sortArray(filteredCondos, "unitNumber");
  } catch (error) {
      throw new Error("Error getting condos: " + error);
  }
}


// returns condos based on propertyID
/**
 * Retrieves condos associated with a property.
 *
 * @param {string} propertyID - The ID of the property whose condos are to be retrieved.
 * @returns {Promise} A Promise that resolves with an array of condos associated with the property.
 * @throws {Error} If an error occurs while retrieving condos.
 */
export async function getCondos(propertyID) {
  try {
    // Retrieve the collection of condos from the database
    const condoCollection = collection(db, "Condo");
    // Fetch snapshots of condos from the collection
    const condoSnapshot = await getDocs(condoCollection);

    // Initialize an array to store condos associated with the specified property
    var condos = [];

    // Iterate through each condo snapshot
    condoSnapshot.forEach((doc) => {
      // Check if the condo belongs to the specified property
      if (doc.data().property === propertyID) {
        // If the condo belongs to the property, add it to the condos array
        condos.push(doc.data());
      }
    });


    // Sort the condos array by unit number
    return sortArray(condos, "unitNumber");
  } catch (error) {
    // If an error occurs, throw an error with a descriptive message
    throw new Error("Error getting condos: " + error);

  }
}

/**
 * Retrieves specific condo document data with additional property information.
 *
 * @param {string} condoID - The ID of the condo document to retrieve.
 * @returns {Promise<object|null>} A Promise that resolves with the condo data including additional property information,
 * or null if the condo document does not exist or property information cannot be retrieved.
 * @throws {Error} If an error occurs while retrieving the condo document or property information.
 */
export async function getCondo(condoID) {
  try {
    // Retrieve the document reference for the specified condo ID from the "Condo" collection
    const docRef = doc(db, "Condo", condoID);
    // Fetch the snapshot of the condo document
    const docSnap = await getDoc(docRef);

    // Extract condo data from the snapshot
    const condoData = docSnap.data();


    // Check if the condo document exists
    if (docSnap.exists) {
      // Retrieve the document reference for the property associated with the condo

      const propertyDocRef = doc(db, "Property", condoData.property);
      // Fetch the snapshot of the property document
      const propertyDoc = await getDoc(propertyDocRef);


      // Check if the property document exists
      if (propertyDoc.exists) {
        // Update condo data with additional property information

        condoData.address = propertyDoc.data().address;
        condoData.propertyName = propertyDoc.data().propertyName;
        condoData.propertyID = propertyDoc.id;
      } else {
        // If the property document does not exist, return null
        return null;
      }

      // Return the condo data with additional property information
      return condoData;
    } else {
      // If the condo document does not exist, log a message and return null
      return null;
    }
  } catch (error) {
    // Rethrow the error to propagate it up the call stack
    throw error;
  }
}

/**
 * Retrieves property data for a specified ID.
 *
 * @param {string} id - The ID of the property to retrieve data for.
 * @returns {Promise<object|null>} Resolves with the property data if found, otherwise null.
 * @throws {Error} If an error occurs during the retrieval process.
 */
export async function getPropertyData(id) {
    // Get document reference for the specified property ID
    const docRef = doc(db, "Property", id);
    // Fetch document snapshot
    const docSnap = await getDoc(docRef);

    // Check if document exists
    if (docSnap.exists()) {
      // Return property data
      return docSnap.data();
    } 
    // Return null if document not found
    return null;
  
}

//Sprint 3

const sampleAmenity = {

  "amenityID": "1",
  "price": 100,
  "unitNumber": 1,
}

const sampleFinacialDetails = {
  "BasePrice" : 100,
  "ParkingPrice" : 10,
  "LockerPrice" : 10,
  "AdditionalFees" : 0,
  "TotalPrice" : 120
}

const sampleIsPaid = {
  "RentPaid" : true
}



/**
 * Retrieves a list of amenities associated with a property.
 *
 * @param propertyID The ID of the property for which amenities are to be fetched.
 * @return A list of amenities associated with the property.
 * @throws Error If an error occurs while fetching amenities.
 */
export async function getAmenities(propertyID) {
  try {
    const propertyRef = doc(db, "Property", propertyID);
    // Retrieve the collection of amenities from the property
    const amenitiesColl = collection(propertyRef, "Amenities");
    // Fetch snapshots of amenities from the collection
    const amenitiesSnap = await getDocs(amenitiesColl);

    // Initialize an array to store amenities
    var amenities = [];

    // Iterate through each amenities snapshot
    amenitiesSnap.forEach((doc) => {
      amenities.push(doc.data());
    });

    return amenities;
  } catch (error) {
    // If an error occurs, throw an error with a descriptive message
    throw new Error("Error getting condos: " + error);
  }
}

/**
 * Adds a specified number of lockers to a property's amenities.
 *
 * @param {string} propertyID The ID of the property to which the lockers will be added.
 * @param {number} count The number of lockers to add.
 * @param {number} price The price of each locker.
 * @returns {Promise<void>} A promise that resolves when the lockers are successfully added.
 * @throws {Error} If an error occurs while adding the lockers.
 */
export async function addLockers(propertyID, count, price) {
  try {
    const propertyRef = doc(db, "Property", propertyID);
    // Retrieve the collection of amenities from the property
    const amenitiesColl = collection(propertyRef, "Amenities");
    // Create a query to filter documents based on the field value
    const q = query(amenitiesColl, where("type", '==', "Lockers"));
    // Fetch snapshots of documents that match the query
    const querySnapshot = await getDocs(q);

    let lockerNumber = querySnapshot.size + 1;
    // Add all lockers in property
    for(let i = 1; i<=count; i++){
      await addDoc(amenitiesColl, {
        available: true,
        condo: "",
        number: lockerNumber,
        price: price,
        type: "Locker"
      });
      lockerNumber++;
    }

  } catch (error) {
    // If an error occurs, throw an error with a descriptive message
    throw new Error("Error getting condos: " + error);
  }
}

/**
 * Adds a specified number of parking spaces to a property's amenities.
 *
 * @param {string} propertyID The ID of the property to which the parking spaces will be added.
 * @param {number} count The number of parking spaces to add.
 * @param {number} price The price of each parking space.
 * @returns {Promise<void>} A promise that resolves when the parking spaces are successfully added.
 * @throws {Error} If an error occurs while adding the parking spaces.
 */
export async function addParkings(propertyID, count, price) {
  try {
    const propertyRef = doc(db, "Property", propertyID);
    // Retrieve the collection of amenities from the property
    const amenitiesColl = collection(propertyRef, "Amenities");
    // Create a query to filter documents based on the field value
    const q = query(amenitiesColl, where("type", '==', "Parkings"));
    // Fetch snapshots of documents that match the query
    const querySnapshot = await getDocs(q);

    let parkingNumber = querySnapshot.size + 1;
    // Add all parking spaces in property
    for(let i = 1; i<=count; i++){
      await addDoc(amenitiesColl, {
        available: true,
        condo: "",
        number: parkingNumber,
        price: price,
        type: "Parking"
      });
      parkingNumber++;
    }

  } catch (error) {
    // If an error occurs, throw an error with a descriptive message
    throw new Error("Error getting condos: " + error);
  }
}

/**
 * Assigns a locker to a condo based on availability.
 *
 * @param {string} condoID The ID of the condo to which a locker will be assigned.
 * @returns {Promise<void>} A promise that resolves when the locker is successfully assigned.
 * @throws {Error} If an error occurs while assigning the locker.
 */
export async function assignLocker(condoID) {
  // Get document reference for the specified condo ID
  const condoDocRef = doc(db, "Condo", condoID);
  // Fetch document snapshot
  const condoDocSnap = await getDoc(condoDocRef);
  const propertyID = condoDocSnap.data().property


  const propertyRef = doc(db, "Property", propertyID);
  // Fetch the snapshot of the property document
  const amenitiesRef = collection(propertyRef, "Amenities");
  const amenitiesSnapshot = await getDocs(amenitiesRef);

  //assign condo to free locker in property
  let availableLockers = await Promise.all(amenitiesSnapshot.docs.map(async (doc) => {
    if (doc.data().available == true && doc.data().type == "Locker") {
      return doc;
    }
  }));

  availableLockers = availableLockers.filter(doc => doc !== undefined);

  if (availableLockers.length > 0) {
    //update locker document with condo info
    await updateDoc(availableLockers[0].ref, {
      condo: docID,
      available: false
    });
    //update condo document with parking number
    await updateDoc(docRef, {
      lockerNumber: availableLockers[0].data().number,
    });
  } else {
    throw new Error("No available lockers");
  }
}

/**
 * Assigns a parking space to a condo based on availability.
 *
 * @param {string} condoID The ID of the condo to which a parking space will be assigned.
 * @returns {Promise<void>} A promise that resolves when the parking space is successfully assigned.
 * @throws {Error} If an error occurs while assigning the parking space.
 */
export async function assignParking(condoID) {
  // Get document reference for the specified condo ID
  const condoDocRef = doc(db, "Condo", condoID);
  // Fetch document snapshot
  const condoDocSnap = await getDoc(condoDocRef);
  const propertyID = condoDocSnap.data().property

  const propertyRef = doc(db, "Property", propertyID);
  // Fetch the snapshot of the property document
  const amenitiesRef = collection(propertyRef, "Amenities");
  const amenitiesSnapshot = await getDocs(amenitiesRef);

  //assign condo to free parking in property
  var availableParkings = await Promise.all(amenitiesSnapshot.docs.map(async (doc) => {
    if (doc.data().available == true && doc.data().type == "Parking") {
      return doc;
    }
  }));

  availableParkings = availableParkings.filter(doc => doc !== undefined);

  if (availableParkings.length > 0) {
    //update parking document with condo info
    await updateDoc(availableParkings[0].ref, {
      condo: docID,
      available: false
    });
    //update condo document with parking number
    await updateDoc(docRef, {
      parkingNumber: availableParkings[0].data().number,
    });
  } else {
    throw new Error("No available parking spots");
  }
}

/**
 * Retrieves the locker assigned to a condo.
 *
 * @param {string} condoID The ID of the condo for which to retrieve the assigned locker.
 * @returns {Promise<Object>} A promise that resolves with the data of the assigned locker document.
 * @throws {Error} If no associated locker is found.
 */
export async function getAssignedLocker(condoID) {
  const condoDocRef = doc(db, "Condo", condoID);
  // Fetch document snapshot
  const condoDocSnap = await getDoc(condoDocRef);
  const propertyID = condoDocSnap.data().property

  const propertyRef = doc(db, "Property", propertyID);
  // Fetch the snapshot of the property document
  const amenitiesRef = collection(propertyRef, "Amenities");
  const amenitiesSnapshot = await getDocs(amenitiesRef);

  var assignedLockerArr = await Promise.all(amenitiesSnapshot.docs.map(async (doc) => {
    if (doc.data().condo == condoID && doc.data().type == "Locker") {
      return doc;
    }
  }));

  assignedLockerArr = assignedLockerArr.filter(doc => doc !== undefined);

  if (assignedLockerArr.length > 0) {
    return assignedLockerArr[0].data();
  } else {
    throw new Error("No associated locker found");
  }

}

/**
 * Retrieves the parking space assigned to a condo.
 *
 * @param {string} condoID The ID of the condo for which to retrieve the assigned parking space.
 * @returns {Promise<Object>} A promise that resolves with the data of the assigned parking space document.
 * @throws {Error} If no associated parking space is found.
 */
export async function getAssignedParking(condoID) {
  const condoDocRef = doc(db, "Condo", condoID);
  // Fetch document snapshot
  const condoDocSnap = await getDoc(condoDocRef);
  const propertyID = condoDocSnap.data().property

  const propertyRef = doc(db, "Property", propertyID);
  // Fetch the snapshot of the property document
  const amenitiesRef = collection(propertyRef, "Amenities");
  const amenitiesSnapshot = await getDocs(amenitiesRef);

  var assignedParkingArr = await Promise.all(amenitiesSnapshot.docs.map(async (doc) => {
    if (doc.data().condo == condoID && doc.data().type == "Parking") {
      return doc;
    }
  }));

  assignedParkingArr = assignedParkingArr.filter(doc => doc !== undefined);

  if (assignedParkingArr.length > 0) {
    return assignedParkingArr[0].data();
  } else {
    throw new Error("No associated parking found");
  }
}

//Provide: property id, updated property JSON
//Returns: nothing
export async function updateProperty(propertyID, data) {
  console.log("Updating property: ", propertyID, data);
}

//Provide: property id
//Returns: nothing
export async function deleteProperty(propertyID) {
  console.log("Deleting property: ", propertyID);
}

//Provide: condoID
//Returns: fees associated to the condo
export async function getFinanceDetails() {
  return sampleFinacialDetails
}

//Provide: condoID
//Returns: Boolean
export async function checkRentPaid() {
  return sampleIsPaid
}
//returns the occupant email or empty string for the condo

/**
 * Retrieves the occupant of a specified condo.
 *
 * @param {string} condoId - The ID of the condo to retrieve the occupant for.
 * @returns {Promise<string|null>} Resolves with the occupant's email if found, otherwise null.
 * @throws {Error} If an error occurs during the retrieval process.
 */
export async function getCondoOccupant(condoId) {
  try {
    // Get document reference for the specified condo ID
    const condoDocRef = doc(db, "Condo", condoId);
    // Fetch document snapshot
    const condoDocSnap = await getDoc(condoDocRef);

    // Check if condo document exists
    if (condoDocSnap.exists) {
      // Extract occupant from condo data
      const { occupant } = condoDocSnap.data();
      return occupant;
    } else {
      // Return null if condo document not found
      return null;
    }
  } catch (error) {
    // Throw error to propagate it up the call stack
    throw error;
  }
}

/**
 * Calculates the fees for a condominium based on its amenities and status (rented or owned).
 * Will return only monthly fees for a renter, and monthly and total fees for an owner
 * @param {string} condoId - The ID of the condominium.
 * @returns {Promise<{monthlyFees: number, totalFees: number}|null>} A promise that resolves with an object containing the monthly fees and total fees if successful, or null if there was an error.
 */
export async function calculateCondoFees(condoId) {
  try {
    // Retrieve the document reference for the specified condo ID from the "Condo" collection
    const docRef = doc(db, "Condo", condoId);
    // Fetch the snapshot of the condo document
    const docSnap = await getDoc(docRef);

    // Extract condo data from the snapshot
    const condoData = docSnap.data();

    let amenitiesPrice = 0;
    // Check if the condo document exists
    if (docSnap.exists) {
      // Retrieve the document reference for the property associated with the condo
      const propertyDocRef = doc(db, "Property", condoData.property);
      // Fetch the snapshot of the property document
      const propertyDoc = await getDoc(propertyDocRef);

      // Check if the property document exists
      if (propertyDoc.exists) {
        const amenitiesCollection = collection(propertyDocRef, "Amenities");
        const amenitiesSnapshot = await getDocs(amenitiesCollection);

        //Get all amenities for the condo and add their price
        amenitiesSnapshot.docs.map(async doc => {
          let tempData = doc.data();
          if(tempData.condo == condoId)
            amenitiesPrice += tempData.price;
        });
      } else {
        // If the property document does not exist, return null
        return null;
      }

      let totalPrice = amenitiesPrice + condoData.unitPrice;

      //If rented: return price of amenities + price of condo per month
      //If owned: return monthly price of amenities, and return total fees which are monthly + remaining condo payments
      if (condoData.status == "Rented"){
        return {monthlyFees: totalPrice, totalFees: null};
      } else {
        return {monthlyFees: amenitiesPrice, totalFees: totalPrice};
      }

    } else {
      // If the condo document does not exist, log a message and return null
      return null;
    }
  } catch (error) {
    // Rethrow the error to propagate it up the call stack
    throw error;
  }
}
