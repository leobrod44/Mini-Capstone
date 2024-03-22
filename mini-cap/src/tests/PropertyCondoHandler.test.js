import {
    getCompanyData,
    getUserData,
    linkCondoToUser,
    sendCondoKey,
    storeCondoKey,
    addCondo,
    addProperty,
    getProperties,
    getUserCondos,
    getCondos,
    getCondo,
    getCondoOccupant,
    calculateCondoFees,
    getAmenities,
    addLockers,
    addParkings,
    assignLocker,
    assignParking,
    getAssignedLocker,
    getAssignedParking,
    editCondo,
    editProperty, deleteCondo, deleteProperty
} from '../backend/PropertyHandler';
import {
    doc,
    getDoc,
    getFirestore,
    collection,
    addDoc,
    updateDoc,
    arrayUnion,
    getDocs,
    query,
    where,
    deleteDoc
} from 'firebase/firestore';
import emailjs from '@emailjs/browser';
import { getStorage } from "firebase/storage";
import {changePassword, updateCompanyInfo, updateUserInfo} from "../backend/UserHandler";
import store from "storejs";
import {cleanData} from "../backend/DataCleaner";
import {getPropertyPicture, setPictureWithID} from "../backend/ImageHandler";


const PropertyHandler = require('../backend/PropertyHandler');


// Mock Firebase storage functions
jest.mock('firebase/firestore', () => ({
    getFirestore: jest.fn(() => 'mockedDb'),
    collection: jest.fn(),
    addDoc: jest.fn(),
    updateDoc: jest.fn(),
    doc: jest.fn(),
    getDoc: jest.fn(),
    getDocs: jest.fn(),
    arrayUnion: jest.fn(),
    getCondo: jest.fn(),
    query: jest.fn(),
    where: jest.fn(),
    deleteDoc: jest.fn(),
}));
jest.mock('firebase/storage', () => ({
    getStorage: jest.fn(),
}));
jest.mock('@emailjs/browser', () => ({
    send: jest.fn(),
    init: jest.fn(),
}));
jest.mock('storejs', () => ({
    __esModule: true,
    default: jest.fn(),
}));
jest.mock('../backend/ImageHandler', () => ({
    setPictureWithID: jest.fn(),
    getPropertyPicture: jest.fn(),
}));
jest.mock('../backend/DataCleaner', () => ({
    cleanData: jest.fn(),
}));


