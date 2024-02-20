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
