import React from "react";
import { render, fireEvent, screen, waitFor, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom";
import UserProfile from "../pages/UserProfile";
import { BrowserRouter } from "react-router-dom";
import * as UserHandler from "../backend/UserHandler";
import * as ImageHandler from "../backend/ImageHandler";
import { toast } from "react-toastify";


jest.mock("../backend/UserHandler", () => ({
  ...jest.requireActual("../backend/UserHandler"),
  getUserData: jest.fn().mockResolvedValue({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phoneNumber: "1234567890",
  }),
  updateUserInfo: jest.fn().mockResolvedValue({ status: "success" }), // Add the mock for updateUserInfo
}));



jest.mock('../backend/ImageHandler');
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


  // Add more tests as needed to cover other scenarios and functionalities
});