describe('Condo key functions', () => {
    afterEach(() => {
        jest.clearAllMocks(); // Clear mock function calls after each test
    });

    test('storeCondoKey: should add condo key to and return docRef.id', async () => {
        const fakeData = { condo: '12345', email: "johndoe@gmail.com", role: "renter"};
        const fakeDocRef = { id: 'fakeId' };
        const fakeCollection = jest.fn();
        addDoc.mockResolvedValue(fakeDocRef);
        collection.mockReturnValue(fakeCollection);

        const result = await storeCondoKey(fakeData);

        expect(result).toEqual('fakeId');
        expect(collection).toHaveBeenCalledWith(expect.anything(), 'Keys');
        expect(addDoc).toHaveBeenCalledWith(fakeCollection, fakeData);
        expect(updateDoc).toHaveBeenCalledWith(fakeDocRef, { used: false });
    });

    test('sendCondoKey: should send condo key to email', async () => {
        const fakeEmail = 'johndoe@example.com';
        const fakeKey = { condo: '12345', email: "johndoe@gmail.com", role: "renter", used: false};
        emailjs.send.mockResolvedValue();

        await sendCondoKey(fakeEmail, fakeKey);

        expect(emailjs.send).toHaveBeenCalledWith(
            'service_htocwjs',
            'template_h1oyvhl',
            { to_recipient: fakeEmail, message: fakeKey },
            { publicKey: 'Gw4N_w4eDx939VEBl' }
        );
    });

    test('linkCondoToUser: should link renting condo to user and set key to used (user has no condos)', async () => {
        const fakeKey = { condo: '12345', email: "johndoe@gmail.com", role: "renter", used: false};
        const fakeData = {
            role: "renter/owner",
            firstName: "John",
            lastName: "Doe",
            email: "johndoe@gmail.com",
            phoneNumber: "123-456-7890",
            password: "password123",
        };
        const fakeDocRef = jest.fn();
        const fakeUserSnap = { exists: jest.fn(() => true), data: jest.fn(() => fakeData) };
        const fakeKeyDocRef = jest.fn();
        const fakeKeySnap = { exists: jest.fn(() => true), data: jest.fn(() => fakeKey) };
        doc
            .mockReturnValueOnce(fakeKeyDocRef) // Mock Keys document
            .mockReturnValueOnce(fakeDocRef); // Mock Users document
        getDoc
            .mockResolvedValueOnce(fakeKeySnap) // Keys document
            .mockResolvedValueOnce(fakeUserSnap); // Users document
        arrayUnion

        const result = await linkCondoToUser(fakeData.email, fakeKey);

        expect(result).toEqual('Condo added!');
        expect(doc).toHaveBeenCalledWith(expect.anything(), 'Keys', fakeKey);
        expect(doc).toHaveBeenCalledWith(expect.anything(), 'Users', fakeData.email);
        expect(getDoc).toHaveBeenCalledTimes(2);
        expect(updateDoc).toHaveBeenCalledWith(fakeDocRef, { rents: arrayUnion('12345') });
        expect(updateDoc).toHaveBeenCalledWith(expect.anything(), { used: true });

    });

    test('linkCondoToUser: should link renting condo to user and set key to used (user HAS condos)', async () => {
        const fakeKey = { condo: '12345', email: "johndoe@gmail.com", role: "renter", used: false};
        const fakeData = {
            role: "renter/owner",
            firstName: "John",
            lastName: "Doe",
            email: "johndoe@gmail.com",
            phoneNumber: "123-456-7890",
            password: "password123",
            rents: ["54321"],
        };
        const fakeDocRef = jest.fn();
        const fakeUserSnap = { exists: jest.fn(() => true), data: jest.fn(() => fakeData) };
        const fakeKeyDocRef = jest.fn();
        const fakeKeySnap = { exists: jest.fn(() => true), data: jest.fn(() => fakeKey) };
        doc
            .mockReturnValueOnce(fakeKeyDocRef) // Mock Keys document
            .mockReturnValueOnce(fakeDocRef); // Mock Users document
        getDoc
            .mockResolvedValueOnce(fakeKeySnap) // Keys document
            .mockResolvedValueOnce(fakeUserSnap); // Users document
        arrayUnion

        const result = await linkCondoToUser(fakeData.email, fakeKey);

        expect(result).toEqual('Condo added!');
        expect(doc).toHaveBeenCalledWith(expect.anything(), 'Keys', fakeKey);
        expect(doc).toHaveBeenCalledWith(expect.anything(), 'Users', fakeData.email);
        expect(getDoc).toHaveBeenCalledTimes(2);
        expect(updateDoc).toHaveBeenCalledWith(fakeDocRef, { rents: ['12345'] });
        expect(updateDoc).toHaveBeenCalledWith(expect.anything(), { used: true });

    });

    test('linkCondoToUser: should link owning condo to user and set key to used (user has no condos)', async () => {
        const fakeKey = { condo: '12345', email: "johndoe@gmail.com", role: "owner", used: false};
        const fakeData = {
            role: "renter/owner",
            firstName: "John",
            lastName: "Doe",
            email: "johndoe@gmail.com",
            phoneNumber: "123-456-7890",
            password: "password123",
        };
        const fakeDocRef = jest.fn();
        const fakeUserSnap = { exists: jest.fn(() => true), data: jest.fn(() => fakeData) };
        const fakeKeyDocRef = jest.fn();
        const fakeKeySnap = { exists: jest.fn(() => true), data: jest.fn(() => fakeKey) };
        doc
            .mockReturnValueOnce(fakeKeyDocRef) // Mock Keys document
            .mockReturnValueOnce(fakeDocRef); // Mock Users document
        getDoc
            .mockResolvedValueOnce(fakeKeySnap) // Keys document
            .mockResolvedValueOnce(fakeUserSnap); // Users document
        arrayUnion

        const result = await linkCondoToUser(fakeData.email, fakeKey);

        expect(result).toEqual('Condo added!');
        expect(doc).toHaveBeenCalledWith(expect.anything(), 'Keys', fakeKey);
        expect(doc).toHaveBeenCalledWith(expect.anything(), 'Users', fakeData.email);
        expect(getDoc).toHaveBeenCalledTimes(2);
        expect(updateDoc).toHaveBeenCalledWith(fakeDocRef, { owns: arrayUnion('12345') });
        expect(updateDoc).toHaveBeenCalledWith(expect.anything(), { used: true });

    });

    test('linkCondoToUser: should link owning condo to user and set key to used (user HAS condos)', async () => {
        const fakeKey = { condo: '12345', email: "johndoe@gmail.com", role: "owner", used: false};
        const fakeData = {
            role: "renter/owner",
            firstName: "John",
            lastName: "Doe",
            email: "johndoe@gmail.com",
            phoneNumber: "123-456-7890",
            password: "password123",
            owns: ["54321"],
        };
        const fakeDocRef = jest.fn();
        const fakeUserSnap = { exists: jest.fn(() => true), data: jest.fn(() => fakeData) };
        const fakeKeyDocRef = jest.fn();
        const fakeKeySnap = { exists: jest.fn(() => true), data: jest.fn(() => fakeKey) };
        doc
            .mockReturnValueOnce(fakeKeyDocRef) // Mock Keys document
            .mockReturnValueOnce(fakeDocRef); // Mock Users document
        getDoc
            .mockResolvedValueOnce(fakeKeySnap) // Keys document
            .mockResolvedValueOnce(fakeUserSnap); // Users document
        arrayUnion

        const result = await linkCondoToUser(fakeData.email, fakeKey);

        expect(result).toEqual('Condo added!');
        expect(doc).toHaveBeenCalledWith(expect.anything(), 'Keys', fakeKey);
        expect(doc).toHaveBeenCalledWith(expect.anything(), 'Users', fakeData.email);
        expect(getDoc).toHaveBeenCalledTimes(2);
        expect(updateDoc).toHaveBeenCalledWith(fakeDocRef, { owns: ['12345'] });
        expect(updateDoc).toHaveBeenCalledWith(expect.anything(), { used: true });

    });

});


describe("addProperty and addCondo functions", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test('addProperty: should add property with picture and condos', async () => {
        const fakeData = {
            picture: "fake picture",
            address: 'fake address',
            companyOwner: 'owner@gmail.com',
            propertyName: 'Property Name',
            lockerCount: 124,
            parkingCount: 124,
            unitCount: 12,
            condos: [{ condoData: 'Condo Data 1' }, { condoData: 'Condo Data 2' }],
        };
        const fakeCleanData = {
            address: 'fake address',
            companyOwner: 'owner@gmail.com',
            propertyName: 'Property Name',
            lockerCount: 124,
            parkingCount: 124,
            unitCount: 12,
        };
        const fakeDocRef = { id: 'fakeId' };
        const fakeCollection = jest.fn();
        cleanData.mockReturnValue(fakeCleanData);
        collection.mockReturnValue(fakeCollection);
        addDoc.mockResolvedValue(fakeDocRef);

        await addProperty(fakeData);

        expect(setPictureWithID).toHaveBeenCalledWith(fakeData, 'propertyPictures/', fakeData.propertyName);
        expect(collection).toHaveBeenCalledWith(expect.anything(), 'Property');
        expect(addDoc).toHaveBeenCalledWith(fakeCollection, fakeCleanData);
    });

    test('addCondo: should add condo with picture', async () => {
        const fakeData = {
            picture: "fake picture",
            id: 'fake id',
            lockerNumber: '12',
            parkingNumber: '12',
            property: 'fake property id',
            squareFeet: "2100",
            unitNumber: "201",
            unitPrice: "3000",
            unitSize: "5.5",
        };
        const fakeCleanData = {
            id: 'fake id',
            lockerNumber: '12',
            parkingNumber: '12',
            property: 'fake property id',
            squareFeet: "2100",
            unitNumber: "201",
            unitPrice: "3000",
            unitSize: "5.5",
        };
        const fakePropertyId = "12345";
        const fakePropertyName = "fake name";
        const fakeDocRef = { id: 'fakeId' };
        const fakeCollection = jest.fn();
        cleanData.mockReturnValue(fakeCleanData);
        collection.mockReturnValue(fakeCollection);
        addDoc.mockResolvedValue(fakeDocRef);

        await addCondo(fakeData);

        expect(setPictureWithID).toHaveBeenCalledWith(fakeData, 'condoPictures/', fakeData.propertyName+"/"+ fakeData.unitNumber);
        expect(collection).toHaveBeenCalledWith(expect.anything(), 'Condo');
        expect(addDoc).toHaveBeenCalledWith(fakeCollection, fakeCleanData);
    });

});

