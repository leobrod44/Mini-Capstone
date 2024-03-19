import { initializeApp } from "firebase/app";
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  deleteDoc,
  getFirestore,
} from "firebase/firestore";
import { cleanData } from "./DataCleaner";
import store from "storejs";
import emailjs from "@emailjs/browser";
import { MANAGEMENT_COMPANY, RENTER_OWNER } from "./Constants";
import { firebaseConfig } from "./FirebaseConfig";
import { setPicture } from "./ImageHandler";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const profilePictureRef = "profilePictures/";
emailjs.init({
  publicKey: "Gw4N_w4eDx939VEBl",
});

/**
 * Retrieves user data associated with the specified email.
 * 
 * @param {string} email - The email of the user whose data is being retrieved.
 * @returns {Promise<object|null>} A Promise that resolves with the user data if found, or null if the document does not exist or an error occurs.
 */
export async function getUserData(email) {
  try {
      // Get reference to the user document using the email
      const docRef = doc(db, "Users", email);
      // Get snapshot of the user document
      const docSnap = await getDoc(docRef);

      // Check if the user document exists
      if (docSnap.exists()) {
          // Return the data of the user document
          return docSnap.data();
      } else {
          // return null if the document does not exist
          return null;
      }
  } catch (err) {
      return null;
  }
}


/**
 * Retrieves company data associated with the specified email.
 * 
 * @param {string} email - The email of the company whose data is being retrieved.
 * @returns {Promise<object|null>} A Promise that resolves with the company data if found, or null if the document does not exist or an error occurs.
 */
export async function getCompanyData(email) {
  try {
      // Get reference to the company document using the email
      const docRef = doc(db, "Company", email);
      // Get snapshot of the company document
      const docSnap = await getDoc(docRef);

      // Check if the company document exists
      if (docSnap.exists()) {
          // Return the data of the company document
          return docSnap.data();
      } else {  
            // return null if the document does not exist
          return null;
      }
  } catch (err) {
      // Log any errors that occur during the process
      return null;
  }
}


/**
 * Updates user information associated with the specified email.
 * 
 * @param {string} email - The email of the user whose information is being updated.
 * @param {object} data - An object containing the updated user information.
 * @returns {Promise<void>} A Promise that resolves when the user information is successfully updated.
 */
export async function updateUserInfo(email, data) {
  try {
      // Get reference to the user document using the email
      const docRef = doc(db, "Users", email);
      // Update the user document with the provided data
      await updateDoc(docRef, {
          firstName: data.firstName,
          lastName: data.lastName,
          phoneNumber: data.phoneNumber,
      });
  } catch (err) {
        throw err;
  }
}


/**
 * Updates company information associated with the specified email.
 * 
 * @param {string} email - The email of the company whose information is being updated.
 * @param {object} data - An object containing the updated company information.
 * @returns {Promise<void>} A Promise that resolves when the company information is successfully updated.
 */
export async function updateCompanyInfo(email, data) {
  try {
      // Get reference to the company document using the email
      const docRef = doc(db, "Company", email);
      // Update the company document with the provided data
      await updateDoc(docRef, {
          companyName: data.companyName,
          phoneNumber: data.phoneNumber,
      });
  } catch (err) {
      throw err;
  }
}


/**
 * Sends an email to the user with a link to reset password.
 * 
 * @param {string} email - The email of the user whose password is being changed.
 * @param {object} data - An object containing password change data including current and new passwords.
 * @returns {Promise<object>} A Promise that resolves with a success message if the password is updated successfully.
 * @throws {Error} If the current password is incorrect, new password is the same as the previous one, or user document cannot be found.
 */
