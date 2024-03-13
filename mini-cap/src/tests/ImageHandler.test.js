import { updateUserPicture,getCondoPicture,getProfilePicture,getPropertyPicture, setPicture, setPictureWithID, uploadFile,getPropertyFiles,getUsersFiles } from '../backend/ImageHandler'; // Import your function
import { storage, getStorage, ref, getDownloadURL, deleteObject, uploadBytes, listAll } from 'firebase/storage';
import { getUserData } from '../backend/UserHandler';
import { getCondo } from '../backend/PropertyHandler';
import store from 'storejs';
import { RENTER_OWNER } from '../backend/Constants';
// Mock Firebase storage functions
jest.mock('firebase/storage', () => ({
  getStorage: jest.fn(),
  ref: jest.fn(),
  getDownloadURL: jest.fn(),
  deleteObject: jest.fn(),
  uploadBytes: jest.fn(),
  listAll: jest.fn()
}));
jest.mock('../backend/UserHandler', () => ({
  getUserData: jest.fn()
}));

jest.mock('../backend/PropertyHandler', () => ({
  getCondo: jest.fn()
}));
describe('update image functions', () => {
  afterEach(() => {
    jest.clearAllMocks(); // Clear mock function calls after each test
  });

  test('updateUserPicture: updates user picture successfully', async () => {
    // Mock necessary values
    const email = 'test@example.com';
    const photo = 'mocked_photo_data';
    const mockStorage = {};
    const mockDesertRef = {};
    const mockURL = 'https://example.com/picture.jpg';

    // Mock Firebase storage functions' behavior
    getStorage.mockReturnValue(mockStorage);
    ref.mockReturnValue(mockDesertRef);
    getDownloadURL.mockResolvedValue(mockURL);

    // Call the function
    await updateUserPicture(email, photo);

    // Assertions
    expect(getStorage).toHaveBeenCalled();
    expect(ref).toHaveBeenCalledWith(mockStorage, 'profilePictures/test@example.com');
    expect(getDownloadURL).toHaveBeenCalledWith(mockDesertRef);
    expect(deleteObject).toHaveBeenCalledWith(mockDesertRef);
    expect(uploadBytes).toHaveBeenCalledWith(ref(mockStorage, 'profilePictures/test@example.com'), photo);
  });
  test('uploadUserPicture: should upload user picture to storage', async () => {
    const fakeEmail = 'johndoe@example.com';
    const fakePhoto = 'fakePhotoData'; // Assuming you have some fake photo data

    // Mock storage reference and uploadBytes function
    const fakeStorage = {};
    const fakePictureRef = {};
    const fakeUploadBytesResult = {}; // This can be anything, since we are just mocking the upload function

    getStorage.mockReturnValue(fakeStorage);
    ref.mockReturnValue(fakePictureRef);
    uploadBytes.mockResolvedValue(fakeUploadBytesResult);

    // Call the function
    await updateUserPicture(fakeEmail, fakePhoto);

    // Check if storage functions are called with correct arguments
    expect(getStorage).toHaveBeenCalledTimes(1);
    expect(ref).toHaveBeenCalledWith(fakeStorage, 'profilePictures/johndoe@example.com');
    expect(uploadBytes).toHaveBeenCalledWith(fakePictureRef, fakePhoto);

    // You can also add more assertions based on your specific requirements
});
  
});

describe('get image functions', () => {
    // Mock necessary values
    afterEach(() => {
      jest.clearAllMocks(); // Clear mock function calls after each test
    });
  
    test('returns profile picture URL', async () => {
      // Mock necessary values
      const email = 'test@example.com';
      const mockStorage = {};
      const mockStorageRef = {};
      const mockURL = 'https://example.com/profilePictures/test@example.com';
  
      // Mock Firebase storage functions' behavior
      getStorage.mockReturnValue(mockStorage);
      ref.mockReturnValue(mockStorageRef);
      getDownloadURL.mockResolvedValue(mockURL);
  
      // Call the function
      const url = await getProfilePicture(email);
  
      // Assertions
      expect(url).toBe(mockURL);
      expect(getStorage).toHaveBeenCalled();
      expect(ref).toHaveBeenCalledWith(mockStorage, 'profilePictures/test@example.com');
      expect(getDownloadURL).toHaveBeenCalledWith(mockStorageRef);
    });

    test('returns property picture URL', async () => {
      // Mock necessary values
      const property = 'property';
      const mockStorage = {};
      const mockStorageRef = {};
      const mockURL = 'https://example.com/propertyPictures/property';
  
      // Mock Firebase storage functions' behavior
      getStorage.mockReturnValue(mockStorage);
      ref.mockReturnValue(mockStorageRef);
      getDownloadURL.mockResolvedValue(mockURL);
  
      // Call the function
      const url = await getPropertyPicture(property);
  
      // Assertions
      expect(url).toBe(mockURL);
      expect(getStorage).toHaveBeenCalled();
      expect(ref).toHaveBeenCalledWith(mockStorage, 'propertyPictures/property');
      expect(getDownloadURL).toHaveBeenCalledWith(mockStorageRef);
    });

    test('returns condo picture URL', async () => {
      // Mock necessary values
      const condo = 'condo';
      const mockStorage = {};
      const mockStorageRef = {};
      const mockURL = 'https://example.com/condoPictures/condo';
  
      // Mock Firebase storage functions' behavior
      getStorage.mockReturnValue(mockStorage);
      ref.mockReturnValue(mockStorageRef);
      getDownloadURL.mockResolvedValue(mockURL);
  
      // Call the function
      const url = await getCondoPicture(condo);
  
      // Assertions
      expect(url).toBe(mockURL);
      expect(getStorage).toHaveBeenCalled();
      expect(ref).toHaveBeenCalledWith(mockStorage, 'condoPictures/condo');
      expect(getDownloadURL).toHaveBeenCalledWith(mockStorageRef);
    });
  })
