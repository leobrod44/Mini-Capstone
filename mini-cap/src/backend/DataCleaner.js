const structure = {
    "Users": {
        "role": "",
        "firstName": "",
        "lastName": "",
        "email": "",
        "phoneNumber": "",
        "companyName": "",
        "password": "",
        "picture": ""
    },
    "Company": {
        "companyName": "",
        "phoneNumber": "",
        "email": "",
        "picture": ""
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
