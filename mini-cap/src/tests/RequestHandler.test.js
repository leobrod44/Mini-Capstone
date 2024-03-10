import { ADMINISTRATIVE_STEPS } from '../backend/Constants';
import { submitRequest, getRequests, updateRequest } from '../backend/RequestHandler';
import {doc, getDoc, getFirestore, collection, addDoc, updateDoc, arrayUnion, getDocs} from 'firebase/firestore';
jest.mock('firebase/firestore', () => ({
    ...jest.requireActual('firebase/firestore'),
    addDoc: jest.fn(),
    getDocs: jest.fn(),
    getDoc: jest.fn(),
    getFirestore: jest.fn(() => 'mockedDb'),
    collection: jest.fn(),
    updateDoc: jest.fn(),
    doc: jest.fn(),
    arrayUnion: jest.fn(),
}));

describe("request creation, fetching, and updating", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test("should submit a request", async () => {
        // Mock the response of addDoc
        const mockResponse = { id: 'mockedResponseID' };
        const fakeCollection = jest.fn();
        collection.mockReturnValue(fakeCollection);
        addDoc.mockResolvedValueOnce(mockResponse);
        
        // Call submitRequest
        const condoID = 'someCondoID';
        const type = 'Administrative';
        const notes = 'someNotes';
        const requestId = await submitRequest(condoID, type, notes);

        // Assertions for submitRequest
        expect(requestId).toBe(mockResponse.id);
        expect(addDoc).toHaveBeenCalledWith(expect.anything(), {
            type: type,
            notes: notes,
            step: 0,
            viewed: false,
            condoID: condoID,
            requestID: null 
        });
    });

    test("should fetch requests", async () => {
        // Mock the snapshot of documents for getRequests
        const mockDocuments = [
            { data: () => ({ type: 'Administrative', notes: 'mockNotes1' }) },
            { data: () => ({ type: 'Administrative', notes: 'mockNotes2' }) },
        ];
        const fakeCollection = jest.fn();
        collection.mockReturnValue(fakeCollection);

        const mockSnapshot = { docs: mockDocuments };
        getDocs.mockResolvedValueOnce(mockSnapshot);

        // Call getRequests
        const condoID = 'someCondoID';
        const fetchedRequests = await getRequests(condoID);

        // Assertions for getRequests
        expect(getDocs).toHaveBeenCalledWith(expect.anything());
        expect(fetchedRequests).toEqual([
            { type: 'Administrative', notes: 'mockNotes1' },
            { type: 'Administrative', notes: 'mockNotes2' }
        ]);
    });

    test("should update a request", async () => {
        // Mock the response of updateDoc
        const updateResponse = { id: 'mockedResponseID' };
        var originalDoc = {
            type: "Administrative",
            notes: "test notes",
            step: 0,
            viewed: false,
            condoID: "someCondoID",
            requestID: null 
        }
        const fakeSnap = { exists: jest.fn(() => true), data: jest.fn(() => originalDoc) };
        const fakeCollection = jest.fn();
        getDoc.mockResolvedValueOnce(fakeSnap);
        
        collection.mockReturnValue(fakeCollection);
        updateDoc.mockResolvedValueOnce(updateResponse);
    
        // Call updateRequest
        const condoID = 'someCondoID';
        const requestId = 'someRequestId';

        var ans = await updateRequest(condoID, requestId);

        // Assertions for updateRequest
        expect(ans).toBe(ADMINISTRATIVE_STEPS[1]);
        
    });
});    
