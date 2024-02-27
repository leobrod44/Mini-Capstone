import { getUserData, getCompanyData } from '../backend/Fetcher'; // Adjust the path accordingly
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';


jest.mock('firebase/firestore', () => {
    const mockGetDoc = jest.fn();
  
    return {
      getFirestore: jest.fn(() => ({
        doc: jest.fn(() => ({
          getDoc: mockGetDoc
        }))
      })),
      getDoc: mockGetDoc
    };
  });
  
  

describe('Firebase Getter Functions', () => {

  describe('getUserData', () => {
    test('should return user data for valid email', async () => {
      // Mock data and Firestore behavior for the test
      const mockUserData = {
        "role": "mgmt",
        "firstName": "John",
        "lastName": "Doe",
        "email": "johndoe@gmail.com",
        "phoneNumber": "123-456-7890",
        "password": "password123"
      };
      const mockGetDoc = jest.fn().mockResolvedValue({ data: jest.fn(() => mockUserData), exists: true });
      const mockDocRef = jest.fn();
      mockDocRef.mockReturnValue({ getDoc: mockGetDoc });

      // Mock Firestore behavior
      getFirestore.mockReturnValue({
        doc: mockDocRef
      });

      const email = 'johndoe@gmail.com'; // Provide a valid email for testing
      const userData = await getUserData(email);
      expect(userData).toEqual(mockUserData);
    });

    test('should return undefined for non-existing user email', async () => {
      // Mock Firestore behavior for the test
      const mockGetDoc = jest.fn().mockResolvedValue({ exists: false });
      const mockDocRef = jest.fn();
      mockDocRef.mockReturnValue({ getDoc: mockGetDoc });

      // Mock Firestore behavior
      getFirestore.mockReturnValue({
        doc: mockDocRef
      });

      const email = 'nonexisting@example.com'; // Provide a non-existing email for testing
      const userData = await getUserData(email);
      expect(userData).toBeUndefined();
    });
  });

  describe('getCompanyData', () => {
    test('should return company data for valid email', async () => {
      // Mock data and Firestore behavior for the test
      const mockCompanyData = { /* mock company data */ };
      const mockGetDoc = jest.fn().mockResolvedValue({ data: jest.fn(() => mockCompanyData), exists: true });
      const mockDocRef = jest.fn();
      mockDocRef.mockReturnValue({ getDoc: mockGetDoc });

      // Mock Firestore behavior
      getFirestore.mockReturnValue({
        doc: mockDocRef
      });

      const email = 'company@example.com'; // Provide a valid company email for testing
      const companyData = await getCompanyData(email);
      expect(companyData).toEqual(mockCompanyData);
    });

    test('should return undefined for non-existing company email', async () => {
      // Mock Firestore behavior for the test
      const mockGetDoc = jest.fn().mockResolvedValue({ exists: false });
      const mockDocRef = jest.fn();
      mockDocRef.mockReturnValue({ getDoc: mockGetDoc });

      // Mock Firestore behavior
      getFirestore.mockReturnValue({
        doc: mockDocRef
      });

      const email = 'nonexistingcompany@example.com'; // Provide a non-existing company email for testing
      const companyData = await getCompanyData(email);
      expect(companyData).toBeUndefined();
    });
  });
});
