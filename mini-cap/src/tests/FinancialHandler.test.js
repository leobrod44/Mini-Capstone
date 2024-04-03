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
import {calculateCondoFees, checkRentPaid, payRent} from "../backend/FinancialHandler";

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

describe('check and pay rent functions', () => {
    afterEach(() => {
        jest.clearAllMocks(); // Clear mock calls after each test
    });

    test('should mark rent as paid for a condominium', async () => {
        // Mock Firestore behavior for updating the rentPaid field
        doc.mockReturnValueOnce("fakeDocRef");
        updateDoc.mockResolvedValueOnce(true);

        // Call the payRent function
        await payRent('fakeCondoID');

        // Check if the Firestore methods were called correctly
        expect(doc).toHaveBeenCalledWith(expect.anything(), 'Condo', 'fakeCondoID');
        expect(updateDoc).toHaveBeenCalledWith("fakeDocRef", { rentPaid: true });
    });

    test('should throw an error if there is an issue updating the rentPaid field', async () => {
        // Mock Firestore behavior for updating the rentPaid field with an error
        updateDoc.mockRejectedValueOnce(new Error('Failed to update rentPaid'));

        // Call the payRent function and expect it to throw an error
        await expect(payRent('condo1')).rejects.toThrow('Error: Failed to update rentPaid');
    });

    test('should return true if rent has been paid for a condominium', async () => {
        // Mock Firestore behavior for fetching the condo document
        getDoc.mockResolvedValueOnce({ exists: true, data: () => ({ rentPaid: true }) });

        // Call the checkRentPaid function
        const result = await checkRentPaid('fakeCondoID');

        // Check if the function returns true
        expect(result).toBe(true);

        // Check if the Firestore methods were called correctly
        expect(doc).toHaveBeenCalledWith(expect.anything(), 'Condo', 'fakeCondoID');
        expect(getDoc).toHaveBeenCalled();
    });

    test('should return false if rent has not been paid for a condominium', async () => {
        // Mock Firestore behavior for fetching the condo document
        getDoc.mockResolvedValueOnce({ exists: true, data: () => ({ rentPaid: false }) });

        // Call the checkRentPaid function
        const result = await checkRentPaid('fakeCondoID');

        // Check if the function returns false
        expect(result).toBe(false);

        // Check if the Firestore methods were called correctly
        expect(doc).toHaveBeenCalledWith(expect.anything(), 'Condo', 'fakeCondoID');
        expect(getDoc).toHaveBeenCalled();
    });

    test('should throw an error if condo document does not exist', async () => {
        // Mock Firestore behavior for fetching the condo document
        getDoc.mockResolvedValueOnce({ exists: false });

        // Call the checkRentPaid function and expect it to throw an error
        await expect(checkRentPaid('fakeCondoID')).rejects.toThrow('Condo doc not found in checkRentPaid');

        // Check if the Firestore methods were called correctly
        expect(doc).toHaveBeenCalledWith(expect.anything(), 'Condo', 'fakeCondoID');
        expect(getDoc).toHaveBeenCalled();
    });
});