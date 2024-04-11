import { ADMINISTRATIVE_STEPS } from '../backend/Constants';
import {submitRequest, getRequests, updateRequest, assignWorker, getAssignedWorker,getNotifications,setNotificationViewed,addReservationNotification,addRequestNotification} from '../backend/RequestHandler';
import {doc, getDoc, getFirestore, collection, addDoc, updateDoc, arrayUnion, getDocs} from 'firebase/firestore';
import { MANAGMENT_COMPANY } from '../backend/Constants'; // Assuming this constant is defined somewhere

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

describe("workers assigning and getting", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test('assignWorker: should assign a worker to a request in a condo', async () => {
        const fakeRequestData = { condoID: 'fakeCondoId', requestID: 'fakeRequestId', type: 'Financial' };
        const fakeCondoData = { property: 'fakePropertyId' };
        const fakeWorkerData = { type: 'Financial' };
        const fakeWorkerRef = { id: 'fakeWorkerId', ref: { id: 'fakeWorkerId' } };
        const fakeWorkersSnapshot = { docs: [{ data: () => fakeWorkerData, ref: fakeWorkerRef }] };
        const fakePropertyRef = { ref: { id: 'fakePropertyID' } };

        doc.mockReturnValueOnce({ getDoc: getDoc.mockResolvedValueOnce({ exists: true, data: () => fakeCondoData }) })
            .mockReturnValueOnce({ updateDoc: updateDoc.mockResolvedValueOnce() })
            .mockReturnValueOnce(fakePropertyRef);
        collection.mockReturnValueOnce({ getDocs: getDocs.mockResolvedValueOnce(fakeWorkersSnapshot) });

        await assignWorker(fakeRequestData);

        expect(doc).toHaveBeenCalledWith(expect.anything(), 'Condo', fakeRequestData.condoID);
        expect(getDoc).toHaveBeenCalled();
        expect(collection).toHaveBeenCalledWith(expect.anything(), 'Workers');
        expect(getDocs).toHaveBeenCalled();
        expect(updateDoc).toHaveBeenCalledWith(expect.anything(), { assignedWorkerID: fakeWorkerRef.id });
    });

    test('getAssignedWorker: should get the assigned worker for a request', async () => {
        const fakeCondoID = 'fakeCondoId';
        const fakeRequestID = 'fakeRequestId';
        const fakeCondoData = { property: 'fakePropertyId' };
        const fakeRequestData = { assignedWorkerID: 'fakeWorkerId' };
        const fakeWorkerData = { type: 'Financial', name: 'John Doe' };

        doc.mockReturnValueOnce({ getDoc: getDoc.mockResolvedValueOnce({ data: () => fakeCondoData }) })
            .mockReturnValueOnce({ getDoc: getDoc.mockResolvedValueOnce({ data: () => fakeRequestData }) })
            .mockReturnValueOnce({ getDoc: getDoc.mockResolvedValueOnce({ data: () => fakeWorkerData }) });

        const result = await getAssignedWorker(fakeCondoID, fakeRequestID);

        expect(doc).toHaveBeenCalledWith(expect.anything(), 'Condo', fakeCondoID);
        expect(doc).toHaveBeenCalledWith(expect.anything(), 'Condo', fakeCondoID, 'Requests', fakeRequestID);
        expect(doc).toHaveBeenCalledWith(expect.anything(), 'Property', fakeCondoData.property, 'Workers', fakeRequestData.assignedWorkerID);
        expect(getDoc).toHaveBeenCalledTimes(3);
        expect(result).toEqual(fakeWorkerData);
    });

});

