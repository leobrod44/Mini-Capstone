import { addFacility,makeReservation, getMonthlyReservations, getFacilities,getPropertiesJoinReservationAndFacilities } from "../backend/FacilityHandler"; // Update with your module path
import { getUserCondos, getPropertyData } from "../backend/PropertyHandler"; // Update with your module path
import { db, doc, collection, addDoc,getDoc, updateDoc,setDoc,getFirestore,deleteDoc,getDocs } from 'firebase/firestore'; // Assuming you're using Firebase Firestore

jest.mock('firebase/firestore', () => ({
  db: jest.fn(),
  doc: jest.fn(),
  collection: jest.fn(),
  addDoc: jest.fn(),
  doc: jest.fn(),
  getDoc: jest.fn(),
  updateDoc: jest.fn(),
  setDoc: jest.fn(),
  getFirestore: jest.fn(() => "mockedDb"),
  deleteDoc: jest.fn(),
  getDocs: jest.fn(),
}));

jest.mock('../backend/PropertyHandler', () => ({
    getUserCondos: jest.fn(),
    getPropertyData: jest.fn()
    }));


describe('addFacility function', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should add a facility document to the amenities collection', async () => {
    // Mock data
    const facility = {
      propertyID: 'fakePropertyID',
      title: 'Gym',
      description: 'Test gym facility',
    };

    const fakePropertyRef = jest.fn();
    const fakeAmenitiesColl = jest.fn();
    const fakeDocRef = jest.fn();

    doc.mockReturnValueOnce(fakePropertyRef);
    collection.mockReturnValueOnce(fakeAmenitiesColl);
    addDoc.mockResolvedValueOnce(fakeDocRef);

    // Call the function
    await addFacility(facility);

    // Assertions
    expect(doc).toHaveBeenCalledWith("mockedDb", 'Property', facility.propertyID);
    expect(collection).toHaveBeenCalledWith(fakePropertyRef, 'Facilities');
    expect(addDoc).toHaveBeenCalledWith(fakeAmenitiesColl, {
      propertyID: facility.propertyID,
      type: facility.title,
      description: facility.description,
      dailyAvailabilities: 24, // Ensure dailyAvailabilities is set
      blockSize: 1, // Ensure blockSize is set
    });
  });
  test('should return facilities for a property', async () => {
    // Mock data
    const propertyID = 'fakePropertyID';
    const fakePropertyRef = jest.fn();
    const fakeFacilityCollectionRef = jest.fn();
    const fakeFacilityDocs = [
      { data: jest.fn(() => ({ id: 'fakeFacilityID1', name: 'Gym' })) },
      { data: jest.fn(() => ({ id: 'fakeFacilityID2', name: 'Pool' })) },
    ];

    doc.mockReturnValueOnce(fakePropertyRef);
    collection.mockReturnValueOnce(fakeFacilityCollectionRef);
    getDocs.mockResolvedValueOnce(fakeFacilityDocs);

    // Call the function
    const facilities = await getFacilities(propertyID);

    // Assertions
    expect(doc).toHaveBeenCalledWith("mockedDb", 'Property', propertyID);
    expect(collection).toHaveBeenCalledWith(fakePropertyRef, 'Facilities');
    expect(getDocs).toHaveBeenCalledWith(fakeFacilityCollectionRef);
    expect(facilities).toEqual([
      { id: 'fakeFacilityID1', name: 'Gym' },
      { id: 'fakeFacilityID2', name: 'Pool' },
    ]);
  });

});