export async function changePassword(email, data) {
  try {
      // Check if user document exists
      const userDoc = await getDoc(doc(db, "Users", data["email"]));
      const companyDoc = await getDoc(doc(db, "Company", data["email"]));
      const userDocData = userDoc.data();
      const companyDocData = companyDoc.data();

      if (userDoc.exists()) {
          if (userDocData.password !== data.currentPassword) {
              throw new Error("Incorrect current password");
          } else if (userDocData.password === data.newPassword) {
              throw new Error("New password cannot be the same as the previous password");
          }

          // Update user document with new password
          await updateDoc(doc(db, "Users", email), {
              password: data.newPassword,
          });
      } else if (companyDoc.exists()) {
          if (companyDocData.password !== data.currentPassword) {
              throw new Error("Incorrect current password");
          } else if (companyDocData.password === data.newPassword) {
              throw new Error("New password cannot be the same as the previous password");
          }

          // Update company document with new password
          await updateDoc(doc(db, "Company", email), {
              password: data.newPassword,
          });
      } else {
          throw new Error("Cannot find user");
      }

      // Return success message
      return { message: "Password updated successfully" };
  } catch (error) {
      // Throw any errors that occur during the process
      throw error;
  }
}


/**
 * Checks if an email exists in the user collection.
 * 
 * @param {string} email - The email to check for existence.
 * @returns {Promise<void>} A Promise that resolves if the email exists in the user collection.
 * @throws {Error} If the email does not exist in the user collection.
 */
export async function checkEmailExists(email) {
  try {
      const userDoc = await getDoc(doc(db, "Users", email));
      if (!userDoc.exists()) {
          throw new Error("Cannot find any users with this email.");
      }
  } catch (error) {
      // Throw any errors that occur during the process
      throw new Error(error);
  }
}

/**
 * Adds a new user.
 * 
 * @param {object} data - An object containing user data including email, profile picture, and other details.
 * @returns {Promise<void>} A Promise that resolves if the user is successfully added.
 * @throws {Error} If the user or company already exists, or if there's an error adding the picture or document.
 */
export async function addUser(data) {
  try {
      // Check if user or company already exists
      const userDoc = await getDoc(doc(db, "Users", data["email"]));
      const companyDoc = await getDoc(doc(db, "Company", data["email"]));
      if (userDoc.exists()) {
          throw new Error("User already exists.");
      } else if (companyDoc.exists()) {
          throw new Error("Company already exists.");
      }

      // Add profile picture
      try {
          await setPicture(data, profilePictureRef);
      } catch (error) {
          throw new Error("Error adding picture: " + error.message);
      }

      // Store user data
      try {
          await storeData("Users", data, data["email"]);
          store("user", data["email"]);
          store("role", RENTER_OWNER);
          window.location.href = "/";
      } catch (error) {
          throw new Error("Error adding document: " + error.message);
      }
  } catch (error) {
      // Throw any errors that occur during the process
      throw new Error(error);
  }
}


/**
 * Adds a new company.
 * 
 * @param {object} data - An object containing company data including email, profile picture, and other details.
 * @returns {Promise<void>} A Promise that resolves if the company is successfully added.
 * @throws {Error} If the user or company already exists, or if there's an error adding the picture or document.
 */
export async function addCompany(data) {
  try {
      // Check if user or company already exists
      const userDocRef = doc(db, "Users", data["email"]);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
          throw new Error("User already exists.");
      }
      const companyDocRef = doc(db, "Company", data["email"]);
      const companyDoc = await getDoc(companyDocRef);
      if (companyDoc.exists()) {
          throw new Error("Company already exists.");
      }

      // Add profile picture
      try {
          await setPicture(data, profilePictureRef);
      } catch (error) {
          throw new Error("Error adding picture: " + error.message);
      }

      // Store company data
      try {
          await storeData("Company", data, data["email"]);
          store("user", data["email"]);
          store("role", MANAGEMENT_COMPANY);
          window.location.href = "/";
      } catch (error) {
          throw new Error("Error adding document: " + error.message);
      }
  } catch (error) {
      // Throw any errors that occur during the process
      throw new Error(error.message);
  }
}

/**
 * Stores data in a specified collection.
 * 
 * @param {string} collection - The name of the collection to store data in.
 * @param {object} data - The data to be stored in the collection.
 * @param {string} key - The key to identify the document in the collection.
 * @returns {Promise<void>} A Promise that resolves if the data is successfully stored.
 * @throws {Error} If there's an error adding the document to the collection.
 */
