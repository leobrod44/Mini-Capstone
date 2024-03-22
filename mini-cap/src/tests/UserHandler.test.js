import {
  getCompanyData,
  getUserData,
  updateUserInfo,
  updateCompanyInfo,
  changePassword,
  addUser,
  addCompany,
  checkEmailExists,
  loginUser,
  storeData,
  deleteAccount,
  getCompanyEmail
} from "../backend/UserHandler";
import {
  doc,
  getDoc,
  updateDoc,
  setDoc,
  deleteDoc,
  getFirestore,
} from "firebase/firestore";
import * as UserHandler from "../backend/UserHandler";

import { getStorage } from "firebase/storage";
import {setPicture} from "../backend/ImageHandler";

// Mock Firebase storage functions
jest.mock("firebase/firestore", () => ({
  doc: jest.fn(),
  getDoc: jest.fn(),
  updateDoc: jest.fn(),
  setDoc: jest.fn(),
  getFirestore: jest.fn(() => "mockedDb"),
  deleteDoc: jest.fn(),
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

  test("should change company password if current password matches and new password is different", async () => {
    // Mock company document exists
    const fakeCompanyDoc = {
      exists: jest.fn(() => true),
      data: jest.fn(() => ({ password: "oldCompanyPassword" })),
    };
    doc.mockReturnValue(fakeCompanyDoc);
    getDoc
      .mockResolvedValueOnce({ exists: jest.fn(() => false), data: jest.fn() }) // Simulate user not found
      .mockResolvedValueOnce(fakeCompanyDoc); // Simulate company found

    // Mock updateDoc function
    updateDoc.mockResolvedValue();

    const email = "company@example.com";
    const data = {
      email,
      currentPassword: "oldCompanyPassword",
      newPassword: "newCompanyPassword",
    };

    await expect(changePassword(email, data)).resolves.toEqual({
      message: "Password updated successfully",
    });
    expect(updateDoc).toHaveBeenCalledWith(expect.anything(), {
      password: "newCompanyPassword",
    });
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

//loginUser
describe("logging in", () => {
  afterEach(() => {
    jest.clearAllMocks(); // Clear mock function calls after each test
  });

  test("loginUser: should login the user", async () => {
    const mockUserData = {
      email: "johndoe@gmail.com",
      password: "password12",
    };
    const fakeUserDocSnap = {
      exists: jest.fn(() => true),
      data: jest.fn(() => mockUserData),
    };
    const fakeUserDocRef = jest.fn();
    doc.mockReturnValueOnce(fakeUserDocRef);
    getDoc.mockResolvedValueOnce(fakeUserDocSnap);

    const fakeCompanyDocSnap = { exists: jest.fn(() => false) };
    const fakeCompanyDocRef = jest.fn();
    doc.mockReturnValueOnce(fakeCompanyDocRef);
    getDoc.mockResolvedValueOnce(fakeCompanyDocSnap);

    await expect(loginUser(mockUserData)).resolves.not.toThrow();
  });

  test("loginUser: should login the company", async () => {
    const mockCompanyData = {
      email: "chad@gmail.com",
      password: "password123",
    };
    const fakeUserDocSnap = { exists: jest.fn(() => false) };
    const fakeUserDocRef = jest.fn();
    doc.mockReturnValueOnce(fakeUserDocRef);
    getDoc.mockResolvedValueOnce(fakeUserDocSnap);

    const fakeCompanyDocSnap = {
      exists: jest.fn(() => true),
      data: jest.fn(() => mockCompanyData),
    };
    const fakeCompanyDocRef = jest.fn();
    doc.mockReturnValueOnce(fakeCompanyDocRef);
    getDoc.mockResolvedValueOnce(fakeCompanyDocSnap);

    await expect(loginUser(mockCompanyData)).resolves.not.toThrow();
  });

  test("loginUser: should fail user login", async () => {
    const mockUserData = {
      email: "johndoe@gmail.com",
      password: "password12",
    };
    const fakeUserDocSnap = { exists: jest.fn(() => false) };
    const fakeUserDocRef = jest.fn();
    doc.mockReturnValueOnce(fakeUserDocRef);
    getDoc.mockResolvedValueOnce(fakeUserDocSnap);

    const fakeCompanyDocSnap = { exists: jest.fn(() => false) };
    const fakeCompanyDocRef = jest.fn();
    doc.mockReturnValueOnce(fakeCompanyDocRef);
    getDoc.mockResolvedValueOnce(fakeCompanyDocSnap);

    await expect(loginUser(mockUserData)).rejects.toThrow(
      "User does not exist."
    );
  });

  test("loginUser: should fail company login", async () => {
    const mockCompanyData = {
      email: "chad@gmail.com",
      password: "password123",
    };
    const fakeUserDocSnap = { exists: jest.fn(() => false) };
    const fakeUserDocRef = jest.fn();
    doc.mockReturnValueOnce(fakeUserDocRef);
    getDoc.mockResolvedValueOnce(fakeUserDocSnap);

    const fakeCompanyDocSnap = { exists: jest.fn(() => false) };
    const fakeCompanyDocRef = jest.fn();
    doc.mockReturnValueOnce(fakeCompanyDocRef);
    getDoc.mockResolvedValueOnce(fakeCompanyDocSnap);

    await expect(loginUser(mockCompanyData)).rejects.toThrow(
      "User does not exist."
    );
  });
});

//storeData
describe("storeData function", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should store data in Firestore and return document reference", async () => {
    const mockCollection = "Users";
    const mockData = {
      firstName: "Store",
      lastName: "Data",
      email: "storeDataTest@gmail.com",
      phoneNumber: "123-456-7890",
      password: "store123",
    };
    const mockKey = mockData["email"];

    const fakeDocRef = jest.fn();
    doc.mockReturnValue(fakeDocRef);

    setDoc.mockImplementation(() => Promise.resolve());

    const result = storeData(mockCollection, mockData, mockKey);
    await result;

    expect(doc).toHaveBeenCalledWith(
      expect.anything(),
      mockCollection,
      mockKey
    );
    expect(setDoc).toHaveBeenCalledWith(fakeDocRef, mockData);
    expect(setDoc).toHaveBeenCalledTimes(1);
    expect(doc).toHaveBeenCalledTimes(1);
  });

  test("should throw an error if an invalid collection is provided", async () => {
    const mockData = {
      firstName: "Store",
      lastName: "Data",
      email: "storeDataTest@gmail.com",
      phoneNumber: "123-456-7890",
      password: "store123",
    };
    const mockKey = mockData["email"];

    doc.mockImplementation((...args) => {
      throw new Error(`Unexpected call to doc with arguments: ${args}`);
    });

    await expect(storeData(undefined, mockData, mockKey)).rejects.toThrowError(
      "Error adding document: "
    );

    expect(doc).toHaveBeenCalledWith(
      "mockedDb",
      undefined,
      "storeDataTest@gmail.com"
    );
  });
});

//deleteAccount
describe("deleteAccount function", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should delete user account if exists", async () => {
    const mockEmail = "existingUser@gmail.com";

    const fakeUserDoc = { exists: jest.fn(() => true) };
    getDoc.mockResolvedValueOnce(fakeUserDoc);

    await deleteAccount(mockEmail);

    expect(getDoc).toHaveBeenCalledTimes(2);
    expect(deleteDoc).toHaveBeenCalledTimes(1);
  });

  test("should delete company account if exists", async () => {
    const mockEmail = "existingCompany@gmail.com";

    const fakeCompanyDoc = { exists: jest.fn(() => true) };
    getDoc.mockResolvedValueOnce(fakeCompanyDoc);

    await deleteAccount(mockEmail);

    expect(getDoc).toHaveBeenCalledTimes(2);
    expect(deleteDoc).toHaveBeenCalledTimes(1);
  });

  test("should throw an error if user does not exist", async () => {
    const mockEmail = "nonexistentUser@gmail.com";

    const fakeUserDoc = { exists: jest.fn(() => false) };
    getDoc.mockResolvedValueOnce(fakeUserDoc);

    await expect(deleteAccount(mockEmail)).rejects.toThrowError(
      "Cannot read properties of undefined (reading 'exists')"
    );

    expect(getDoc).toHaveBeenCalledTimes(2);
    expect(deleteDoc).not.toHaveBeenCalled();
  });

  test("should throw an error if company does not exist", async () => {
    const mockEmail = "nonexistentCompany@gmail.com";

    const fakeCompanyDoc = { exists: jest.fn(() => false) };
    getDoc.mockResolvedValueOnce(fakeCompanyDoc);

    await expect(deleteAccount(mockEmail)).rejects.toThrowError(
      "Cannot read properties of undefined (reading 'exists')"
    );

    expect(getDoc).toHaveBeenCalledTimes(2);
    expect(deleteDoc).not.toHaveBeenCalled();
  });
});