describe("getting condos and properties functions", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test('getProperties: should return properties owned by the company with pictures', async () => {
        const fakeCompany = {
            role: "mgmt",
            firstName: "John",
            lastName: "Doe",
            email: "johndoe@gmail.com",
            phoneNumber: "123-456-7890",
            password: "password123",
        };
        const fakeDoc1 = { id: 'fakeid', data: jest.fn(() => ({ companyOwner: fakeCompany.email, propertyName: 'Property 1'})) };
        const fakeDoc2 = { id: 'fakeid2', data: jest.fn(() => ({ companyOwner: fakeCompany.email, propertyName: 'Property 2'})) };
        const fakeSnapshot = { docs: [fakeDoc1, fakeDoc2] };
        const fakePropertyPicture1 = 'fakePicture1';
        const fakePropertyPicture2 = 'fakePicture2';

        collection.mockReturnValue({ getDocs: getDocs.mockResolvedValueOnce(fakeSnapshot) });

        const result = await getProperties(fakeCompany.email);

        expect(collection).toHaveBeenCalledWith(expect.anything(), 'Property');
        expect(getDocs).toHaveBeenCalled();
        expect(getPropertyPicture).toHaveBeenCalled();
        expect(result).toEqual([
            { companyOwner: fakeCompany.email, propertyName: 'Property 1', propertyID: 'fakeid', picture: undefined },
            { companyOwner: fakeCompany.email, propertyName: 'Property 2', propertyID: 'fakeid2', picture: undefined }
        ]);
    });

    test('getUserCondos: should return condos owned or rented by the user with pictures', async () => {
        const fakeEmail = 'test@example.com';
        const fakeUserDoc = { data: jest.fn(() => ({ email: fakeEmail, owns: ['condo1', 'condo2'], rents: ['condo3', 'condo4'] })) };
        const fakeCondoDoc1 = { exists: jest.fn(() => true), data: jest.fn(() => ({ property: 'property1' })) };
        const fakeCondoDoc2 = { exists: jest.fn(() => true), data: jest.fn(() => ({ property: 'property2' })) };
        const fakeCondoDoc3 = { exists: jest.fn(() => true), data: jest.fn(() => ({ property: 'property2' })) };
        const fakeCondoDoc4 = { exists: jest.fn(() => true), data: jest.fn(() => ({ property: 'property3' })) };
        const fakePropertyDoc1 = { exists: jest.fn(() => true), data: jest.fn(() => ({ address: 'address1', propertyName: 'Property 1' })) };
        const fakePropertyDoc2 = { exists: jest.fn(() => true), data: jest.fn(() => ({ address: 'address2', propertyName: 'Property 2' })) };
        const fakePropertyDoc3 = { exists: jest.fn(() => true), data: jest.fn(() => ({ address: 'address3', propertyName: 'Property 3' })) };
        const fakePropertyDoc4 = { exists: jest.fn(() => true), data: jest.fn(() => ({ address: 'address4', propertyName: 'Property 4' })) };

        const fakeUserSnapshot = { docs: [fakeUserDoc] };
        const fakeCondoSnapshots = [fakeCondoDoc1, fakeCondoDoc2];
        const fakePropertySnapshots = [fakePropertyDoc1, fakePropertyDoc2];

        collection.mockReturnValueOnce({ getDocs: getDocs.mockResolvedValueOnce(fakeUserSnapshot) });
        doc.mockReturnValueOnce({ getDoc: getDoc.mockResolvedValueOnce(fakeCondoDoc1) })
            .mockReturnValueOnce({ getDoc: getDoc.mockResolvedValueOnce(fakeCondoDoc2) })
            .mockReturnValueOnce({ getDoc: getDoc.mockResolvedValueOnce(fakePropertyDoc1) })
            .mockReturnValueOnce({ getDoc: getDoc.mockResolvedValueOnce(fakePropertyDoc2) })
            .mockReturnValueOnce({ getDoc: getDoc.mockResolvedValueOnce(fakeCondoDoc3) })
            .mockReturnValueOnce({ getDoc: getDoc.mockResolvedValueOnce(fakeCondoDoc4) })
            .mockReturnValueOnce({ getDoc: getDoc.mockResolvedValueOnce(fakePropertyDoc3) })
            .mockReturnValueOnce({ getDoc: getDoc.mockResolvedValueOnce(fakePropertyDoc4) });

        const result = await getUserCondos(fakeEmail);

        expect(collection).toHaveBeenCalledWith(expect.anything(), 'Users');
        expect(getDocs).toHaveBeenCalled();
        expect(doc).toHaveBeenCalledWith(expect.anything(), 'Condo', 'condo1');
        expect(doc).toHaveBeenCalledWith(expect.anything(), 'Condo', 'condo2');
        expect(doc).toHaveBeenCalledWith(expect.anything(), 'Property', 'property1');
        expect(doc).toHaveBeenCalledWith(expect.anything(), 'Property', 'property2');
        expect(result).toEqual([
            { property: 'address1', propertyName: 'Property 1', userType: 'Owner' },
            { property: 'address2', propertyName: 'Property 2', userType: 'Owner' },
            { property: 'address3', propertyName: 'Property 3', userType: 'Renter' },
            { property: 'address4', propertyName: 'Property 4', userType: 'Renter' },
        ]);
    });

    test('getCondos: should return condos for a given property ID', async () => {
        const fakePropertyID = 'fakePropertyID';
        const fakeCondoDoc1 = { data: jest.fn(() => ({ property: fakePropertyID, name: 'Condo 1' })) };
        const fakeCondoDoc2 = { data: jest.fn(() => ({ property: fakePropertyID, name: 'Condo 2' })) };
        const fakeCondoSnapshot = { docs: [fakeCondoDoc1, fakeCondoDoc2],  };

        getDocs.mockResolvedValueOnce({
            ...fakeCondoSnapshot,
            forEach: (callback) => {
                fakeCondoSnapshot.docs.forEach(callback);
            },
        });

        collection.mockReturnValueOnce({ getDocs });

        const result = await getCondos(fakePropertyID);

        expect(collection).toHaveBeenCalledWith(expect.anything(), 'Condo');
        expect(getDocs).toHaveBeenCalled();
        expect(result).toEqual([
            { property: fakePropertyID, name: 'Condo 1' },
            { property: fakePropertyID, name: 'Condo 2' },
        ]);
    });
    test('getCondo: should return condo data with property information', async () => {
        // Mock data
        const condoID = 'testCondoID';
        const fakePropertyID = 'testPropertyID';
        const fakeCondoData = { property: fakePropertyID, name: 'Condo 1' };
        const fakePropertyData = { address: 'Mock Address', propertyName: 'Mock Property Name' };
      
        // Mock getDoc to return condo data
        getDoc.mockResolvedValueOnce({
          exists: true,
          data: jest.fn(() => fakeCondoData)
        });
      
        // Mock getDoc to return property data
        getDoc.mockResolvedValueOnce({
          exists: true,
          data: jest.fn(() => fakePropertyData),
        });
      
        // Call the function
        const result = await getCondo(condoID);
      
        // Assert the result
        expect(result).toEqual({
          ...fakeCondoData,
          address: fakePropertyData.address,
          propertyName: fakePropertyData.propertyName,
        });
      });
});

