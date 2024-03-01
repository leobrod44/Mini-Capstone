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

  // Add more tests as needed to cover other scenarios and functionalities
});