describe("addUser function", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should throw an error if the user already exists", async () => {
    const fakeUserDocSnap = { exists: jest.fn(() => true) };
    getDoc.mockResolvedValue(fakeUserDocSnap);

    const userData = {
      email: "existingUser@example.com",
    };

    await expect(addUser(userData)).rejects.toThrow("User already exists.");
  });

  test("should throw an error if a company with the same email already exists", async () => {
    const fakeUserDocSnap = { exists: jest.fn(() => false) };
    const fakeCompanyDocSnap = { exists: jest.fn(() => true) };
    getDoc
      .mockResolvedValueOnce(fakeUserDocSnap)
      .mockResolvedValueOnce(fakeCompanyDocSnap);

    const userData = {
      email: "existingCompany@example.com",
    };

    // Adjust the expected error message to match your function's actual error
    await expect(addUser(userData)).rejects.toThrow("Company already exists.");
  });
});

// Mocking the helper functions
describe("addCompany function", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should throw an error if the company already exists", async () => {
    // Mock Firestore to simulate no existing user but an existing company with the given email
    const fakeUserDocSnap = {exists: jest.fn(() => false)};
    const fakeCompanyDocSnap = {exists: jest.fn(() => true)};
    getDoc
        .mockResolvedValueOnce(fakeUserDocSnap) // First call for the user, not found
        .mockResolvedValueOnce(fakeCompanyDocSnap); // Second call for the company, found

    const companyData = {
      email: "existingCompany@example.com",
    };

    // Test expects the function to throw an error indicating a company already exists
    await expect(addCompany(companyData)).rejects.toThrow(
        new Error("Company already exists.")
    );
  });

  test("should throw an error if a user with the same email already exists", async () => {
    // Mock Firestore to simulate an existing user with the given email
    const fakeUserDocSnap = {exists: jest.fn(() => true)};
    getDoc.mockResolvedValueOnce(fakeUserDocSnap);

    const companyData = {
      email: "existingUser@example.com",
    };

    // Test expects the function to throw an error indicating a user already exists
    await expect(addCompany(companyData)).rejects.toThrow(
        new Error("User already exists.")
    );
  });
});


