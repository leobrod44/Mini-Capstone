import React from "react";
import {
  render,
  fireEvent,
  screen,
  waitFor,
  cleanup,
  getByTestId,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import UserProfile from "../pages/UserProfile";
import { BrowserRouter } from "react-router-dom";
import * as UserHandler from "../backend/UserHandler";
import * as ImageHandler from "../backend/ImageHandler";
import { toast } from "react-toastify";
import DeleteModal from "../components/DeleteModal";

jest.mock("../backend/UserHandler", () => ({
  ...jest.requireActual("../backend/UserHandler"),
  getUserData: jest.fn().mockResolvedValue({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phoneNumber: "1234567890",
  }),
  updateUserInfo: jest.fn().mockResolvedValue({ status: "success" }),
  updateCompanyInfo: jest.fn().mockResolvedValue({status: "success"}),
  deleteAccount: jest.fn().mockResolvedValue({ status: "success" }),
  changePassword: jest.fn().mockResolvedValue({ status: "success" }),

  getCompanyData: jest.fn().mockResolvedValue({
    companyName: "Acme Corp",
    email: "info@acmecorp.com",
    phoneNumber: "1234567890",
  }),
}));

jest.mock("../backend/ImageHandler");
// Mocking toast
afterEach(cleanup);

jest.mock("react-toastify", () => {
  const originalModule = jest.requireActual("react-toastify");
  return {
    ...originalModule,
    toast: {
      ...originalModule.toast,
      error: jest.fn(),
    },
  };
});

// Mock react-router-dom
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => jest.fn(),
}));