describe("getCondoOccupant function", () => {
    afterEach(() => {
        jest.clearAllMocks(); // Clear mock function calls after each test
    });

    test("should return condo occupant if condo document exists", async () => {
        // Mock data
        const condoId = "fakeCondoId";
        const fakeOccupant = "fakeOccupant";

        const fakeCondoDocSnap = {
            exists: true,
            data: jest.fn(() => ({ occupant: fakeOccupant })),
        };

        // Mock Firestore function behavior
        const fakeCondoDocRef = jest.fn();
        doc.mockReturnValue(fakeCondoDocRef);
        getDoc.mockResolvedValue(fakeCondoDocSnap);

        // Call the function
        const result = await getCondoOccupant(condoId);

        // Assertions
        expect(result).toEqual(fakeOccupant);
        expect(doc).toHaveBeenCalledWith(expect.anything(), "Condo", condoId);
        expect(getDoc).toHaveBeenCalledWith(fakeCondoDocRef);
    });

    test("should return null if condo document does not exist", async () => {
        // Mock data
        const condoId = "fakeCondoId";

        const fakeCondoDocSnap = {
            exists: false,
        };

        // Mock Firestore function behavior
        const fakeCondoDocRef = jest.fn();
        doc.mockReturnValue(fakeCondoDocRef);
        getDoc.mockResolvedValue(fakeCondoDocSnap);

        // Call the function
        const result = await getCondoOccupant(condoId);

        // Assertions
        expect(result).toBeNull();
        expect(doc).toHaveBeenCalledWith(expect.anything(), "Condo", condoId);
        expect(getDoc).toHaveBeenCalledWith(fakeCondoDocRef);
    });

    test("should throw an error if any error occurs during the process", async () => {
        // Mock data
        const condoId = "fakeCondoId";
        const errorMessage = "An unexpected error occurred";

        // Mock Firestore function behavior
        const fakeCondoDocRef = jest.fn();
        doc.mockReturnValue(fakeCondoDocRef);
        getDoc.mockRejectedValue(new Error(errorMessage));

        // Call the function and expect it to throw an error
        await expect(getCondoOccupant(condoId)).rejects.toThrow(errorMessage);

        // Assertions
        expect(doc).toHaveBeenCalledWith(expect.anything(), "Condo", condoId);
        expect(getDoc).toHaveBeenCalledWith(fakeCondoDocRef);
    });
});

