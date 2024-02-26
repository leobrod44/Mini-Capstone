import { updateUserPicture } from '../backend/Fetcher'; // Import your function
import { getStorage, ref, getDownloadURL, deleteObject, uploadBytes } from 'firebase/storage';

// Mock Firebase storage functions
jest.mock('firebase/storage', () => ({
  getStorage: jest.fn(),
  ref: jest.fn(),
  getDownloadURL: jest.fn(),
  deleteObject: jest.fn(),
  uploadBytes: jest.fn()
}));

describe('updateUserPicture function', () => {
  afterEach(() => {
    jest.clearAllMocks(); // Clear mock function calls after each test
  });

  test('updates user picture successfully', async () => {
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

  test('handles error properly', async () => {
    // Mock necessary values
    const email = 'test@example.com';
    const photo = 'mocked_photo_data';
    const error = new Error('Mocked error');

    // Mock Firebase storage functions' behavior
    getStorage.mockImplementation(() => { throw error; });

    // Assertions
    await expect(updateUserPicture(email, photo)).rejects.toThrowError('Error changing picture: ');
  });
});