export async function storeData(collection, data, key) {
  try {
      // Clean the data
      const clean = cleanData(collection, data);
      
      // Set the document in the collection
      const docRef = await setDoc(doc(db, collection, key), clean)
          .then((res) => {
          })
          .catch((err) => {
              throw new Error(err);
          });

      return docRef;
  } catch (error) {
      // Throw an error if there's any issue with adding the document
      throw new Error("Error adding document: " + error.message);
  }
}

/**
 * Deletes user or company account based on the provided email.
 * 
 * @param {string} email - The email associated with the account to be deleted.
 * @returns {Promise<void>} A Promise that resolves if the account is successfully deleted.
 * @throws {Error} If the account does not exist or if there's an error during deletion.
 */
export async function deleteAccount(email) {
  try {
      // Check if the user exists
      const userDoc = await getDoc(doc(db, "Users", email));
      
      // Check if the company exists
      const companyDoc = await getDoc(doc(db, "Company", email));

      // Delete the account if it exists
      if (userDoc.exists()) {
          await deleteDoc(doc(db, "Users", email));
          store.remove("user");
          store.remove("role");
      } else if (companyDoc.exists()) {
          await deleteDoc(doc(db, "Company", email));
          store.remove("user");
          store.remove("role");
      } else {
          throw new Error("User does not exist.");
      }
  } catch (error) {
      // Throw an error if the account does not exist or if there's an error during deletion
      throw new Error(error.message);
  }
}

/**
 * Logs in a user or company based on the provided email and password.
 * 
 * @param {object} data - The object containing login information (email and password).
 * @returns {Promise<void>} A Promise that resolves if the login is successful.
 * @throws {Error} If the password is incorrect, the user or company does not exist, or if there's an error during login.
 */
export async function loginUser(data) {
  try {
      // Get the user document
      const userDoc = await getDoc(doc(db, "Users", data["email"]));
      
      // Get the company document
      const companyDoc = await getDoc(doc(db, "Company", data["email"]));

      // Store the user email
      store("user", data["email"]);

      // Check if the user exists
      if (userDoc.exists()) {
          // Check if the password matches
          if (data["password"] != userDoc.data().password) {
              throw new Error("Incorrect password.");
          }
          // Set the user role
          store("role", RENTER_OWNER);
      } else if (companyDoc.exists()) {
          // Check if the password matches
          if (data["password"] != companyDoc.data().password) {
              throw new Error("Incorrect password.");
          }
          // Set the company role
          store("role", MANAGEMENT_COMPANY);
      } else {
          throw new Error("User does not exist.");
      }

      // Redirect to home page after successful login
      window.location.href = "/";
  } catch (error) {
      // Throw an error if the password is incorrect, user or company does not exist, or if there's an error during login
      throw new Error(error);
  }
}


/**
 * Fetches the email of the company that owns the property associated with the provided condo ID.
 * 
 * @param {string} condoId - The ID of the condo.
 * @returns {Promise<string|null>} A Promise that resolves with the email of the company owner if successful, otherwise null.
 * @throws {Error} If there's an error during the process.
 */
export async function getCompanyEmail(condoId) {
  try {
      // Get the condo document
      const condoDocRef = doc(db, 'Condo', condoId);
      const condoDocSnap = await getDoc(condoDocRef);

      // Check if the condo document exists
      if (condoDocSnap.exists()) {
          // Get the property ID associated with the condo
          const propertyId = condoDocSnap.data().property;

          // Get the property document
          const propertyDocRef = doc(db, 'Property', propertyId);
          const propertyDocSnap = await getDoc(propertyDocRef);

          // Check if the property document exists
          if (propertyDocSnap.exists()) {
              // Get the email of the company owner
              const companyOwner = propertyDocSnap.data().companyOwner;
              return companyOwner;
          } 
      } else {
          console.log(`Condo with ID ${condoId} does not exist.`);
      }
  } catch (error) {
      // Log and return null in case of an error
      console.error('Error:', error);
      return null;
  }
}