describe("financial property and condo tests", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test('getCondoFees: should calculate fees for a rented condo', async () => {
        const fakeCondoId = 'fakeCondoId';
        const fakeCondoData = { status: 'Rented', property: 'fakePropertyId', unitPrice: 100 };
        const fakeAmenityData = { condo: 'fakeCondoId', price: 50 };
        const fakePropertyDoc = { exists: true };
        const fakeAmenitiesSnapshot = { docs: [{ data: () => fakeAmenityData }] };

        doc.mockReturnValueOnce({ getDoc: getDoc.mockResolvedValueOnce({ exists: true, data: () => fakeCondoData }) })
            .mockReturnValueOnce({ getDoc: getDoc.mockResolvedValueOnce(fakePropertyDoc) })
            .mockReturnValueOnce({ getDocs: getDocs.mockResolvedValueOnce(fakeAmenitiesSnapshot) });

        const result = await calculateCondoFees(fakeCondoId);

        expect(doc).toHaveBeenCalledWith(expect.anything(), 'Condo', fakeCondoId);
        expect(getDoc).toHaveBeenCalledTimes(2);
        expect(getDocs).toHaveBeenCalled();
        expect(result).toEqual({ monthlyFees: 150, totalFees: null });
    });

    test('getCondoFees: test when condo document does not exist', async () => {
        const fakeCondoId = 'fakeCondoId';
        const fakeCondoData = { status: 'Rented', property: 'fakePropertyId', unitPrice: 100 };
        const fakeAmenityData = { condo: 'fakeCondoId', price: 50 };
        const fakePropertyDoc = { exists: true };
        const fakeAmenitiesSnapshot = { docs: [{ data: () => fakeAmenityData }] };

        doc.mockReturnValueOnce({ getDoc: getDoc.mockResolvedValueOnce({ exists: false, data: () => fakeCondoData }) })
            .mockReturnValueOnce({ getDoc: getDoc.mockResolvedValueOnce(fakePropertyDoc) })
            .mockReturnValueOnce({ getDocs: getDocs.mockResolvedValueOnce(fakeAmenitiesSnapshot) });

        const result = await calculateCondoFees(fakeCondoId);

        expect(result).toEqual(null);
    });

});

