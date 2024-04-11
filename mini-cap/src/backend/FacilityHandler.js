import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  getFirestore,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "./FirebaseConfig";
import { getPropertyData, getUserCondos } from "./PropertyHandler";
import { addReservationNotification } from "./RequestHandler";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

/**
 * Adds a new facility to the amenities collection of a property.
 *
 * @param {Object} facility - The facility object to be added.
 * @param {string} facility.propertyID - The ID of the property to which the facility belongs.
 * @param {string} facility.title - The title of the facility.
 * @param {string} facility.description - The description of the facility.
 *
 *
 * @returns {Promise<DocumentReference>} A promise that resolves with the reference to the newly added facility document.
 * @throws {Error} If there is an error adding the facility.
 */
export async function addFacility(facility) {
  try {
    const propertyRef = doc(db, "Property", facility.propertyID);
    // Retrieve the collection of amenities from the property
    const amenitiesColl = collection(propertyRef, "Facilities");

    // Determine blockSize based on facility type
    let blockSize;
    switch (facility.title) {
      case "Gym":
        blockSize = 1;
        break;
      case "Pool":
        blockSize = 2;
        break;
      case "Spa":
        blockSize = 3;
        break;
      default:
        throw new Error("Invalid facility type.");
    }

    // Calculate dailyAvailabilities based on blockSize
    const dailyAvailabilities = Array.from({ length: 24 / blockSize }, () => 1);

    // Add document to the amenities collection
    const docRef = await addDoc(amenitiesColl, {
      propertyID: facility.propertyID,
      type: facility.title,
      description: facility.description,
      dailyAvailabilities: dailyAvailabilities,
      blockSize: blockSize,
    });
    await updateDoc(docRef, { id: docRef.id });
    return docRef;
  } catch (error) {
    throw error;
  }
}

export async function editFacility(facilityId, updatedFacility) {
  try {
    const facilityRef = doc(
      db,
      "Property",
      updatedFacility.propertyID,
      "Facilities",
      facilityId
    );

    // Determine blockSize based on facility type
    let blockSize;
    switch (updatedFacility.title) {
      case "Gym":
        blockSize = 1;
        break;
      case "Pool":
        blockSize = 2;
        break;
      case "Spa":
        blockSize = 3;
        break;
      default:
        throw new Error("Invalid facility type.");
    }

    // Calculate dailyAvailabilities based on blockSize
    const dailyAvailabilities = Array.from({ length: 24 / blockSize }, () => 1);

    await updateDoc(facilityRef, {
      type: updatedFacility.title,
      description: updatedFacility.description,
      dailyAvailabilities: dailyAvailabilities,
      blockSize: blockSize,
    });

    return { success: true, message: "Facility edited successfully!" };
  } catch (error) {
    return {
      success: false,
      message: `Error editing facility: ${error.message}`,
    };
  }
}

export async function deleteFacility(propertyID, facilityId) {
  try {
    const facilityRef = doc(
      db,
      "Property",
      propertyID,
      "Facilities",
      facilityId
    );

    await deleteDoc(facilityRef);

    return { success: true, message: "Facility deleted successfully!" };
  } catch (error) {
    return {
      success: false,
      message: `Error deleting facility: ${error.message}`,
    };
  }
}

/**
 * Makes a reservation for a facility.
 *
 * @param {Object} reservation - The reservation object.
 * @param {string} reservation.propertyID - The ID of the property where the reservation is made.
 * @param {string} reservation.facilityID - The ID of the facility for which the reservation is made.
 * @param {string} reservation.month - The month of the reservation.
 * @param {string} reservation.date - The date of the reservation.
 * @param {string} reservation.startTime - The start time of the reservation.
 * @param {string} reservation.endTime - The end time of the reservation.
 * @param {string} reservation.userID - The ID of the user making the reservation.
 *
 * @returns {Promise<void>} A promise that resolves when the reservation is successfully made.
 * @throws {Error} If there is an error making the reservation.
 */
export async function makeReservation(reservation) {
  try {
    var month = reservation.month;

    // Get property reference
    const propertyRef = doc(db, "Property", reservation.propertyID);

    // Retrieve the collection of amenities from the property
    const facilityRef = collection(propertyRef, "Facilities");

    // Get facility document reference
    const facility = doc(facilityRef, reservation.facilityID);

    // Get month collection reference
    const monthCollectionRef = collection(facility, month + "");

    // Add a placeholder document in the month collection
    var docRef = await addDoc(monthCollectionRef, {
      date: reservation.date,
      startTime: reservation.startTime,
      endTime: reservation.endTime,
      userID: reservation.userID,
    });

    // Get user document reference
    var userRef = doc(db, "Users", reservation.userID);

    // Get user document data
    var userDoc = await getDoc(userRef);
    var data = userDoc.data();

    // Construct reservation path
    var path = `Property/${reservation.propertyID}/Facilities/${reservation.facilityID}/${month}/${docRef.id}`;

    // Update user document with reservation path
    if (data.hasOwnProperty("reservations")) {
      await updateDoc(userRef, {
        reservations: [...userDoc.data().reservations, path],
      });
    } else {
      await updateDoc(userRef, {
        reservations: [path],
      });
    }
    await addReservationNotification(reservation.userID, reservation);
  } catch (error) {
    throw error;
  }
}

/**
 * Retrieves monthly reservations for a specific facility.
 *
 * @param {string} propertyID - The ID of the property where the facility is located.
 * @param {string} facilityID - The ID of the facility for which reservations are being retrieved.
 * @param {string} month - The month for which reservations are being retrieved.
 *
 * @returns {Promise<Object>} A promise that resolves with an object containing reservations for each date in the specified month.
 * @throws {Error} If there is an error retrieving the reservations.
 */