jest.mock('../backend/ImageHandler.js', () => ({
  setPicture: jest.fn()
}));

describe("addCompany function, more", () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    test("should throw an error if an error occurs while setting profile picture", async () => {
      setPicture.mockRejectedValueOnce(new Error("Mocked error while setting picture"));

      const companyData = {
        email: "test@example.com",
      };

      await expect(addCompany(companyData)).rejects.toThrow(new Error("Cannot read properties of undefined (reading 'exists')"));
    });

  test("should mock storing picture", async () => {
    // Mock Firestore to simulate no existing user but no existing company with the given email
    const fakeUserDocSnap = { exists: jest.fn(() => false) };
    const fakeCompanyDocSnap = { exists: jest.fn(() => false) };

    getDoc
        .mockResolvedValueOnce(fakeUserDocSnap) // First call for the user, not found
        .mockResolvedValueOnce(fakeCompanyDocSnap); // Second call for the company, not found

    const companyData = {
      email: "existingUser@example.com",
    };

    await expect(addCompany(companyData)).rejects.toThrow(
        new Error("Error adding document: Error adding document: Cannot read properties of undefined (reading 'then')")
    );
  });
});

describe("addUser function, more", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should throw an error if an error occurs while setting profile picture", async () => {
    setPicture.mockRejectedValueOnce(new Error("Mocked error while setting picture"));

    const userData = {
      email: "test@example.com",
    };

    await expect(addUser(userData)).rejects.toThrow(new Error("TypeError: Cannot read properties of undefined (reading 'exists')"));
  });

  test("should mock storing picture", async () => {
    // Mock Firestore to simulate no existing user but no existing company with the given email
    const fakeUserDocSnap = { exists: jest.fn(() => false) };
    const fakeCompanyDocSnap = { exists: jest.fn(() => false) };

    getDoc
        .mockResolvedValueOnce(fakeUserDocSnap) // First call for the user, not found
        .mockResolvedValueOnce(fakeCompanyDocSnap); // Second call for the company, not found

    const userData = {
      email: "existingUser@example.com",
    };

    await expect(addUser(userData)).rejects.toThrow(
        new Error("Error: Error adding document: Error adding document: Cannot read properties of undefined (reading 'then')")
    );
  });
});