describe("add and get amenities functions tests", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test('should retrieve a list of amenities for a property', async () => {
        const fakePropertyID = 'fakePropertyId';
        const fakeAmenities = [{ name: 'Gym', price: 50 }, { name: 'Pool', price: 25 }];
        const fakeAmenitiesDocs = fakeAmenities.map((amenity) => ({ data: () => amenity }));
        const fakeAmenitiesSnapshot = {
            forEach: jest.fn((callback) => fakeAmenitiesDocs.forEach(callback)),
        };

        doc.mockReturnValueOnce({ collection: collection.mockReturnValueOnce({ getDocs: getDocs.mockResolvedValueOnce(fakeAmenitiesSnapshot) }) });

        const result = await getAmenities(fakePropertyID);

        expect(doc).toHaveBeenCalledWith(expect.anything(), 'Property', fakePropertyID);
        expect(collection).toHaveBeenCalledWith(expect.anything(), 'Amenities');
        expect(getDocs).toHaveBeenCalled();
        expect(result).toEqual(fakeAmenities);
    });

    test('should add lockers to a property', async () => {
        const fakePropertyID = 'fakePropertyId';
        const fakeAmenitiesColl = 'fakeAmenitiesCollection';
        const fakeQuerySnapshot = { size: 0 };

        doc.mockReturnValueOnce({ collection: collection.mockReturnValueOnce(fakeAmenitiesColl) });
        query.mockReturnValueOnce({ where: where.mockReturnValueOnce({ getDocs: getDocs.mockResolvedValueOnce(fakeQuerySnapshot) }) });

        await addLockers(fakePropertyID, 3, 50);

        expect(doc).toHaveBeenCalledWith(expect.anything(), 'Property', fakePropertyID);
        expect(collection).toHaveBeenCalledWith(expect.anything(), 'Amenities');
        expect(query).toHaveBeenCalledWith(fakeAmenitiesColl, { getDocs: getDocs.mockResolvedValueOnce(fakeQuerySnapshot) });
        expect(where).toHaveBeenCalledWith("type", '==', "Locker");
        expect(getDocs).toHaveBeenCalled();
        expect(addDoc).toHaveBeenCalledTimes(3);
        for (let i = 1; i <= 3; i++) {
            expect(addDoc).toHaveBeenCalledWith(fakeAmenitiesColl, {
                available: true,
                condo: "",
                number: i,
                price: 50,
                type: "Locker"
            });
        }
    });

    test('should add parkings to a property', async () => {
        const fakePropertyID = 'fakePropertyId';
        const fakeAmenitiesColl = 'fakeAmenitiesCollection';
        const fakeQuerySnapshot = { size: 0 };

        doc.mockReturnValueOnce({ collection: collection.mockReturnValueOnce(fakeAmenitiesColl) });
        query.mockReturnValueOnce({ where: where.mockReturnValueOnce({ getDocs: getDocs.mockResolvedValueOnce(fakeQuerySnapshot) }) });

        await addParkings(fakePropertyID, 3, 50);

        expect(doc).toHaveBeenCalledWith(expect.anything(), 'Property', fakePropertyID);
        expect(collection).toHaveBeenCalledWith(expect.anything(), 'Amenities');
        expect(query).toHaveBeenCalledWith(fakeAmenitiesColl, { getDocs: getDocs.mockResolvedValueOnce(fakeQuerySnapshot) });
        expect(where).toHaveBeenCalledWith("type", '==', "Parking");
        expect(getDocs).toHaveBeenCalled();
        expect(addDoc).toHaveBeenCalledTimes(3);
        for (let i = 1; i <= 3; i++) {
            expect(addDoc).toHaveBeenCalledWith(fakeAmenitiesColl, {
                available: true,
                condo: "",
                number: i,
                price: 50,
                type: "Parking"
            });
        }
    });

    test('should assign a locker to a condo', async () => {
        const fakeCondoID = 'fakeCondoId';
        const fakePropertyID = 'fakePropertyId';
        const fakeCondoRef = 'fakeCondoRef';
        const fakePropertyRef = 'fakePropertyRef';
        const fakeLockerData = { available: true, type: 'Locker', number: 1 };

        doc.mockReturnValueOnce(fakeCondoRef)
            .mockReturnValueOnce(fakePropertyRef);

        // Mock condo document snapshot
        const fakeCondoDocSnapshot = { data: () => ({ property: fakePropertyID }) };
        getDoc.mockResolvedValueOnce(fakeCondoDocSnapshot);

        // Mock amenities snapshot with one available locker
        const fakeAmenitiesSnapshot = {
            docs: [{ data: () => fakeLockerData, ref: { update: jest.fn() } }],
            forEach: jest.fn(),
        };
        getDocs.mockResolvedValueOnce(fakeAmenitiesSnapshot);

        await assignLocker(fakeCondoID);

        // Assertions
        expect(doc).toHaveBeenCalledWith(expect.anything(), 'Condo', fakeCondoID);
        expect(getDoc).toHaveBeenCalled();
        expect(doc).toHaveBeenCalledWith(expect.anything(), 'Property', fakePropertyID);
        expect(collection).toHaveBeenCalledWith(expect.anything(), 'Amenities');
        expect(getDocs).toHaveBeenCalled();
        expect(updateDoc).toHaveBeenCalledWith(fakeAmenitiesSnapshot.docs[0].ref, {
            condo: fakeCondoID,
            available: false,
        });
    });

    test('should throw an error if no available lockers', async () => {
        const fakeCondoID = 'fakeCondoId';
        const fakePropertyID = 'fakePropertyId';
        const fakeCondoRef = 'fakeCondoRef';
        const fakePropertyRef = 'fakePropertyRef';

        doc.mockReturnValueOnce(fakeCondoRef)
            .mockReturnValueOnce(fakePropertyRef);

        // Mock condo document snapshot
        const fakeCondoDocSnapshot = { data: () => ({ property: fakePropertyID }) };
        getDoc.mockResolvedValueOnce(fakeCondoDocSnapshot);

        // Mock amenities snapshot with no available lockers
        const fakeAmenitiesSnapshot = {
            docs: [{ data: () => ({ available: false }), ref: { update: jest.fn() } }],
            forEach: jest.fn(),
        };
        getDocs.mockResolvedValueOnce(fakeAmenitiesSnapshot);

        await expect(assignLocker(fakeCondoID)).rejects.toThrowError('No available lockers');

        // Assertions
        expect(doc).toHaveBeenCalledWith(expect.anything(), 'Condo', fakeCondoID);
        expect(getDoc).toHaveBeenCalled();
        expect(doc).toHaveBeenCalledWith(expect.anything(), 'Property', fakePropertyID);
        expect(collection).toHaveBeenCalledWith(expect.anything(), 'Amenities');
        expect(getDocs).toHaveBeenCalled();
        expect(updateDoc).not.toHaveBeenCalled();
    });

    test('should assign a parking to a condo', async () => {
        const fakeCondoID = 'fakeCondoId';
        const fakePropertyID = 'fakePropertyId';
        const fakeCondoRef = 'fakeCondoRef';
        const fakePropertyRef = 'fakePropertyRef';
        const fakeLockerData = { available: true, type: 'Parking', number: 1 };

        doc.mockReturnValueOnce(fakeCondoRef)
            .mockReturnValueOnce(fakePropertyRef);

        // Mock condo document snapshot
        const fakeCondoDocSnapshot = { data: () => ({ property: fakePropertyID }) };
        getDoc.mockResolvedValueOnce(fakeCondoDocSnapshot);

        // Mock amenities snapshot with one available locker
        const fakeAmenitiesSnapshot = {
            docs: [{ data: () => fakeLockerData, ref: { update: jest.fn() } }],
            forEach: jest.fn(),
        };
        getDocs.mockResolvedValueOnce(fakeAmenitiesSnapshot);

        await assignParking(fakeCondoID);

        // Assertions
        expect(doc).toHaveBeenCalledWith(expect.anything(), 'Condo', fakeCondoID);
        expect(getDoc).toHaveBeenCalled();
        expect(doc).toHaveBeenCalledWith(expect.anything(), 'Property', fakePropertyID);
        expect(collection).toHaveBeenCalledWith(expect.anything(), 'Amenities');
        expect(getDocs).toHaveBeenCalled();
        expect(updateDoc).toHaveBeenCalledWith(fakeAmenitiesSnapshot.docs[0].ref, {
            condo: fakeCondoID,
            available: false,
        });
    });

    test('should throw an error if no available parkings', async () => {
        const fakeCondoID = 'fakeCondoId';
        const fakePropertyID = 'fakePropertyId';
        const fakeCondoRef = 'fakeCondoRef';
        const fakePropertyRef = 'fakePropertyRef';

        doc.mockReturnValueOnce(fakeCondoRef)
            .mockReturnValueOnce(fakePropertyRef);

        // Mock condo document snapshot
        const fakeCondoDocSnapshot = { data: () => ({ property: fakePropertyID }) };
        getDoc.mockResolvedValueOnce(fakeCondoDocSnapshot);

        // Mock amenities snapshot with no available lockers
        const fakeAmenitiesSnapshot = {
            docs: [{ data: () => ({ available: false }), ref: { update: jest.fn() } }],
            forEach: jest.fn(),
        };
        getDocs.mockResolvedValueOnce(fakeAmenitiesSnapshot);

        await expect(assignParking(fakeCondoID)).rejects.toThrowError('No available parking spots');

        // Assertions
        expect(doc).toHaveBeenCalledWith(expect.anything(), 'Condo', fakeCondoID);
        expect(getDoc).toHaveBeenCalled();
        expect(doc).toHaveBeenCalledWith(expect.anything(), 'Property', fakePropertyID);
        expect(collection).toHaveBeenCalledWith(expect.anything(), 'Amenities');
        expect(getDocs).toHaveBeenCalled();
        expect(updateDoc).not.toHaveBeenCalled();
    });

    test('should retrieve the assigned locker for a condo', async () => {
        const fakeCondoID = 'fakeCondoId';
        const fakePropertyID = 'fakePropertyId';
        const fakeAssignedLockerData = { condo: fakeCondoID, type: 'Locker', number: 1 };
        const fakeCondoRef = 'fakeCondoRef';
        const fakePropertyRef = 'fakePropertyRef';

        doc.mockReturnValueOnce(fakeCondoRef)
            .mockReturnValueOnce(fakePropertyRef);

        // Mock condo document snapshot
        const fakeCondoDocSnapshot = { data: () => ({ property: fakePropertyID }) };
        getDoc.mockResolvedValueOnce(fakeCondoDocSnapshot);

        // Mock amenities snapshot with the assigned locker
        const fakeAmenitiesSnapshot = {
            docs: [{ data: () => fakeAssignedLockerData }],
            forEach: jest.fn(),
        };
        getDocs.mockResolvedValueOnce(fakeAmenitiesSnapshot);

        const result = await getAssignedLocker(fakeCondoID);

        // Assertions
        expect(doc).toHaveBeenCalledWith(expect.anything(), 'Condo', fakeCondoID);
        expect(getDoc).toHaveBeenCalled();
        expect(doc).toHaveBeenCalledWith(expect.anything(), 'Property', fakePropertyID);
        expect(collection).toHaveBeenCalledWith(expect.anything(), 'Amenities');
        expect(getDocs).toHaveBeenCalled();
        expect(result).toEqual(fakeAssignedLockerData);
    });

    test('should throw an error if no associated locker is found', async () => {
        const fakeCondoID = 'fakeCondoId';
        const fakePropertyID = 'fakePropertyId';
        const fakeCondoRef = 'fakeCondoRef';
        const fakePropertyRef = 'fakePropertyRef';

        doc.mockReturnValueOnce(fakeCondoRef)
            .mockReturnValueOnce(fakePropertyRef);

        // Mock condo document snapshot
        const fakeCondoDocSnapshot = { data: () => ({ property: fakePropertyID }) };
        getDoc.mockResolvedValueOnce(fakeCondoDocSnapshot);

        // Mock amenities snapshot with no assigned lockers
        const fakeAmenitiesSnapshot = { docs: [], forEach: jest.fn() };
        getDocs.mockResolvedValueOnce(fakeAmenitiesSnapshot);

        await expect(getAssignedLocker(fakeCondoID)).rejects.toThrowError('No associated locker found');

        // Assertions
        expect(doc).toHaveBeenCalledWith(expect.anything(), 'Condo', fakeCondoID);
        expect(getDoc).toHaveBeenCalled();
        expect(doc).toHaveBeenCalledWith(expect.anything(), 'Property', fakePropertyID);
        expect(collection).toHaveBeenCalledWith(expect.anything(), 'Amenities');
        expect(getDocs).toHaveBeenCalled();
    });

    test('should retrieve the assigned parking for a condo', async () => {
        const fakeCondoID = 'fakeCondoId';
        const fakePropertyID = 'fakePropertyId';
        const fakeAssignedParkingData = { condo: fakeCondoID, type: 'Parking', number: 1 };
        const fakeCondoRef = 'fakeCondoRef';
        const fakePropertyRef = 'fakePropertyRef';

        doc.mockReturnValueOnce(fakeCondoRef)
            .mockReturnValueOnce(fakePropertyRef);

        // Mock condo document snapshot
        const fakeCondoDocSnapshot = { data: () => ({ property: fakePropertyID }) };
        getDoc.mockResolvedValueOnce(fakeCondoDocSnapshot);

        // Mock amenities snapshot with the assigned locker
        const fakeAmenitiesSnapshot = {
            docs: [{ data: () => fakeAssignedParkingData }],
            forEach: jest.fn(),
        };
        getDocs.mockResolvedValueOnce(fakeAmenitiesSnapshot);

        const result = await getAssignedParking(fakeCondoID);

        // Assertions
        expect(doc).toHaveBeenCalledWith(expect.anything(), 'Condo', fakeCondoID);
        expect(getDoc).toHaveBeenCalled();
        expect(doc).toHaveBeenCalledWith(expect.anything(), 'Property', fakePropertyID);
        expect(collection).toHaveBeenCalledWith(expect.anything(), 'Amenities');
        expect(getDocs).toHaveBeenCalled();
        expect(result).toEqual(fakeAssignedParkingData);
    });

    test('should throw an error if no associated parking is found', async () => {
        const fakeCondoID = 'fakeCondoId';
        const fakePropertyID = 'fakePropertyId';
        const fakeCondoRef = 'fakeCondoRef';
        const fakePropertyRef = 'fakePropertyRef';

        doc.mockReturnValueOnce(fakeCondoRef)
            .mockReturnValueOnce(fakePropertyRef);

        // Mock condo document snapshot
        const fakeCondoDocSnapshot = { data: () => ({ property: fakePropertyID }) };
        getDoc.mockResolvedValueOnce(fakeCondoDocSnapshot);

        // Mock amenities snapshot with no assigned lockers
        const fakeAmenitiesSnapshot = { docs: [], forEach: jest.fn() };
        getDocs.mockResolvedValueOnce(fakeAmenitiesSnapshot);

        await expect(getAssignedParking(fakeCondoID)).rejects.toThrowError('No associated parking found');

        // Assertions
        expect(doc).toHaveBeenCalledWith(expect.anything(), 'Condo', fakeCondoID);
        expect(getDoc).toHaveBeenCalled();
        expect(doc).toHaveBeenCalledWith(expect.anything(), 'Property', fakePropertyID);
        expect(collection).toHaveBeenCalledWith(expect.anything(), 'Amenities');
        expect(getDocs).toHaveBeenCalled();
    });

});

