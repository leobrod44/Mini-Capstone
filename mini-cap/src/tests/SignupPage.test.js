// SignupPage.test.jsx
import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SignupPage from "../pages/SignupPage.jsx"; // Adjust this import to the correct path of your SignupPage component
import { BrowserRouter as Router } from 'react-router-dom';
import { toast } from "react-toastify";

jest.mock("react-toastify", () => ({
  toast: {
    error: jest.fn(),
  },
  ToastContainer: () => <div>ToastContainer</div>,
}));

describe("SignupPage", () => {
  beforeEach(() => {
    render(<SignupPage />);
  });

  it("renders UI elements for Renter/Owner by default", () => {
    expect(screen.getByText(/signup/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/First Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Last Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Confirm Password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /signup/i })).toBeInTheDocument();
  });

  it("switches to Management Company fields", async () => {
    await userEvent.selectOptions(
      screen.getByLabelText(/Select Role/i),
      "managementCompany"
    );
    expect(screen.getByLabelText(/Company Name/i)).toBeInTheDocument();
  });

  it("validates input fields for Renter/Owner", async () => {
    await userEvent.type(screen.getByLabelText(/First Name/i), "John");
    await userEvent.type(screen.getByLabelText(/Last Name/i), "Doe");
    await userEvent.type(
      screen.getByLabelText(/Email/i),
      "john.doe@example.com"
    );
    await userEvent.type(screen.getByLabelText(/Password/i), "Password1");
    await userEvent.type(
      screen.getByLabelText(/Confirm Password/i),
      "Password1"
    );
    await userEvent.click(screen.getByRole("button", { name: /signup/i }));
    // Assuming form submission leads to a page change or success message, add assertion here
  });

  it("validates input fields for Management Company", async () => {
    await userEvent.selectOptions(
      screen.getByLabelText(/Select Role/i),
      "managementCompany"
    );
    await userEvent.type(screen.getByLabelText(/Company Name/i), "Acme Inc");
    await userEvent.type(
      screen.getByLabelText(/Email/i),
      "contact@acmeinc.com"
    );
    await userEvent.type(screen.getByLabelText(/Password/i), "SecurePass1");
    await userEvent.type(
      screen.getByLabelText(/Confirm Password/i),
      "SecurePass1"
    );
    await userEvent.click(screen.getByRole("button", { name: /signup/i }));
    // Assuming form submission leads to a page change or success message, add assertion here
  });

  it("shows error for invalid email format", async () => {
    await userEvent.type(screen.getByLabelText(/Email/i), "invalidemail");
    await userEvent.click(screen.getByRole("button", { name: /signup/i }));
    expect(toast.error).toHaveBeenCalledWith(
      "Invalid email format. Please include '@' and '.' in your email address."
    );
  });

  it("shows error when passwords do not match", async () => {
    await userEvent.type(screen.getByLabelText(/Password/i), "Password1");
    await userEvent.type(
      screen.getByLabelText(/Confirm Password/i),
      "Password2"
    );
    await userEvent.click(screen.getByRole("button", { name: /signup/i }));
    expect(toast.error).toHaveBeenCalledWith("Passwords do not match.");
  });

  it("validates image upload for supported file types", async () => {
    const fileInput = screen.getByLabelText(/Choose an image:/i);
    const file = new File(["(⌐□_□)"], "profile.png", { type: "image/png" });
    await userEvent.upload(fileInput, file);
    expect(fileInput.files[0]).toBe(file);
    expect(fileInput.files).toHaveLength(1);
  });

  it("shows error for unsupported file types", async () => {
    const fileInput = screen.getByLabelText(/Choose an image:/i);
    const file = new File(["(⌐□_□)"], "profile.bmp", { type: "image/bmp" });
    await userEvent.upload(fileInput, file);
    expect(toast.error).toHaveBeenCalledWith("File not supported");
  });

  it("shows error for files larger than 2MB", async () => {
    const fileInput = screen.getByLabelText(/Choose an image:/i);
    const largeFile = new File([new Array(2097153).join("a")], "large.png", {
      type: "image/png",
    });
    await userEvent.upload(fileInput, largeFile);
    expect(toast.error).toHaveBeenCalledWith("File must be less than 2 MB");
  });
});
