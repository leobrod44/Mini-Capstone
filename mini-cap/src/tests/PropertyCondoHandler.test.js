import {getCompanyData, getUserData, sendCondoKey, storeCondoKey} from '../backend/PropertyHandler'; // Import your function
import { doc, getDoc, getFirestore, collection, addDoc, updateDoc } from 'firebase/firestore';
import emailjs from '@emailjs/browser';
import { getStorage } from "firebase/storage";


// Mock Firebase storage functions
jest.mock('firebase/firestore', () => ({
    getFirestore: jest.fn(() => 'mockedDb'),
    collection: jest.fn(),
    addDoc: jest.fn(),
    updateDoc: jest.fn(),
}));
jest.mock('firebase/storage', () => ({
    getStorage: jest.fn(),
}));
jest.mock('@emailjs/browser', () => ({
    send: jest.fn(),
    init: jest.fn(),
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

    // test('linkCondoToUser: should link condo to user and set key to used', async () => {
    //     const fakeEmail = 'johndoe@example.com';
    //     const fakeKey = '12345';
    //     const fakeData = {
    //         email: fakeEmail,
    //         role: 'renter',
    //         condo: 'condo1',
    //         used: false
    //     };
    //     const fakeDocRef = { exists: jest.fn(() => true), data: jest.fn(() => fakeData) };
    //     const fakeUserSnap = { data: jest.fn(() => ({ owns: ['condo2'] })) };
    //     doc
    //         .mockReturnValueOnce(fakeDocRef) // Mock Keys document
    //         .mockReturnValueOnce({}); // Mock Users document
    //     getDoc
    //         .mockResolvedValueOnce(fakeDocRef) // Keys document
    //         .mockResolvedValueOnce(fakeUserSnap); // Users document
    //
    //     const result = await linkCondoToUser(fakeEmail, fakeKey);
    //
    //     expect(result).toEqual('Condo added!');
    //     expect(doc).toHaveBeenCalledWith(expect.anything(), 'Keys', fakeKey);
    //     expect(doc).toHaveBeenCalledWith(expect.anything(), 'Users', fakeEmail);
    //     expect(getDoc).toHaveBeenCalledTimes(2);
    //     expect(updateDoc).toHaveBeenCalledWith(expect.anything(), { used: true });
    //     expect(updateDoc).toHaveBeenCalledWith(expect.anything(), { rents: ['condo1'] });
    // });

});
