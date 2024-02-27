import {getCompanyData, getUserData} from '../backend/Fetcher'; // Import your function
import { doc, getDoc, getFirestore } from 'firebase/firestore';
import { getStorage } from "firebase/storage";


// Mock Firebase storage functions
jest.mock('firebase/firestore', () => ({
    doc: jest.fn(),
    getDoc: jest.fn(),
    getFirestore: jest.fn(() => 'mockedDb'),
}));
jest.mock('firebase/storage', () => ({
    getStorage: jest.fn(),
}));


describe('getting user/company data functions', () => {
    afterEach(() => {
        jest.clearAllMocks(); // Clear mock function calls after each test
    });

    test('getUserData: should return user data if document exists', async () => {
        const fakeEmail = 'test@example.com';
        const fakeData = { name: 'Test User', email: 'test@example.com' };
        const fakeDocSnap = { exists: jest.fn(() => true), data: jest.fn(() => fakeData) };
        const fakeDocRef = jest.fn();
        doc.mockReturnValue(fakeDocRef);
        getDoc.mockResolvedValue(fakeDocSnap);

        const result = await getUserData(fakeEmail);

        expect(result).toEqual(fakeData);
        expect(doc).toHaveBeenCalledWith(expect.anything(), 'Users', fakeEmail);
        expect(getDoc).toHaveBeenCalledWith(expect.anything());
    });

    test('getCompanyData: should return company data if document exists', async () => {
        const fakeEmail = 'test@example.com';
        const fakeData = { name: 'Test User', email: 'test@example.com' };
        const fakeDocSnap = { exists: jest.fn(() => true), data: jest.fn(() => fakeData) };
        const fakeDocRef = jest.fn();
        doc.mockReturnValue(fakeDocRef);
        getDoc.mockResolvedValue(fakeDocSnap);

        const result = await getCompanyData(fakeEmail);

        expect(result).toEqual(fakeData);
        expect(doc).toHaveBeenCalledWith(expect.anything(), 'Company', fakeEmail);
        expect(getDoc).toHaveBeenCalledWith(expect.anything());
    });

});
