import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { BrowserRouter as Router } from "react-router-dom";
import SignupPage from "../pages/SignupPage.jsx"; // Adjust the import path as necessary
import { toast } from "react-toastify";

jest.mock("react-toastify", () => ({
  ...jest.requireActual("react-toastify"),
  toast: {
    error: jest.fn(),
  },
}));

test("SignupPage: renders the signup form", () => {
  render(
    <Router>
      <SignupPage />
    </Router>
  );

  expect(screen.getByLabelText(/choose an image:/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/select role:/i)).toBeInTheDocument();
  // Add more assertions as needed
});

test("SignupPage: validates file type and size on photo upload", () => {
  render(
    <Router>
      <SignupPage />
    </Router>
  );

  const fileInput = screen.getByLabelText(/choose an image:/i);
  const validFile = new File(["(⌐□_□)"], "validImage.png", {
    type: "image/png",
  });
  const invalidTypeFile = new File(["content"], "invalidType.gif", {
    type: "image/gif",
  });
  const largeFile = new File([new ArrayBuffer(3e6)], "largeImage.png", {
    type: "image/png",
  });

  // Valid file upload
  fireEvent.change(fileInput, { target: { files: [validFile] } });
  expect(toast.error).not.toHaveBeenCalledWith("File not supported");
  expect(toast.error).not.toHaveBeenCalledWith("File must be less than 2 MB");

  // Invalid file type
  fireEvent.change(fileInput, { target: { files: [invalidTypeFile] } });
  expect(toast.error).toHaveBeenCalledWith("File not supported");

  // File size exceeds limit
  fireEvent.change(fileInput, { target: { files: [largeFile] } });
  expect(toast.error).toHaveBeenCalledWith("File must be less than 2 MB");
});

test("SignupPage: allows role selection and dynamically updates form fields", () => {
  render(
    <Router>
      <SignupPage />
    </Router>
  );

  // Check default role fields
  expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();

  // Change to 'Management Company' and check fields
  fireEvent.change(screen.getByRole("combobox", { name: /select role/i }), {
    target: { value: "managementCompany" },
  });
  expect(screen.queryByLabelText(/first name/i)).not.toBeInTheDocument();
  expect(screen.getByLabelText(/company name/i)).toBeInTheDocument();
  // Add more assertions as needed
});

// You can add more tests here as needed to cover all functionalities