describe('makeReservation function', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });
  
    test('should make a reservation and update user reservations', async () => {
      // Mock data
      const reservation = {
        month: 'April',
        propertyID: 'fakePropertyID',
        facilityID: 'fakeFacilityID',
        date: '2024-04-01',
        startTime: '10:00',
        endTime: '12:00',
        userID: 'fakeUserID',
      };
  
      const fakePropertyRef = jest.fn();
      const fakeFacilityRef = jest.fn();
      const fakeMonthCollectionRef = jest.fn();
      const fakeDocRef = { id: 'fakeDocID' };
      const fakeUserRef = jest.fn();
      const fakeUserDoc = { data: jest.fn(() => ({ reservations: [] })) };
  
      doc.mockReturnValueOnce(fakePropertyRef);
      collection.mockReturnValueOnce(fakeFacilityRef);
      doc.mockReturnValueOnce(fakeFacilityRef);
      collection.mockReturnValueOnce(fakeMonthCollectionRef);
      addDoc.mockResolvedValueOnce(fakeDocRef);
      doc.mockReturnValueOnce(fakeUserRef);
      getDoc.mockResolvedValueOnce(fakeUserDoc);
  
      // Call the function
      await makeReservation(reservation);
  
      // Assertions
      expect(doc).toHaveBeenCalledWith("mockedDb", 'Property', reservation.propertyID);
      expect(collection).toHaveBeenCalledWith(fakePropertyRef, 'Facilities');
      expect(doc).toHaveBeenCalledWith(fakeFacilityRef, reservation.facilityID);
      expect(collection).toHaveBeenCalledWith(fakeFacilityRef, reservation.month);
      expect(addDoc).toHaveBeenCalledWith(fakeMonthCollectionRef, {
        date: reservation.date,
        startTime: reservation.startTime,
        endTime: reservation.endTime,
        userID: reservation.userID,
      });
      expect(doc).toHaveBeenCalledWith("mockedDb", 'Users', reservation.userID);
      expect(updateDoc).toHaveBeenCalledWith(fakeUserRef, {
        reservations: [`Property/${reservation.propertyID}/Facilities/${reservation.facilityID}/${reservation.month}/${fakeDocRef.id}`],
      });
    });
    test('should return monthly reservations for a facility', async () => {
        // Mock data
        const propertyID = 'fakePropertyID';
        const facilityID = 'fakeFacilityID';
        const month = 'April';
    
        const fakePropertyRef = jest.fn();
        const fakeFacilityRef = jest.fn();
        const fakeMonthCollectionRef = jest.fn();
        const fakeReservationDocs = [
          { data: jest.fn(() => ({ date: '2024-04-01', startTime: '10:00' })) },
          { data: jest.fn(() => ({ date: '2024-04-02', startTime: '12:00' })) },
        ];
    
        doc.mockReturnValueOnce(fakePropertyRef);
        collection.mockReturnValueOnce(fakeFacilityRef);
        doc.mockReturnValueOnce(fakeFacilityRef);
        collection.mockReturnValueOnce(fakeMonthCollectionRef);
        getDocs.mockResolvedValueOnce(fakeReservationDocs);
    
        // Call the function
        const reservations = await getMonthlyReservations(propertyID, facilityID, month);
    
        // Assertions
        expect(doc).toHaveBeenCalledWith("mockedDb", 'Property', propertyID);
        expect(collection).toHaveBeenCalledWith(fakePropertyRef, 'Facilities');
        expect(doc).toHaveBeenCalledWith(fakeFacilityRef, facilityID);
        expect(collection).toHaveBeenCalledWith(fakeFacilityRef, month);
        expect(getDocs).toHaveBeenCalledWith(fakeMonthCollectionRef);
        expect(reservations).toEqual({
          '2024-04-01': ['10:00'],
          '2024-04-02': ['12:00'],
        });
      });
      test('should return properties with reservations and facilities', async () => {
        // Mock data
        const userID = 'fakeUserID';
        const userDocData = {
          reservations: ['Property/fakePropertyID1/Facilities/fakeFacilityID1/April/fakeDocID1'],
        };
        const fakeUserDoc = { data: jest.fn(() => userDocData) };
        const fakeCondos = [{ property: 'fakePropertyID1' }, { property: 'fakePropertyID2' }];
        const fakePropertyData1 = { id: 'fakePropertyID1', /* other property data */ };
        const fakePropertyData2 = { id: 'fakePropertyID2', /* other property data */ };
        const fakeFacilities1 = [{ id: 'fakeFacilityID1', name: 'Gym' }];
        const fakeFacilities2 = [{ id: 'fakeFacilityID2', name: 'Pool' }];
        const fakeReservations1 = {data: jest.fn(() => {'2024-04-01', ['10:00']}) };
        getDoc.mockResolvedValueOnce(fakeUserDoc);
        getUserCondos.mockResolvedValueOnce(fakeCondos);
        getDocs.mockResolvedValue([fakeUserDoc]); 
        getDoc.mockResolvedValueOnce(fakeReservations1);
        getPropertyData.mockImplementation((propertyID) => {
            if (propertyID === 'fakePropertyID1') {
              return Promise.resolve(fakePropertyData1);
            } else if (propertyID === 'fakePropertyID2') {
              return Promise.resolve(fakePropertyData2);
            }
          });
    
        // Call the function
        const propertiesData = await getPropertiesJoinReservationAndFacilities(userID);
          
        // Assertions

        // Ensure the mocked getFacilities function was called with the expected arguments

        // Add more assertions as needed to ensure the returned data is correct
      });
    

  });