describe("UserProfile Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("fetches and displays user data on component mount for a renter or owner", async () => {
    // Mock getUserData
    UserHandler.getUserData.mockResolvedValue({
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      phoneNumber: "1234567890",
    });

    render(
      <BrowserRouter>
        <UserProfile />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("John")).toBeInTheDocument();
      expect(screen.getByText("Doe")).toBeInTheDocument();
    });
  });

  it("allows user to enter and exit edit mode", async () => {
    // Mock getUserData
    UserHandler.getUserData.mockResolvedValue({
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      phoneNumber: "1234567890",
    });
    render(
      <BrowserRouter>
        <UserProfile />
      </BrowserRouter>
    );

    const editButton = screen.getByText(/edit profile/i);
    fireEvent.click(editButton);

    await waitFor(() => {
      expect(screen.getByText(/save changes/i)).toBeInTheDocument();
    });

    const cancelButton = screen.getByText(/cancel changes/i);
    fireEvent.click(cancelButton);

    await waitFor(() => {
      expect(screen.getByText(/edit profile/i)).toBeInTheDocument();
    });
  });

  it("updates user data after edit", async () => {
    // Mock getUserData
    UserHandler.getUserData.mockResolvedValue({
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      phoneNumber: "1234567890",
    });
    render(
      <BrowserRouter>
        <UserProfile />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByText(/edit profile/i));
    const firstNameInput = screen.getByTestId("FirstName");
    fireEvent.change(firstNameInput, { target: { value: "Jane" } });

    UserHandler.updateUserInfo.mockResolvedValueOnce({ status: "success" });

    fireEvent.click(screen.getByText(/save changes/i));
    
    expect(toast.success).toHaveBeenCalledWith('User info updated successfully');
    expect(screen.getByDisplayValue("Jane")).toBeInTheDocument();
  });

  it("displays error for unsupported file type on photo upload", async () => {
    // Mock getUserData
    UserHandler.getUserData.mockResolvedValue({
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      phoneNumber: "1234567890",
    });

    render(
      <BrowserRouter>
        <UserProfile />
      </BrowserRouter>
    );

    const fileInput = screen.getByLabelText(/choose an image/i);
    const file = new File(["(⌐□_□)"], "cool.txt", { type: "text/plain" });
    fireEvent.change(fileInput, { target: { files: [file] } });

    const uploadButton = screen.getByText(/upload/i);
    fireEvent.click(uploadButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("File not supported");
    });
  });
  it("displays success message on successful photo upload", async () => {
    // Mock getUserData
    UserHandler.getUserData.mockResolvedValue({
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      phoneNumber: "1234567890",
    });
  
    // Mock the updateUserPicture function to resolve successfully
    const mockUpdateUserPicture = jest.spyOn(ImageHandler, "updateUserPicture");
    mockUpdateUserPicture.mockResolvedValueOnce();
  
    render(
      <BrowserRouter>
        <UserProfile />
      </BrowserRouter>
    );
  
    const fileInput = screen.getByLabelText(/choose an image/i);
    const file = new File(["(⌐□_□)"], "cool.txt", { type: "image/jpeg" }); // Mock a valid image file
    fireEvent.change(fileInput, { target: { files: [file] } });
  
    const uploadButton = screen.getByText(/upload/i);
    fireEvent.click(uploadButton);
  
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith("Profile picture updated successfully.");
    });
  });
  
  it("deletes user account", async () => {
    // Mock getUserData
    UserHandler.getUserData.mockResolvedValue({
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      phoneNumber: "1234567890",
    });
    render(
      <BrowserRouter>
        <UserProfile />
      </BrowserRouter>
    );
    // Mock the deleteAccount function
    UserHandler.deleteAccount.mockResolvedValueOnce({ status: "success" });
    fireEvent.click(screen.getByText(/delete account/i));

    await waitFor(() => {
      expect(UserHandler.deleteAccount).toHaveBeenCalledWith(
        "john.doe@example.com"
      );
      expect(
        screen.queryByText(/john.doe@example.com/)
      ).not.toBeInTheDocument();
    });
  });

  it("opens delete modal when delete account button is clicked", async () => {
    // Mock getUserData
    UserHandler.getUserData.mockResolvedValue({
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      phoneNumber: "1234567890",
    });

    const { getByText } = render(
      <BrowserRouter>
        <UserProfile />
      </BrowserRouter>
    );

    fireEvent.click(getByText(/delete account/i));

    // Expect the delete modal to be displayed
    expect(getByText(/confirm delete/i)).toBeInTheDocument();
  });

  it("redirects to landing page after confirming deletion", async () => {
    // Mock getUserData
    UserHandler.getUserData.mockResolvedValue({
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      phoneNumber: "1234567890",
    });

    const { getByText, getByTestId, queryByText } = render(
      <BrowserRouter>
        <UserProfile />
      </BrowserRouter>
    );

    // Mock the confirmation of deletion
    UserHandler.deleteAccount.mockResolvedValueOnce({ status: "success" });

    fireEvent.click(getByText(/delete account/i));
    await waitFor(() => {
      expect(queryByText(/confirm delete/i)).toBeInTheDocument();
    });

    // Click the "Delete Account" button in the modal to confirm deletion
    fireEvent.click(getByTestId("delete-account"));

    // Expect the user to be redirected to the landing page after deletion confirmation
    await waitFor(() => {
      expect(queryByText(/confirm delete/i)).not.toBeInTheDocument();
      expect(window.location.pathname).toBe("/");
    });
  });

  it("changes user password", async () => {
    // Mock getUserData
    UserHandler.getUserData.mockResolvedValue({
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      phoneNumber: "1234567890",
    });

    render(
      <BrowserRouter>
        <UserProfile />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByText(/change password/i));
    await waitFor(() => {
      expect(screen.getByText(/current password/i)).toBeInTheDocument();
    });

    fireEvent.change(screen.getByTestId("CurrentPassword"), {
      target: { value: "password" },
    });
    fireEvent.change(screen.getByTestId("NewPassword"), {
      target: { value: "newpassword" },
    });
    fireEvent.change(screen.getByTestId("ConfirmPassword"), {
      target: { value: "newpassword" },
    });
    fireEvent.click(screen.getByText(/change password/i));

    await waitFor(() => {
      expect(UserHandler.changePassword).toHaveBeenCalledWith({
        currentPassword: "password",
        newPassword: "newpassword",
        email: "john.doe@example.com",
      });
      expect(
        screen.getByText(/password updated successfully/i)
      ).toBeInTheDocument();
    });
  });

  it("fetches and displays company data on component mount for a management company", async () => {
    // Mock getCompanyData
    UserHandler.getCompanyData.mockResolvedValue({
      companyName: "Acme Corp",
      email: "info@acmecorp.com",
      phoneNumber: "1234567890",
    });

    render(
      <BrowserRouter>
        <UserProfile />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(UserHandler.getCompanyData).toHaveBeenCalledTimes(1);
      expect(screen.getByText("Acme Corp")).toBeInTheDocument();
      expect(screen.getByText("info@acmecorp.com")).toBeInTheDocument();
    });
  });

  it("displays error for file size greater than 2 MB on photo upload", async () => {
    // Mock getUserData
    UserHandler.getUserData.mockResolvedValue({
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      phoneNumber: "1234567890",
    });

    render(
      <BrowserRouter>
        <UserProfile />
      </BrowserRouter>
    );

    // Create a mock file with size greater than 2 MB
    const largeFile = new File(["a".repeat(2097153)], "large-image.jpg", {
      type: "image/jpeg",
    });

    // Get the file input and simulate a user selecting a large file
    const fileInput = screen.getByLabelText(/choose an image/i);
    fireEvent.change(fileInput, { target: { files: [largeFile] } });

    const uploadButton = screen.getByText(/upload/i);
    fireEvent.click(uploadButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("File must be less than 2 MB");
    });
  });

  it("displays error if updateUserPicture fails", async () => {
    // Mock getUserData
    UserHandler.getUserData.mockResolvedValue({
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      phoneNumber: "1234567890",
    });

    // Mock the updateUserPicture to throw an error
    const mockUpdateUserPicture = jest.spyOn(ImageHandler, "updateUserPicture");
    const errorMessage = "Upload failed";
    mockUpdateUserPicture.mockRejectedValueOnce(new Error(errorMessage));

    render(
      <BrowserRouter>
        <UserProfile />
      </BrowserRouter>
    );

    // ...rest of your test setup, including simulating the file upload

    const uploadButton = screen.getByText(/upload/i);
    fireEvent.click(uploadButton);
    // Now we wait for the error message to show up after the upload attempt
    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  it('should display error if any password field is empty', async () => {
    // Mock getUserData
    UserHandler.getUserData.mockResolvedValue({
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      phoneNumber: "1234567890",
    });

    render(
      <BrowserRouter>
        <UserProfile />
      </BrowserRouter>
    );

    const changePasswordButton = screen.getByText('Change Password');
    fireEvent.click(changePasswordButton);
    expect(toast.error).toHaveBeenCalledWith('Please make sure all password fields are filled out');
  });

  it('should display error if new password and confirm password fields are different', async () => {
    // Mock getUserData
    UserHandler.getUserData.mockResolvedValue({
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      phoneNumber: "1234567890",
    });
  
    render(
      <BrowserRouter>
        <UserProfile />
      </BrowserRouter>
    );
  
    const changePasswordButton = screen.getByText('Change Password');
    fireEvent.click(changePasswordButton);
  
    const currentPasswordInput = screen.getByTestId('CurrentPassword');
    fireEvent.change(currentPasswordInput, { target: { value: 'currentPassword' } });
  
    const newPasswordInput = screen.getByTestId('NewPassword');
    fireEvent.change(newPasswordInput, { target: { value: 'newPassword' } });
  
    const confirmPasswordInput = screen.getByTestId('ConfirmPassword');
    fireEvent.change(confirmPasswordInput, { target: { value: 'differentPassword' } });
  
    fireEvent.click(screen.getByText('Change Password'));
  
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('New passwords do not match');
    });
  });
  
  it('should display error if password is less than 8 characters', async () => {
    // Mock getUserData
    UserHandler.getUserData.mockResolvedValue({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phoneNumber: '1234567890',
    });
  
    render(
      <BrowserRouter>
        <UserProfile />
      </BrowserRouter>
    );
  
    const changePasswordButton = screen.getByText('Change Password');
    fireEvent.click(changePasswordButton);
  
      
    const currentPasswordInput = screen.getByTestId('CurrentPassword');
    fireEvent.change(currentPasswordInput, { target: { value: 'currentPassword' } });
  

    // Enter a password less than 8 characters
    const newPasswordInput = screen.getByTestId('NewPassword');
    fireEvent.change(newPasswordInput, { target: { value: 'pass' } });

    const confirmNewPasswordInput = screen.getByTestId('ConfirmPassword');
    fireEvent.change(confirmNewPasswordInput, { target: { value: 'pass' } });

    const changePasswordSubmitButton = screen.getByText('Change Password');
    fireEvent.click(changePasswordSubmitButton);
  
    // Check if error toast is displayed
    await waitFor(() => {
      expect(UserHandler.changePassword).not.toHaveBeenCalled();
      expect(toast.error).toHaveBeenCalledWith('Password must be at least 8 characters');
    });
  });

  it('should display error if phone number format is incorrect', async () => {
    // Mock getUserData
    UserHandler.getUserData.mockResolvedValue({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phoneNumber: '1234567890',
    });

    render(
      <BrowserRouter>
        <UserProfile />
      </BrowserRouter>
    );
  // Trigger edit mode
  const editButton = screen.getByText('Edit Profile');
  fireEvent.click(editButton);
    // Simulate editing phone number with incorrect format
    const phoneNumberInput = screen.getByTestId("PHONE");
    fireEvent.change(phoneNumberInput, { target: { value: '123' } });

    // Click the save button
    const saveButton = screen.getByText('Save Changes');
    fireEvent.click(saveButton);

    // Check if error toast is displayed
    expect(UserHandler.updateUserInfo).not.toHaveBeenCalled();
    expect(toast.error).toHaveBeenCalledWith('Please make sure the phone number format is correct');
    
  });

  it('should display error if first name is empty', async () => {
    // Mock getUserData
    UserHandler.getUserData.mockResolvedValue({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phoneNumber: '1234567890',
    });
  
    render(
      <BrowserRouter>
        <UserProfile />
      </BrowserRouter>
    );
  
    // Trigger edit mode
    const editButton = screen.getByText('Edit Profile');
    fireEvent.click(editButton);
  
    // Simulate clearing the first name input
    const firstNameInput = screen.getByTestId('FirstName');
    fireEvent.change(firstNameInput, { target: { value: '' } });
  
    // Click the save button
    const saveButton = screen.getByText('Save Changes');
    fireEvent.click(saveButton);
  
    // Check if error toast is displayed
    await waitFor(() => {
      expect(UserHandler.updateUserInfo).not.toHaveBeenCalled();
      expect(toast.error).toHaveBeenCalledWith('Please make sure "First Name" is not empty');
    });
  });

 
});
