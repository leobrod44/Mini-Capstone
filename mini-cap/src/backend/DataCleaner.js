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
        if (data.hasOwnProperty(key)) {
            newData[key] = data[key];
        }
    });

    return newData;
}

