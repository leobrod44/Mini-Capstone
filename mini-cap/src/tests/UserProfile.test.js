import React from "react";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import UserProfile from "../pages/UserProfile";
import { BrowserRouter } from "react-router-dom";
import * as UserHandler from "../backend/UserHandler";
import * as ImageHandler from "../backend/ImageHandler";

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
    render(
      <BrowserRouter>
        <UserProfile />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByText(/edit profile/i));

    const firstNameInput = screen.getByPlaceholderText(/First Name/i);
    fireEvent.change(firstNameInput, { target: { value: "Jane" } });

    UserHandler.updateUserInfo.mockResolvedValueOnce({ status: "success" });

    fireEvent.click(screen.getByText(/save changes/i));

    await waitFor(() => {
      expect(UserHandler.updateUserInfo).toHaveBeenCalledWith(
        expect.anything(),
        {
          firstName: "Jane",
          lastName: "Doe",
          email: "john.doe@example.com",
          phoneNumber: "1234567890",
        }
      );
    });
  });

  it("displays error for unsupported file type on photo upload", async () => {
    render(
      <BrowserRouter>
        <UserProfile />
      </BrowserRouter>
    );

    const fileInput = screen.getByLabelText(/choose an image/i);
    const file = new File(["(⌐□_□)"], "cool.txt", { type: "text/plain" });
    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => {
      expect(screen.getByText("File not supported")).toBeInTheDocument();
    });
  });

  it("deletes user account", async () => {
    render(
      <BrowserRouter>
        <UserProfile />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByText(/delete account/i));
    await waitFor(() => {
      expect(
        screen.getByText(/please enter your password/i)
      ).toBeInTheDocument();
    });

    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: "password" },
    });
    fireEvent.click(screen.getByText(/confirm/i));

    await waitFor(() => {
      expect(UserHandler.deleteAccount).toHaveBeenCalledWith(
        "john.doe@example.com"
      );
      expect(
        screen.queryByText(/john.doe@example.com/)
      ).not.toBeInTheDocument();
    });
  });

  it("changes user password", async () => {
    render(
      <BrowserRouter>
        <UserProfile />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByText(/change password/i));
    await waitFor(() => {
      expect(screen.getByText(/current password/i)).toBeInTheDocument();
    });

    fireEvent.change(screen.getByPlaceholderText(/current password/i), {
      target: { value: "password" },
    });
    fireEvent.change(screen.getByPlaceholderText(/new password/i), {
      target: { value: "newpassword" },
    });
    fireEvent.change(screen.getByPlaceholderText(/confirm password/i), {
      target: { value: "newpassword" },
    });
    fireEvent.click(screen.getByText(/change password/i));

    await waitFor(() => {
      expect(UserHandler.changePassword).toHaveBeenCalledWith(
        expect.anything(),
        {
          currentPassword: "password",
          newPassword: "newpassword",
          email: "john.doe@example.com",
        }
      );
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
      expect(screen.getByText("Acme Corp")).toBeInTheDocument();
      expect(screen.getByText("info@acmecorp.com")).toBeInTheDocument();
    });
  });

  it("fetches and displays company data for a management company user", async () => {
    // Mock the store for a management company user
    store.mockImplementation((key) => {
      if (key === "role") {
        return Constants.MANAGEMENT_COMPANY;
      }
      // Return some user ID for 'user' key or other data as needed
      return "management-user-id";
    });

    // Mock getCompanyData for a management company user
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
      expect(screen.getByText("Acme Corp")).toBeInTheDocument();
      expect(screen.getByText("info@acmecorp.com")).toBeInTheDocument();
    });
  });

  it("fetches and displays user data for a renter/owner user", async () => {
    // Mock the store for a renter/owner user
    store.mockImplementation((key) => {
      if (key === "role") {
        return Constants.RENTER_OWNER;
      }
      // Return some user ID for 'user' key or other data as needed
      return "renter-owner-user-id";
    });

    // Mock getUserData for a renter/owner user
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

  it("displays error for unsupported file type on photo upload", async () => {
    render(
      <BrowserRouter>
        <UserProfile />
      </BrowserRouter>
    );

    // Find the file input and simulate a user selecting a file
    const fileInput = screen.getByLabelText(/choose an image/i);
    const file = new File(["(⌐□_□)"], "cool.txt", { type: "text/plain" });
    fireEvent.change(fileInput, { target: { files: [file] } });

    // Find the upload button and click it to trigger the handlePhotoChange function
    const uploadButton = screen.getByText(/upload/i);
    fireEvent.click(uploadButton);

    // Now we wait for the error message to show up
    await waitFor(() => {
      expect(screen.getByText("File not supported")).toBeInTheDocument();
    });
  });

  it("displays error for file size greater than 2 MB on photo upload", async () => {
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

    // Since the Upload button triggers the handlePhotoChange, we click it
    const uploadButton = screen.getByText(/upload/i);
    fireEvent.click(uploadButton);

    // Now we wait for the error message to show up
    await waitFor(() => {
      expect(
        screen.getByText("File must be less than 2 MB")
      ).toBeInTheDocument();
    });
  });

  it("displays error if updateUserPicture fails", async () => {
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

    // Clean up the mock to not interfere with other tests
    mockUpdateUserPicture.mockRestore();
  });

  // Add more tests as needed to cover other scenarios and functionalities
});
