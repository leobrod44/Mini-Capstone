import {
  getCompanyData,
  getUserData,
  updateUserInfo,
  updateCompanyInfo,
  changePassword,
  addUser,
  addCompany,
  checkEmailExists,
} from "../backend/Fetcher"; // Import your function
import {
  doc,
  getDoc,
  updateDoc,
  setDoc,
  getFirestore,
} from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Mock Firebase storage functions
jest.mock("firebase/firestore", () => ({
  doc: jest.fn(),
  getDoc: jest.fn(),
  updateDoc: jest.fn(),
  setDoc: jest.fn(),
  getFirestore: jest.fn(() => "mockedDb"),
}));
jest.mock("firebase/storage", () => ({
  getStorage: jest.fn(),
}));

describe("getting user/company data functions", () => {
  afterEach(() => {
    jest.clearAllMocks(); // Clear mock function calls after each test
  });

  test("getUserData: should return user data if document exists", async () => {
    const fakeData = {
      role: "mgmt",
      firstName: "John",
      lastName: "Doe",
      email: "johndoe@gmail.com",
      phoneNumber: "123-456-7890",
      password: "password123",
    };
    const fakeDocSnap = {
      exists: jest.fn(() => true),
      data: jest.fn(() => fakeData),
    };
    const fakeDocRef = jest.fn();
    doc.mockReturnValue(fakeDocRef);
    getDoc.mockResolvedValue(fakeDocSnap);

    const result = await getUserData(fakeData.email);

    expect(result).toEqual(fakeData);
    expect(doc).toHaveBeenCalledWith(
      expect.anything(),
      "Users",
      fakeData.email
    );
    expect(getDoc).toHaveBeenCalledWith(expect.anything());
  });

  test("getCompanyData: should return company data if document exists", async () => {
    const fakeData = {
      role: "mgmt",
      firstName: "John",
      lastName: "Doe",
      email: "johndoe@gmail.com",
      phoneNumber: "123-456-7890",
      password: "password123",
    };
    const fakeDocSnap = {
      exists: jest.fn(() => true),
      data: jest.fn(() => fakeData),
    };
    const fakeDocRef = jest.fn();
    doc.mockReturnValue(fakeDocRef);
    getDoc.mockResolvedValue(fakeDocSnap);

    const result = await getCompanyData(fakeData.email);

    expect(result).toEqual(fakeData);
    expect(doc).toHaveBeenCalledWith(
      expect.anything(),
      "Company",
      fakeData.email
    );
    expect(getDoc).toHaveBeenCalledWith(expect.anything());
  });
});

describe("update user/company info functions", () => {
  afterEach(() => {
    jest.clearAllMocks(); // Clear mock function calls after each test
  });

  test("updateUserInfo: should update user info in Firestore", async () => {
    const fakeEmail = "johndoe@gmail.com";
    const fakeData = {
      firstName: "John",
      lastName: "Doe",
      phoneNumber: "123-456-7890",
    };
    const fakeDocRef = jest.fn();
    doc.mockReturnValue(fakeDocRef);

    await updateUserInfo(fakeEmail, fakeData);

    expect(doc).toHaveBeenCalledWith(expect.anything(), "Users", fakeEmail);
    expect(updateDoc).toHaveBeenCalledWith(fakeDocRef, fakeData);
  });

  test("updateCompanyInfo: should update company info in Firestore", async () => {
    const fakeEmail = "company@example.com";
    const fakeData = {
      companyName: "Example Company",
      phoneNumber: "987-654-3210",
    };
    const fakeDocRef = jest.fn();
    doc.mockReturnValue(fakeDocRef);

    await updateCompanyInfo(fakeEmail, fakeData);

    expect(doc).toHaveBeenCalledWith(expect.anything(), "Company", fakeEmail);
    expect(updateDoc).toHaveBeenCalledWith(fakeDocRef, fakeData);
  });
});

describe("changePassword function", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should change user password if current password matches and new password is different", async () => {
    // Mock user document exists
    const fakeUserDoc = {
      exists: jest.fn(() => true),
      data: jest.fn(() => ({ password: "oldPassword" })),
    };
    doc.mockReturnValue(fakeUserDoc);
    getDoc.mockResolvedValue(fakeUserDoc);

    // Mock updateDoc function
    updateDoc.mockResolvedValue();

    const email = "test@example.com";
    const data = {
      email,
      currentPassword: "oldPassword",
      newPassword: "newPassword",
    };

    await expect(changePassword(email, data)).resolves.toEqual({
      message: "Password updated successfully",
    });
    expect(updateDoc).toHaveBeenCalledWith(doc(), { password: "newPassword" });
  });
});

describe("checkEmailExists function", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should not throw an error if user exists", async () => {
    // Setup
    const email = "existing@example.com";
    const fakeDocSnap = { exists: jest.fn(() => true) }; // Mock document snapshot that exists
    getDoc.mockResolvedValue(fakeDocSnap);

    // Action & Assertion
    await expect(checkEmailExists(email)).resolves.not.toThrow();
  });

  test("should throw an error if user does not exist", async () => {
    // Setup
    const email = "nonexistent@example.com";
    const fakeDocSnap = { exists: jest.fn(() => false) }; // Mock document snapshot that does not exist
    getDoc.mockResolvedValue(fakeDocSnap);

    // Action & Assertion
    await expect(checkEmailExists(email)).rejects.toThrow(
      "Cannot find any users with this email."
    );
  });

  // Optional: Test error handling for unexpected Firestore errors
  test("should handle Firestore errors", async () => {
    // Setup
    const email = "error@example.com";
    const errorMessage = "Unexpected Firestore error";
    getDoc.mockRejectedValue(new Error(errorMessage));

    // Action & Assertion
    await expect(checkEmailExists(email)).rejects.toThrow(
      "Error: Unexpected Firestore error"
    );
  });
});
