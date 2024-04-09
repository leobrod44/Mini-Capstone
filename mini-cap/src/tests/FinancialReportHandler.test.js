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
    editProperty, deleteCondo, deleteProperty, getPropertyData
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
import {jsPDF} from "jspdf";
import {calculateCondoFees, checkRentPaid, payRent} from "../backend/FinancialHandler";
import {generateFinancialReport} from "../backend/FinancialReportHandler";


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

jest.mock('jspdf', () => {
    class jsPDF {
        constructor() {} // Basic constructor

        setFontSize = jest.fn();
        text = jest.fn();
        setLineWidth = jest.fn();
        line = jest.fn();
        save = jest.fn();
    }

    return jsPDF;
});

import * as financialReportHandler from '../backend/FinancialReportHandler';

jest.mock('../backend/FinancialHandler', () => ({
    calculateCondoFees: jest.fn(),
    checkRentPaid: jest.fn()
}));

jest.mock('../backend/PropertyHandler', () => ({
    getPropertyData: jest.fn()
}));


describe('generate financial report function test', () => {

    afterEach(() => {
        jest.clearAllMocks(); // Clear mock calls after each test
    });

    test('should generate a financial report for a condominium', async () => {
        // Mock Firestore behavior for fetching the condo document
        getDoc.mockResolvedValueOnce({ exists: true, data: () => ({ unitNumber: 'unit1', property: 'property1' }) });

        getPropertyData.mockReturnValue({propertyName: 'fakePropertyName', address: 'fakeAddress'});
        calculateCondoFees.mockReturnValue({ totalPrice: 500, rent: 400, amenitiesPrice: 100 });
        checkRentPaid.mockReturnValue(false);

        // Call the generateFinancialReport function
        await financialReportHandler.generateFinancialReport('condo1');

        // Expect Firestore methods to be called
        expect(doc).toHaveBeenCalledWith(expect.anything(), 'Condo', 'condo1');
        expect(getDoc).toHaveBeenCalled();
        expect(calculateCondoFees).toHaveBeenCalledWith('condo1');
        expect(checkRentPaid).toHaveBeenCalledWith('condo1');

    });
});