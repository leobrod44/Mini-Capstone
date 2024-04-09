const structure = {
    "Users": {
        "role": "",
        "firstName": "",
        "lastName": "",
        "email": "",
        "phoneNumber": "",
        "password": "",
    },
    "Company": {
        "companyName": "",
        "phoneNumber": "",
        "email": "",
        "password": "",
    },
    "Property": {
        "companyOwner": "",
        "propertyName": "",
        "address": "",
        "unitCount": "",
        "parkingCount": "",
        "lockerCount": "",
    },
    "Condo":{
        "property": "",
        "unitNumber": "",
        "squareFeet": "",
        "unitPrice": "",
        "unitSize": "",
        "parkingNumber": "",
        "lockerNumber": "",
        "status": "",
        "id": "",
        "occupant": ""
    },
    "Request": {
        "requestID": "", 
        "condoID":"", 
        "type": "", //(Financial, Administrative, Operational)
        "notes": "", 
        "step": "", 
        "viewed": "", 
    },
    "Amenity": {
        "amenityID": "", 
        "price": "", 
        "unitNumber": "", 
    },
    "Notification":{
        "message": "",
        "path":"",
        "date": "",
        "type": "",
        "viewed": ""
    },
    "Facility": {
        "propertyID": "",
        "type": "",
        "description": "",
        "dailyAvailabilities": "",
        "blockSize": "",
    },
}



/**
 * Cleans the provided data according to the specified data structure format.
 * 
 * @param {string} type - The type of data structure format to apply.
 * @param {object} data - The data object to be cleaned.
 * @returns {object} The cleaned data object according to the specified structure format.
 */
export function cleanData(type, data) {
    // Check if the specified type is valid
    if (!structure[type]) {
        console.error("Invalid type specified");
        // Return an empty object if the type is invalid
        return {};
    }

    // Get the format for the specified type
    const format = structure[type];
    // Initialize a new data object to store cleaned data
    const newData = {};

    // Iterate through each key in the format
    Object.keys(format).forEach(key => {
        // Check if the data object contains the key
        const dataKeys = Object.keys(data);
        if (dataKeys.includes(key)) {
            // Copy the key-value pair to the new data object
            newData[key] = data[key];
        }
    });

    // Return the cleaned data object
    return newData;
}


/**
 * Sorts an array of objects based on the specified key.
 * 
 * @param {Array<object>} array - The array of objects to be sorted.
 * @param {string} key - The key based on which the array should be sorted.
 * @returns {Array<object>} The sorted array of objects.
 */

export function sortArray(array, key) {
    return array.sort((a, b) => {
        const valueA = a[key];
        const valueB = b[key];
        
        if (valueA < valueB) {
            return -1;
        } else if (valueA > valueB) {
            return 1;
        } else {
            return 0;
        }
    });
}

