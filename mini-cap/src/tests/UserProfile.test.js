import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import UserProfile from "../pages/UserProfile.jsx"; // Adjust the path as necessary
import { BrowserRouter } from "react-router-dom";

// Mock react-toastify
jest.mock("react-toastify", () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
  },
}));

// Mock useNavigate from react-router-dom
const mockedNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
}));

describe("UserProfile Component", () => {
  const setup = () =>
    render(
      <BrowserRouter>
        <UserProfile />
      </BrowserRouter>
    );

  it("enters and exits edit mode", () => {
    setup();
    const editButton = screen.getByText(/edit profile/i);
    fireEvent.click(editButton);
    expect(screen.getByText(/save changes/i)).toBeInTheDocument();
    const cancelButton = screen.getByText(/cancel changes/i);
    fireEvent.click(cancelButton);
    expect(editButton).toBeInTheDocument();
  });

  it("handles form field changes", () => {
    setup();
    fireEvent.click(screen.getByText(/edit profile/i));
    const firstNameInput = screen.getByPlaceholderText(/first name/i);
    fireEvent.change(firstNameInput, { target: { value: "John" } });
    expect(firstNameInput.value).toBe("John");
  });

  it("handles profile photo change", () => {
    setup();
    const file = new File(["photo"], "photo.png", { type: "image/png" });
    const input = screen.getByLabelText(/choose an image/i);
    fireEvent.change(input, { target: { files: [file] } });
    expect(input.files[0]).toBe(file);
    expect(input.files.item(0)).toBe(file);
    expect(input.files).toHaveLength(1);
  });

  it("submits updated user info", async () => {
    setup();
    fireEvent.click(screen.getByText(/edit profile/i));
    const saveButton = screen.getByText(/save changes/i);
    fireEvent.click(saveButton);
    expect(
      screen.getByText(/user info updated successfully/i)
    ).toBeInTheDocument();
  });

  // Additional tests for password change, deleting account, etc.
});