describe('set picture functions', () => {
    afterEach(() => {
      jest.clearAllMocks(); // Clear mock function calls after each test
    });
    test('setPicture: sets picture successfully', async () => {
      // Mock necessary values

    const data = { picture: 'mocked_picture_data', email: 'test@example.com' };
    const path = '/example/path/';
    const mockStorage = {};
    const mockRef = {};
    const mockUploadResult = 'mocked_upload_result';

    // Mock Firebase storage functions' behavior
    ref.mockReturnValue(mockRef);
    uploadBytes.mockResolvedValueOnce(mockUploadResult);

    // Call the function
    await setPicture(data, path);

    // Assertions
    expect(ref).toHaveBeenCalledWith(storage, path + data.email);
    expect(uploadBytes).toHaveBeenCalledWith(mockRef, 'mocked_picture_data');
  });
    test('setPictureWithID: sets picture with ID successfully', async () => {
      // Mock necessary values
       // Mock necessary values
    const data = { picture: 'mocked_picture_data' };
    const path = '/example/path/';
    const id = '123456789';
    const mockStorage = {};
    const mockRef = {};
    const mockDownloadURL = 'https://example.com/picture.jpg';

    // Mock Firebase storage functions' behavior
    ref.mockReturnValue(mockRef);
    uploadBytes.mockResolvedValueOnce('mocked_upload_result');
    getDownloadURL.mockResolvedValue(mockDownloadURL);

    // Call the function
    await setPictureWithID(data, path, id);

    // Assertions
    expect(ref).toHaveBeenCalledWith(storage, path + id);
    expect(uploadBytes).toHaveBeenCalledWith(ref(storage, '/example/path/2'), 'mocked_picture_data');
  });
      
  });
  describe('condo files', () => {
    afterEach(() => {
      jest.clearAllMocks(); // Clear mock function calls after each test
    });
    test('test upload file', async () => {
      const data = { picture: 'mocked_picture_data' };
      const path = '/example/path/';
      const id = '123456789';
      const mockStorage = {};
      const mockRef = {};
      const mockDownloadURL = 'https://example.com/picture.jpg';
      
      const fileContent = 'This is a sample PDF file content.';
      const blob = new Blob([fileContent], { type: 'application/pdf' });
      const selectedFile = new File([blob], 'sample.pdf', { type: 'application/pdf' });

      ref.mockReturnValue(mockRef);
      listAll.mockResolvedValueOnce({ items: ['1','2'] })
      await uploadFile(id, selectedFile);


      expect(uploadBytes).toHaveBeenCalledWith(ref(storage, '/example/path/2'), selectedFile);

    });
    test('test get files by property', async () => {
      const data = { picture: 'mocked_picture_data' };
      const path = '/example/path/';
      const id = '123456789';
      const mockStorage = {};
      const mockRef = {};
      const mockDownloadURL = 'https://example.com/picture.jpg';
      const mockRefs = { items: ['/example/path/1','/example/path/2'] }

      ref.mockReturnValue(mockRef);
      getDownloadURL.mockResolvedValue(mockDownloadURL);
      listAll.mockResolvedValueOnce(mockRefs)
      await getPropertyFiles(id);

      expect(getDownloadURL).toHaveBeenCalledWith('/example/path/1');
      expect(getDownloadURL).toHaveBeenCalledWith('/example/path/2');

    });
    test('test get files by user', async () => {
      const data = { picture: 'mocked_picture_data' };
      const path = '/example/path/';
      const id = '123456789';
      const mockStorage = {};
      const mockRef = {};
      const mockDownloadURL = 'https://example.com/picture.jpg';
      const mockRefs = { items: ['/example/path/1','/example/path/2'] }


      ref.mockReturnValue(mockRef);
      getDownloadURL.mockResolvedValue(mockDownloadURL);
      listAll.mockResolvedValueOnce(mockRefs)
      getUserData.mockResolvedValueOnce({owns: ['1','2']});
      getCondo.mockResolvedValue({ property: '1' });

      store("role", RENTER_OWNER);  
      await getUsersFiles(id);

      expect(getDownloadURL).toHaveBeenCalledWith('/example/path/1');
      expect(getDownloadURL).toHaveBeenCalledWith('/example/path/2');

    });

      
  });