describe('getNotifications function', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test('should fetch and filter notifications correctly', async () => {
        const mockUserID = 'mockUserID';
        const mockNotificationData = [
            { data: () => ({ isReservation: true, date: new Date() }) },
            { data: () => ({ isReservation: true, date: new Date(Date.now() + 86400000) }) },
            { data: () => ({ isReservation: false }) },
        ];
        const fakeDoc = jest.fn();
        const fakeCollection = jest.fn();
        const fakeNotificationSnapshot = { docs: mockNotificationData };
        collection.mockReturnValue(fakeCollection);
        doc.mockReturnValue(fakeDoc);
        getDocs.mockResolvedValueOnce(fakeNotificationSnapshot);

        const notifications = await getNotifications(mockUserID);

        expect(collection).toHaveBeenCalledWith(fakeDoc,  'Notifications');
        expect(getDocs).toHaveBeenCalledWith(fakeCollection);
        expect(notifications).toHaveLength(3); // Two notifications should pass the filtering condition
 
    });
    test('should set notification viewed correctly', async () => {
        const mockEmail = 'mockEmail';
        const mockNotificationID = 'mockNotificationID';
        const fakeDoc = jest.fn();
        const fakeCollection = jest.fn();
        const fakeNotificationRef = jest.fn();
        collection.mockReturnValue(fakeCollection);
        doc.mockReturnValue(fakeDoc);
        doc.mockReturnValue(fakeNotificationRef);

        await setNotificationViewed(mockEmail, mockNotificationID);

        expect(collection).toHaveBeenCalledWith(fakeDoc,  'Notifications');
        expect(doc).toHaveBeenCalledWith(fakeCollection, mockNotificationID);
        expect(updateDoc).toHaveBeenCalledWith(fakeNotificationRef, { viewed: true });
    });
    test('should add a reservation notification correctly', async () => {
        const mockEmail = 'mockEmail';
        const mockReservationData = {
            propertyID: 'mockPropertyID',
            facilityID: 'mockFacilityID',
            startTime: '08:00',
            endTime: '10:00',
            month: 3,
            date: 12,
        };
        const mockFacilityData = {
            type: 'mockFacilityType',
        };
        const mockDocRef = { id: 'mockDocRefID' };
        const fakeDoc = jest.fn();
        const fakePropertyFacilityDoc = jest.fn();
        const fakeCollection = jest.fn();
        const fakeNotificationCollection = jest.fn();
        const fakeNotificationDocRef = jest.fn();

        doc.mockReturnValueOnce(fakePropertyFacilityDoc);
        getDoc.mockResolvedValueOnce({ data: () => mockFacilityData });
        collection.mockReturnValueOnce(fakeCollection);
        collection.mockReturnValueOnce(fakeNotificationCollection);
        addDoc.mockResolvedValueOnce(mockDocRef);
        updateDoc.mockResolvedValueOnce();

        const notificationID = await addReservationNotification(mockEmail, mockReservationData);

        expect(doc).toHaveBeenCalledWith(fakeDoc, `Property/${mockReservationData.propertyID}/Facilities/${mockReservationData.facilityID}`);
        expect(getDoc).toHaveBeenCalledWith(fakePropertyFacilityDoc);
        expect(collection).toHaveBeenCalledWith(fakeDoc, 'Users', mockEmail, 'Notifications');
        expect(addDoc).toHaveBeenCalledWith(fakeNotificationCollection, {
            message: `${mockReservationData.startTime}-${mockReservationData.endTime}`,
            path: '/my-reservations',
            date: (new Date(2024, mockReservationData.month, mockReservationData.date, 0, 0, 0, 0).toISOString()),
            type: mockFacilityData.type,
            viewed: false,
            isReservation: true,
        });
        expect(updateDoc).toHaveBeenCalledWith(fakeNotificationDocRef, { id: mockDocRef.id });
        expect(notificationID).toBe(mockDocRef.id);
    });
    test('should add a request notification correctly for Users', async () => {
        const mockDestinatiorType = 0; // Assuming 0 is for Users
        const mockEmail = 'mockEmail';
        const mockRequestData = {
            type: 'mockRequestType',
            notes: 'mockRequestNotes',
            condoID: 'mockCondoID',
        };
        const mockDocRef = { id: 'mockDocRefID' };
        const fakeDoc = jest.fn();
        const fakeCollection = jest.fn();
        const fakeNotificationCollection = jest.fn();
        const fakeNotificationDocRef = jest.fn();

        collection.mockReturnValueOnce(fakeCollection);
        collection.mockReturnValueOnce(fakeNotificationCollection);
        addDoc.mockResolvedValueOnce(mockDocRef);
        updateDoc.mockResolvedValueOnce();

        const notificationID = await addRequestNotification(mockDestinatiorType, mockEmail, mockRequestData);

        expect(collection).toHaveBeenCalledWith(fakeDoc, 'Users', mockEmail, 'Notifications');
        expect(addDoc).toHaveBeenCalledWith(fakeNotificationCollection, {
            type: mockRequestData.type,
            message: mockRequestData.notes,
            path: `/condo-details/${mockRequestData.condoID}`,
            date: expect.any(String),
            viewed: false,
            isReservation: false,
        });
        expect(updateDoc).toHaveBeenCalledWith(fakeNotificationDocRef, { id: mockDocRef.id });
        expect(notificationID).toBe(mockDocRef.id);
    });

});
