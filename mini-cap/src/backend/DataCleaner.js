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
    },
    "Request": {
        "requestID": "", 
        "condoID":"", 
        "type": "", //(Financial, Administrative, Operational)
        "notes": "", 
        "step": "", 
    },
    "Amenity": {
        "amenityID": "", 
        "price": "", 
        "unitNumber": "", 
    },
    "Notification":{
        "destination": "",
        "type":"",
        "message": "",
        "path":"",
        "date":"",
        "viewed":""

    }
}



export function cleanData(type, data) {
    
    if (!structure[type]) {
        console.error("Invalid type specified");
        return {};
    }

    const format = structure[type];
    const newData = {};
    Object.keys(format).forEach(key => {
        const dataKeys = Object.keys(data);
        if (dataKeys.includes(key)) {
            newData[key] = data[key];
        }
    });
    

    return newData;
}

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