describe("modify and delete property/condo functions", () => {
    afterEach(() => {
        jest.clearAllMocks(); // Clear mock function calls after each test
    });

    test('should update condo data successfully', async () => {
        const fakeCondoId = 'fakeCondoId';
        const fakeDocRef = 'fakeDocRef';
        const fakePassedData = 'fakePassedData';
        const fakeCleanData = 'fakeCleanData';

        doc.mockReturnValueOnce(fakeDocRef);
        updateDoc.mockResolvedValueOnce();
        cleanData.mockReturnValueOnce(fakeCleanData);

        const result = await editCondo(fakeCondoId, fakePassedData);

        expect(result).toBe(true); // Ensure the function returns true for success
        expect(doc).toHaveBeenCalledWith(expect.anything(), 'Condo', fakeCondoId);
        expect(updateDoc).toHaveBeenCalledWith(fakeDocRef, fakeCleanData);
        // You can add more specific expectations based on your requirements
    });

    test('editCondo should throw error', async () => {
        const fakeCondoId = 'fakeCondoId';
        const fakeData = { /* Your fake data object here */ };

        doc.mockImplementationOnce(() => {
            throw new Error('Test error');
        });

        const result = await editCondo(fakeCondoId, fakeData);

        expect(result).toBe(false);
    });

    test('should update property data successfully', async () => {
        const fakePropertyId = 'fakePropertyId';
        const fakeDocRef = 'fakeDocRef';
        const fakePassedData = 'fakePassedData';
        const fakeCleanData = 'fakeCleanData';

        doc.mockReturnValueOnce(fakeDocRef);
        updateDoc.mockResolvedValueOnce();
        cleanData.mockReturnValueOnce(fakeCleanData);

        const result = await editProperty(fakePropertyId, fakePassedData);

        expect(result).toBe(true); // Ensure the function returns true for success
        expect(doc).toHaveBeenCalledWith(expect.anything(), 'Property', fakePropertyId);
        expect(updateDoc).toHaveBeenCalledWith(fakeDocRef, fakeCleanData);
        // You can add more specific expectations based on your requirements
    });

    test('editProperty should throw error', async () => {
        const fakePropertyID = 'fakePropertyID';
        const fakeData = { /* Your fake data object here */ };

        doc.mockImplementationOnce(() => {
            throw new Error('Test error');
        });

        const result = await editCondo(fakePropertyID, fakeData);

        expect(result).toBe(false);
    });

    test('should delete a condo and update user information', async () => {
        // Mock Firestore behavior for retrieving users who own the condo
        const userSnapshot = [{ ref: { id: 'user1' }, data: () => ({ owns: ['condo1'] }) }];
        const fakeDocRef = { id: 'condo1' };
        getDocs.mockResolvedValueOnce(userSnapshot);
        doc.mockReturnValueOnce(fakeDocRef);

        // Mock Firestore behavior for updating user's ownership information
        updateDoc.mockResolvedValueOnce(true);

        // Mock Firestore behavior for deleting the condo
        deleteDoc.mockResolvedValueOnce(true);

        // Call the deleteCondo function
        const result = await deleteCondo('condo1');

        // Check if the function returns true
        expect(result).toBe(true);

        // Check if the Firestore methods were called correctly
        expect(collection).toHaveBeenCalledWith(expect.anything(), 'Users');
        expect(where).toHaveBeenCalledWith('owns', 'array-contains', 'condo1');
        expect(getDocs).toHaveBeenCalled();
        expect(updateDoc).toHaveBeenCalledWith({ id: 'user1' }, { owns: [] });
        expect(deleteDoc).toHaveBeenCalledWith(fakeDocRef);
    });

    test('should delete a pre and update user information', async () => {
        // Mock Firestore behavior for retrieving users who own the condo
        const userSnapshot = [{ ref: { id: 'user1' }, data: () => ({ owns: ['condo1'] }) }];
        const fakeDocRef = { id: 'condo1' };
        getDocs.mockResolvedValueOnce(userSnapshot);
        doc.mockReturnValueOnce(fakeDocRef);

        // Mock Firestore behavior for updating user's ownership information
        updateDoc.mockResolvedValueOnce(true);

        // Mock Firestore behavior for deleting the condo
        deleteDoc.mockResolvedValueOnce(true);

        // Call the deleteCondo function
        const result = await deleteCondo('condo1');

        // Check if the function returns true
        expect(result).toBe(true);

        // Check if the Firestore methods were called correctly
        expect(collection).toHaveBeenCalledWith(expect.anything(), 'Users');
        expect(where).toHaveBeenCalledWith('owns', 'array-contains', 'condo1');
        expect(getDocs).toHaveBeenCalled();
        expect(updateDoc).toHaveBeenCalledWith({ id: 'user1' }, { owns: [] });
        expect(deleteDoc).toHaveBeenCalledWith(fakeDocRef);
    });

    test('should delete a property and its associated condos', async () => {
        // Mock Firestore behavior for deleting the property
        deleteDoc.mockResolvedValueOnce(true);
        const fakeCollection = jest.fn();
        const fakeDocRef = { id: 'property1' };
        const fakeWhereResult = "fakeWhere";

        query.mockReturnValueOnce("fakeQueryResult");
        doc.mockReturnValueOnce(fakeDocRef)
            .mockReturnValueOnce(fakeDocRef);
        collection.mockReturnValue(fakeCollection);
        where.mockReturnValue(fakeWhereResult);

        // Mock Firestore behavior for querying condos associated with the property
        const condoSnapshot = [{ id: 'condo1' }];
        getDocs.mockResolvedValueOnce(condoSnapshot);

        // Mock Firestore behavior for deleting condos associated with the property
        deleteDoc.mockResolvedValueOnce(true)
            .mockResolvedValueOnce(true);

        // Call the deleteProperty function
        await deleteProperty('property1');

        // Check if the Firestore methods were called correctly
        expect(collection).toHaveBeenCalledWith(expect.anything(), 'Condo');
        expect(doc).toHaveBeenCalledWith(expect.anything(), 'Property', 'property1');
        expect(deleteDoc).toHaveBeenCalledWith({ id: 'property1' });
        expect(query).toHaveBeenCalledWith(fakeCollection, fakeWhereResult);
        expect(where).toHaveBeenCalledWith('property', '==', 'property1');
        expect(getDocs).toHaveBeenCalled();
        expect(deleteDoc).toHaveBeenCalledWith(fakeDocRef);
    });

});