describe("getCompanyEmail function", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("getCompanyEmail function should return undefined if condo document does not exist", async () => {
    // Mock data
    const conId = "nonExistingCondoId";
    const fakeCondoDocSnap = {
      exists: jest.fn(() => false), // Simulate non-existing condo document
    };

    // Mock Firestore function behavior
    const fakeCondoDocRef = jest.fn();
    doc.mockReturnValue(fakeCondoDocRef);
    getDoc.mockResolvedValue(fakeCondoDocSnap);

    // Call the function
    const result = await getCompanyEmail(conId);

    // Assertions
    expect(result).toBeUndefined();
    expect(doc).toHaveBeenCalledWith(expect.anything(), "Condo", conId);
    expect(getDoc).toHaveBeenCalledWith(fakeCondoDocRef);
  });

  test("should return null if condo or property document does not exist", async () => {
    // Mock Firestore to simulate non-existing condo and property documents
    const fakeNonExistingCondoId = "nonExistingCondoId";

    const fakeCondoDocSnap = { exists: jest.fn(() => false) };
    doc.mockReturnValue(fakeCondoDocSnap);

    const result = await getCompanyEmail(fakeNonExistingCondoId);

    expect(result).toBeNull();
    expect(doc).toHaveBeenCalledTimes(1);
    expect(doc).toHaveBeenCalledWith(expect.anything(), "Condo", fakeNonExistingCondoId);
  });

  test("getCompanyEmail function should return null if property document does not exist", async () => {
    // Mock data
    const fakeCondoId = "fakeCondoId";
    const fakePropertyId = "nonExistingPropertyId";

    const fakeCondoDocSnap = {
      exists: jest.fn(() => true),
      data: jest.fn(() => ({ property: fakePropertyId })),
    };
    const fakePropertyDocSnap = { exists: jest.fn(() => false) };

    // Mock Firestore function behavior
    const fakeCondoDocRef = jest.fn();
    const fakePropertyDocRef = jest.fn();
    doc.mockImplementation((db, collection, id) => {
      if (collection === "Condo" && id === fakeCondoId) {
        return fakeCondoDocRef;
      } else if (collection === "Property" && id === fakePropertyId) {
        return fakePropertyDocRef;
      }
    });
    getDoc.mockImplementation((docRef) => {
      if (docRef === fakeCondoDocRef) {
        return Promise.resolve(fakeCondoDocSnap);
      } else if (docRef === fakePropertyDocRef) {
        return Promise.resolve(fakePropertyDocSnap);
      }
    });

    // Call the function
    const result = await getCompanyEmail(fakeCondoId);

    // Assertions
    expect(result).toBeUndefined();
    expect(doc).toHaveBeenCalledTimes(2);
    expect(doc).toHaveBeenCalledWith(expect.anything(), "Condo", fakeCondoId);
    expect(doc).toHaveBeenCalledWith(expect.anything(), "Property", fakePropertyId);
  });


  test("should return null if error occurs during the process", async () => {
    // Mock Firestore to simulate an error during the process
    const fakeCondoId = "fakeCondoId";
    const errorMessage = "Firestore error";

    doc.mockImplementation(() => {
      throw new Error(errorMessage);
    });

    const result = await getCompanyEmail(fakeCondoId);

    expect(result).toBeNull();
    expect(doc).toHaveBeenCalledTimes(1);
    expect(doc).toHaveBeenCalledWith(expect.anything(), "Condo", fakeCondoId);
    console.error = jest.fn(); // Prevent error from being logged in the test output
  });

  test("getCompanyEmail function should return company owner from property document", async () => {
    // Mock data
    const fakeCondoId = "fakeCondoId";
    const fakePropertyId = "fakePropertyId";
    const fakeCompanyOwner = "fakeCompanyOwner";

    const fakeCondoDocSnap = {
      exists: jest.fn(() => true),
      data: jest.fn(() => ({ property: fakePropertyId })),
    };
    const fakePropertyDocSnap = {
      exists: jest.fn(() => true),
      data: jest.fn(() => ({ companyOwner: fakeCompanyOwner })),
    };

    // Mock Firestore function behavior
    const fakeCondoDocRef = jest.fn();
    const fakePropertyDocRef = jest.fn();
    doc.mockImplementation((db, collection, id) => {
      if (collection === "Condo" && id === fakeCondoId) {
        return fakeCondoDocRef;
      } else if (collection === "Property" && id === fakePropertyId) {
        return fakePropertyDocRef;
      }
    });
    getDoc.mockImplementation((docRef) => {
      if (docRef === fakeCondoDocRef) {
        return Promise.resolve(fakeCondoDocSnap);
      } else if (docRef === fakePropertyDocRef) {
        return Promise.resolve(fakePropertyDocSnap);
      }
    });

    // Call the function
    const result = await getCompanyEmail(fakeCondoId);

    // Assertions
    expect(result).toEqual(fakeCompanyOwner);
    expect(doc).toHaveBeenCalledTimes(2);
    expect(doc).toHaveBeenCalledWith(expect.anything(), "Condo", fakeCondoId);
    expect(doc).toHaveBeenCalledWith(expect.anything(), "Property", fakePropertyId);
  });

});

