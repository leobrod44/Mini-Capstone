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
    const fakeData = {
      role: "mgmt",
      firstName: "John",
      lastName: "Doe",
      email: "johndoe@gmail.com",
      phoneNumber: "123-456-7890",
      password: "password123"
    };
    const fakeDocSnap = { exists: jest.fn(() => true), data: jest.fn(() => fakeData) };
    const fakeDocRef = jest.fn();
    doc.mockReturnValue(fakeDocRef);
    getDoc.mockResolvedValue(fakeDocSnap);

    const result = await getUserData(fakeData.email);

    expect(result).toEqual(fakeData);
    expect(doc).toHaveBeenCalledWith(expect.anything(), 'Users', fakeData.email);
    expect(getDoc).toHaveBeenCalledWith(expect.anything());
  });

  test('getCompanyData: should return company data if document exists', async () => {
    const fakeData = {
      role: "mgmt",
      firstName: "John",
      lastName: "Doe",
      email: "johndoe@gmail.com",
      phoneNumber: "123-456-7890",
      password: "password123"
    };
    const fakeDocSnap = { exists: jest.fn(() => true), data: jest.fn(() => fakeData) };
    const fakeDocRef = jest.fn();
    doc.mockReturnValue(fakeDocRef);
    getDoc.mockResolvedValue(fakeDocSnap);

    const result = await getCompanyData(fakeData.email);

    expect(result).toEqual(fakeData);
    expect(doc).toHaveBeenCalledWith(expect.anything(), 'Company', fakeData.email);
    expect(getDoc).toHaveBeenCalledWith(expect.anything());
  });

});