export async function getMonthlyReservations(propertyID, facilityID, month) {
  try {
    // Get property reference
    const propertyRef = doc(db, "Property", propertyID);

    // Retrieve the collection of amenities from the property
    const facilityRef = collection(propertyRef, "Facilities");

    // Get facility document reference
    const facility = doc(facilityRef, facilityID);

    // Get month collection reference
    const monthCollectionRef = collection(facility, month + "");

    // Get monthly reservations
    const monthCollection = await getDocs(monthCollectionRef);

    // Initialize reservations object
    var reservations = {};

    // Process monthly reservations
    monthCollection.forEach(async (doc) => {
      if (reservations.hasOwnProperty(doc.data().date)) {
        reservations[doc.data().date].push(doc.data().startTime);
      } else {
        reservations[doc.data().date] = [doc.data().startTime];
      }
    });

    return reservations;
  } catch (error) {
    throw error;
  }
}

/**
 * Retrieves facilities associated with a specific property.
 *
 * @param {string} propertyID - The ID of the property for which facilities are being retrieved.
 *
 * @returns {Promise<Array>} A promise that resolves with an array of facility objects associated with the specified property.
 * @throws {Error} If there is an error retrieving the facilities.
 */
export async function getFacilities(propertyID) {
  try {
    // Get property reference
    const propertyRef = doc(db, "Property", propertyID);

    // Retrieve the collection of amenities from the property
    const facilityRef = collection(propertyRef, "Facilities");

    // Get facility collection
    const facilityCollection = await getDocs(facilityRef);

    // Initialize facilities array
    var facilities = [];

    // Process facility documents
    facilityCollection.forEach((docSnapshot) => {
      facilities.push({
        id: docSnapshot.id, // Add the ID of the document here
        ...docSnapshot.data(), // Spread the document data
      });
    });

    return facilities;
  } catch (error) {
    throw error;
  }
}

/**
 * Retrieves properties along with their associated reservations and facilities for a specific user.
 *
 * @param {string} userID - The ID of the user for whom properties are being retrieved.
 *
 * @returns {Promise<Array>} A promise that resolves with an array of property objects, each containing reservations and facilities, associated with the specified user.
 * @throws {Error} If there is an error retrieving the properties, reservations, or facilities.
 */
export async function getPropertiesJoinReservationAndFacilities(userID) {
  try {
    // Get user document reference
    const userRef = doc(db, "Users", userID);
    const userDoc = await getDoc(userRef);

    // Get condos associated with the user
    const condos = await getUserCondos(userID);

    // Get property data for each condo
    var propertiesArray = await Promise.all(
      condos.map(async (condo) => {
        var prop = await getPropertyData(condo.property);
        prop.id = condo.property;
        return prop;
      })
    );

    // Remove duplicate properties
    const uniquePropertyArray = Array.from(
      new Set(propertiesArray.map(JSON.stringify))
    ).map(JSON.parse);

    // Get reservations associated with the user
    const reservations = userDoc.data().reservations;

    // Get properties along with their facilities and reservations
    var propertiesData = await Promise.all(
      uniquePropertyArray.map(async (property) => {
        // Get facilities associated with the property
        property.facilities = await getFacilities(property.id);

        // Get reservations associated with the property
        property.reservations = await Promise.all(
          reservations.map(async (reservation) => {
            if (reservation.split("/")[1] == property.id) {
              var docu = (await getDoc(doc(db, reservation))).data();
              docu.month = reservation.split("/")[4];
              docu.facilityID = reservation.split("/")[3];
              docu.facilityType = property.facilities.find(id => id.id === docu.facilityID).type;
              return docu;
            }
          })
        );

        // Remove any falsy values from reservations array
        property.reservations = property.reservations.filter(Boolean);
        return property;
      })
    );

    return propertiesData;
  } catch (error) {
    throw error;
  }
}

// /**
//  * Retrieves reservation updates for a specific user.
//  *
//  * @param {string} userID - The ID of the user for whom reservation updates are being retrieved.
//  *
//  * @returns {Promise<Array>} A promise that resolves with an array of reservation update objects associated with the specified user.
//  * @throws {Error} If there is an error retrieving the reservation updates.
//  */
// export async function getReservationUpdates(userID) {
//     try {
//         // Get user document reference
//         const userRef = doc(db, "Users", userID);
//         const userDoc = await getDoc(userRef);

//         // Get reservations associated with the user
//         const reservations = userDoc.data().reservations;

//         // Get reservation updates
//         var reservationsData = await Promise.all(reservations.map(async (reservation) => {
//             // Get document for each reservation
//             var docu = await getDoc(doc(db, reservation));
//             var date = docu.data().date;
//             var currentDate = (new Date()).getDate();
//             // Check if reservation date is in the future
//             if (date >= currentDate) {
//                 // Get facility document
//                 var r = (await getDoc(doc(db, reservation))).data();

//                 // Construct new notification object
//                 const newNotification = {
//                     message: r.startTime + "-" + r.endTime,
//                     path: "my-reservations",
//                     date: new Date().toDateString(),
//                     type: facility.data().type,
//                     viewed: false
//                 };

//                 return newNotification;
//             }
//         }));
//         reservationsData = reservationsData.filter(Boolean);
//         return reservationsData;
//     } catch (error) {
//         throw error;
//     }
// }
