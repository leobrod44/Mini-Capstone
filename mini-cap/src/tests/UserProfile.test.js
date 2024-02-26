import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import UserProfile from "../pages/UserProfile.jsx"; // Adjust the path as necessary
import { BrowserRouter } from "react-router-dom";
import { MANAGEMENT_COMPANY } from "../backend/Constants.js";

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

  // Continuing from the existing tests

  it("opens and confirms deletion modal", () => {
    setup();
    const deleteButton = screen.getByText(/delete account/i);
    fireEvent.click(deleteButton);
    expect(
      screen.getByText(/all information will be deleted/i)
    ).toBeInTheDocument();
    const confirmDeleteButton = screen.getByText(/delete/i); // Adjust text based on your modal button
    fireEvent.click(confirmDeleteButton);
    expect(mockedNavigate).toHaveBeenCalledWith("/"); // Adjust the navigation path as per your implementation
    expect(
      screen.getByText(/account deleted successfully/i)
    ).toBeInTheDocument();
  });

  it("validates phone number format", () => {
    setup();
    fireEvent.click(screen.getByText(/edit profile/i));
    const phoneNumberInput = screen.getByPlaceholderText(/phone number/i); // Adjust placeholder if necessary
    fireEvent.change(phoneNumberInput, { target: { value: "123456789" } }); // Invalid format
    expect(
      screen.getByText(/phone number format is incorrect/i)
    ).toBeInTheDocument();
  });

  it("changes and validates password", async () => {
    setup();
    const newPassword = "newPassword123";
    const confirmPassword = "newPassword123";

    fireEvent.change(screen.getByPlaceholderText(/current password/i), {
      target: { value: "oldPassword123" },
    });
    fireEvent.change(screen.getByPlaceholderText(/new password/i), {
      target: { value: newPassword },
    });
    fireEvent.change(screen.getByPlaceholderText(/confirm password/i), {
      target: { value: confirmPassword },
    });

    const changePasswordButton = screen.getByText(/change password/i);
    fireEvent.click(changePasswordButton);

    // Assuming async operation, you might need to wait for the expectation or use findByText
    await waitFor(() => {
      expect(
        screen.getByText(/password updated successfully/i)
      ).toBeInTheDocument();
    });
  });

  it("handles last name change in edit mode", () => {
    setup();
    fireEvent.click(screen.getByText(/edit profile/i));
    const lastNameInput = screen.getByPlaceholderText(/last name/i); // Adjust placeholder if necessary
    fireEvent.change(lastNameInput, { target: { value: "Doe" } });
    expect(lastNameInput.value).toBe("Doe");
  });

  it("handles company name change for management role", () => {
    setup(); // Ensure setup initializes the component with a "mgmt" role
    fireEvent.click(screen.getByText(/edit profile/i));
    const companyNameInput = screen.getByPlaceholderText(/company name/i); // Adjust placeholder if necessary
    fireEvent.change(companyNameInput, { target: { value: "New Company" } });
    expect(companyNameInput.value).toBe("New Company");
  });

  it("cancels unsaved changes", () => {
    setup();
    fireEvent.click(screen.getByText(/edit profile/i));
    const firstNameInput = screen.getByPlaceholderText(/first name/i);
    fireEvent.change(firstNameInput, { target: { value: "Jane" } });
    const cancelButton = screen.getByText(/cancel changes/i);
    fireEvent.click(cancelButton);
    // Assuming the first name resets to the initial state, which might be empty or some predefined value
    expect(firstNameInput.value).not.toBe("Jane");
  });

  // Continuing from the existing tests...

  it("displays error for unsupported file type on photo upload", () => {
    setup();
    const file = new File(["(⌐□_□)"], "cool.txt");
    const input = screen.getByLabelText(/choose an image/i);
    fireEvent.change(input, { target: { files: [file] } });
    expect(toast.error).toHaveBeenCalledWith("File not supported");
  });

  it("displays error for file size over 2MB on photo upload", () => {
    const largeFile = new File([new ArrayBuffer(2097153)], "large_photo.png", {
      type: "image/png",
    });
    setup();
    const input = screen.getByLabelText(/choose an image/i);
    fireEvent.change(input, { target: { files: [largeFile] } });
    expect(toast.error).toHaveBeenCalledWith("File must be less than 2 MB");
  });

  it("populates fields with current values in edit mode", () => {
    setup();
    fireEvent.click(screen.getByText(/edit profile/i));
    expect(screen.getByPlaceholderText(/first name/i).value).not.toBe("");
    expect(screen.getByPlaceholderText(/last name/i).value).not.toBe("");
    // Add more assertions for other fields as necessary
  });

  it("updates previewUrl on successful photo upload", () => {
    setup();
    const file = new File(["(⌐□_□)"], "photo.png", { type: "image/png" });
    const input = screen.getByLabelText(/choose an image/i);
    fireEvent.change(input, { target: { files: [file] } });
    expect(input.files[0]).toBe(file);
    // You might need to mock FileReader here to test the effect on previewUrl
  });

  it("displays error when required fields are empty on form submission", () => {
    setup();
    fireEvent.click(screen.getByText(/edit profile/i));
    fireEvent.change(screen.getByPlaceholderText(/first name/i), {
      target: { value: "" },
    });
    fireEvent.click(screen.getByText(/save changes/i));
    expect(toast.error).toHaveBeenCalledWith(
      "Please make sure all required fields aren't empty"
    );
  });

  it("displays error for incorrect phone number format", () => {
    setup();
    fireEvent.click(screen.getByText(/edit profile/i));
    fireEvent.change(screen.getByPlaceholderText(/phone number/i), {
      target: { value: "123" },
    });
    fireEvent.click(screen.getByText(/save changes/i));
    expect(toast.error).toHaveBeenCalledWith(
      "Please make sure the phone number format is correct"
    );
  });

  it("displays error when new password and confirm password do not match", () => {
    setup();
    fireEvent.change(screen.getByPlaceholderText(/new password/i), {
      target: { value: "newPass123" },
    });
    fireEvent.change(screen.getByPlaceholderText(/confirm password/i), {
      target: { value: "newPass1234" },
    });
    fireEvent.click(screen.getByText(/change password/i));
    expect(toast.error).toHaveBeenCalledWith("New passwords do not match");
  });

  it("displays error when new password is less than 8 characters", () => {
    setup();
    fireEvent.change(screen.getByPlaceholderText(/new password/i), {
      target: { value: "short" },
    });
    fireEvent.click(screen.getByText(/change password/i));
    expect(toast.error).toHaveBeenCalledWith(
      "Password must be at least 8 characters"
    );
  });

  it("displays success message on successful password change", async () => {
    setup();
    // Assume the passwords match and meet the length requirement
    fireEvent.change(screen.getByPlaceholderText(/new password/i), {
      target: { value: "newPass123" },
    });
    fireEvent.change(screen.getByPlaceholderText(/confirm password/i), {
      target: { value: "newPass123" },
    });
    fireEvent.click(screen.getByText(/change password/i));
    // Mock your async password change request here
    // Use await waitFor for async operations
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(
        "Password updated successfully"
      );
    });
  });

  it("renders role-specific fields correctly", () => {
    setup(); // Ensure the setup initializes the component with different roles in different tests
    const companyNameField = screen.queryByPlaceholderText(/company name/i);
    if (role === MANAGEMENT_COMPANY) {
      expect(companyNameField).toBeInTheDocument();
    } else {
      expect(companyNameField).toBeNull();
    }
  });

  it("navigates to homepage on account deletion", () => {
    setup();
    const deleteButton = screen.getByText(/delete account/i);
    fireEvent.click(deleteButton);
    const confirmDeleteButton = screen.getByText(/confirm delete text/i); // Adjust the button text as per your modal
    fireEvent.click(confirmDeleteButton);
    expect(mockedNavigate).toHaveBeenCalledWith("/homepage-path"); // Adjust "/homepage-path" as necessary
  });

  it("disables email field in edit mode", () => {
    setup();
    fireEvent.click(screen.getByText(/edit profile/i));
    const emailField = screen.getByPlaceholderText(/email/i);
    expect(emailField).toBeDisabled();
  });

  it("displays success toast on profile photo update", async () => {
    setup();
    const file = new File(["(⌐□_□)"], "photo.png", { type: "image/png" });
    const photoInput = screen.getByLabelText(/choose an image/i);
    fireEvent.change(photoInput, { target: { files: [file] } });
    const uploadButton = screen.getByText(/upload/i);
    fireEvent.click(uploadButton);
    // Simulate async operation as needed
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(
        "Profile photo updated successfully"
      );
    });
  });

  it("handles modal open and close correctly", () => {
    setup();
    const deleteButton = screen.getByText(/delete account/i);
    fireEvent.click(deleteButton);
    expect(screen.getByText(/modal confirmation text/i)).toBeInTheDocument(); // Use actual text from your modal
    const closeButton = screen.getByText(/close button text/i); // Use actual text from your modal's close button
    fireEvent.click(closeButton);
    // Assuming your modal is removed from the document upon closing
    expect(screen.queryByText(/modal confirmation text/i)).toBeNull();
  });

  it("enforces maximum length constraints on input fields", () => {
    setup();
    const firstNameInput = screen.getByPlaceholderText(/first name/i);
    const longString = "a".repeat(51); // Assuming the max length is 50
    fireEvent.change(firstNameInput, { target: { value: longString } });
    expect(firstNameInput.value.length).toBeLessThanOrEqual(50);
  });

  it("verifies initial state matches expected defaults", () => {
    setup();
    expect(screen.getByPlaceholderText(/first name/i).value).toBe(""); // Adjust according to your default values
    // Add more assertions for other fields
  });

  it("shows loading indicator when waiting for API response", async () => {
    setup();
    // Trigger an action that causes a loading state
    expect(screen.getByTestId("loading-indicator")).toBeInTheDocument();
    // Wait for the loading to finish and assert the loading indicator is no longer present
    await waitForElementToBeRemoved(() =>
      screen.queryByTestId("loading-indicator")
    );
  });

  it("notifies user on file upload error", async () => {
    setup();
    // Simulate file upload action
    // Simulate an error response from the file upload process
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Error uploading file");
    });
  });
});
