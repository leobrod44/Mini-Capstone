import React from "react";
import { render, screen, fireEvent, cleanup,waitFor  } from "@testing-library/react";
import "@testing-library/jest-dom";
import { BrowserRouter as Router } from "react-router-dom"; 
import { toast } from "react-toastify";
import SignupPage from "../pages/SignupPage";

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

describe('SignupPage Component', () => {
  it('should allow user to fill out the form and signup', async () => {
    const { getByLabelText, getByText, getByRole} = render(<Router><SignupPage /></Router>);

    // Fill out the form
    const roleDropdown = screen.getByLabelText('Select Role');
    fireEvent.change(roleDropdown, { target: { value: 'renter/owner' } }); 

    fireEvent.change(getByLabelText('First Name'), { target: { value: 'John' } });
    fireEvent.change(getByLabelText('Last Name'), { target: { value: 'Doe' } });
    fireEvent.change(getByLabelText('Email'), { target: { value: 'john.doe@example.com' } });
    fireEvent.change(getByLabelText('Phone Number (optional)'), { target: { value: '514-555-1234' } });
    fireEvent.change(getByLabelText('Password'), { target: { value: 'password123' } });
    fireEvent.change(getByLabelText('Confirm Password'), { target: { value: 'password123' } });

    const signupButton = getByText('Signup', { selector: 'button' });

    // Submit the form
    fireEvent.click(signupButton);

    // Assert form data
   // Access the form data from the component's state
    const formData = SignupPage.getFormData();

    // Assert form data
    expect(formData.role).toBe('renter/owner');
    expect(formData.firstName).toBe('John');
    expect(formData.lastName).toBe('Doe');
    expect(formData.email).toBe('john.doe@example.com');
    expect(formData.password).toBe('password123');
    expect(formData.confirmPassword).toBe('password123');
    });

  it('should display error if wrong confirmed password is entered', async () => {
    const { getByLabelText, getByText, getByRole, queryByText} = render(<Router><SignupPage /></Router>);

    // Fill out the form
    const roleDropdown = screen.getByLabelText('Select Role');
    fireEvent.change(roleDropdown, { target: { value: 'renter/owner' } }); 

    fireEvent.change(getByLabelText('First Name'), { target: { value: 'John' } });
    fireEvent.change(getByLabelText('Last Name'), { target: { value: 'Doe' } });
    fireEvent.change(getByLabelText('Phone Number (optional)'), { target: { value: '514-555-1234' } });
    fireEvent.change(getByLabelText('Email'), { target: { value: 'john.doe@example.com' } });
    fireEvent.change(getByLabelText('Password'), { target: { value: 'password123' } });
    fireEvent.change(getByLabelText('Confirm Password'), { target: { value: 'password456' } });

    const signupButton = getByRole('button', { name: 'Signup' });

    // Submit the form
    fireEvent.click(signupButton);

    expect(toast.error).toHaveBeenCalledWith(
      "Passwords do not match."
    );

  });

  it('should display error if password isnt valid', async () => {
    const { getByLabelText, getByText, getByRole} = render(<Router><SignupPage /></Router>);

    // Fill out the form
    const roleDropdown = screen.getByLabelText('Select Role');
    fireEvent.change(roleDropdown, { target: { value: 'renter/owner' } }); 
    fireEvent.change(getByLabelText('First Name'), { target: { value: 'John' } });
    fireEvent.change(getByLabelText('Last Name'), { target: { value: 'Doe' } });
    fireEvent.change(getByLabelText('Phone Number (optional)'), { target: { value: '514-555-1234' } });
    fireEvent.change(getByLabelText('Email'), { target: { value: 'john.doe@example.com' } });
    fireEvent.change(getByLabelText('Password'), { target: { value: 'qwer' } });
    fireEvent.change(getByLabelText('Confirm Password'), { target: { value: 'qwer' } });

    const signupButton = getByRole('button', { name: 'Signup' });

    // Submit the form
    fireEvent.click(signupButton);

    // Wait for toast message to appear
    expect(toast.error).toHaveBeenCalledWith(
      "Password must be at least 8 characters long."
    );
    fireEvent.change(getByLabelText('Password'), { target: { value: 'qwerqwerqwer' } });
    fireEvent.change(getByLabelText('Confirm Password'), { target: { value: 'qwerqwerqwer' } });
    fireEvent.click(signupButton);

    
    expect(toast.error).toHaveBeenCalledWith(
      "Password must contain both letters and numbers."
    );
  });
  it('should display error if mandatory fields arent all entered', async () => {
    const { getByLabelText, getByText, getByRole} = render(<Router><SignupPage /></Router>);

    // Fill out the form
    const roleDropdown = screen.getByLabelText('Select Role');
    fireEvent.change(roleDropdown, { target: { value: 'renter/owner' } }); 
    fireEvent.change(getByLabelText('First Name'), { target: { value: '' } });
    fireEvent.change(getByLabelText('Last Name'), { target: { value: '' } });
    fireEvent.change(getByLabelText('Phone Number (optional)'), { target: { value: '' } });
    fireEvent.change(getByLabelText('Email'), { target: { value: 'john.doe@example.com' } });
    fireEvent.change(getByLabelText('Password'), { target: { value: 'qwer' } });
    fireEvent.change(getByLabelText('Confirm Password'), { target: { value: 'qwer' } });

    const signupButton = getByRole('button', { name: 'Signup' });

    // Submit the form
    fireEvent.click(signupButton);
    expect(toast.error).toHaveBeenCalledWith("Please fill in all mandatory fields.");

  
  });
  it('should display error if email entered is invalid', async () => {
    const { getByLabelText, getByText, getByRole} = render(<Router><SignupPage /></Router>);

    // Fill out the form
    const roleDropdown = screen.getByLabelText('Select Role');
    fireEvent.change(roleDropdown, { target: { value: 'renter/owner' } }); 
    fireEvent.change(getByLabelText('First Name'), { target: { value: 'John' } });
    fireEvent.change(getByLabelText('Last Name'), { target: { value: 'Doe' } });
    fireEvent.change(getByLabelText('Phone Number (optional)'), { target: { value: '514-555-1234' } });
    fireEvent.change(getByLabelText('Email'), { target: { value: 'john.doeexamplecom' } });
    fireEvent.change(getByLabelText('Password'), { target: { value: 'password123' } });
    fireEvent.change(getByLabelText('Confirm Password'), { target: { value: 'password456' } });

    const signupButton = getByRole('button', { name: 'Signup' });

    // Submit the form
    fireEvent.click(signupButton);

    expect(toast.error).toHaveBeenCalledWith("Invalid email format. Please include '@' and '.' in your email address.");
  });
  it('should allow management company to fill out the form and signup', async () => {
      const { getByLabelText, getByText, getByRole} = render(<Router><SignupPage /></Router>);
  
      // Fill out the form
      const roleDropdown = screen.getByLabelText('Select Role');
      fireEvent.change(roleDropdown, { target: { value: 'managementCompany' } }); 
  
      fireEvent.change(getByLabelText('Company Name'), { target: { value: 'Condo' } });
      fireEvent.change(getByLabelText('Email'), { target: { value: 'condo@gmail.com' } });
      fireEvent.change(getByLabelText('Phone Number (optional)'), { target: { value: '514-550-1217' } });
      fireEvent.change(getByLabelText('Password'), { target: { value: 'helloiamcompany123' } });
      fireEvent.change(getByLabelText('Confirm Password'), { target: { value: 'helloiamcompany123' } });

      const signupButton = getByText('Signup', { selector: 'button' });
  
      // Submit the form
      fireEvent.click(signupButton);
  
      // Assert form data
     // Access the form data from the component's state
      const formData = SignupPage.getFormData();
  
      // Assert form data
      expect(formData.role).toBe('managementCompany');
      expect(formData.companyName).toBe('Condo');
      expect(formData.email).toBe('condo@gmail.com');
      expect(formData.password).toBe('helloiamcompany123');
      expect(formData.confirmPassword).toBe('helloiamcompany123');
      });

      it("should allow the user to upload a profile picture", async () => {
        const { getByLabelText, getByText, getByRole} = render(<Router><SignupPage /></Router>);
    
        const file = new File(["dummy content"], "profile.jpg", { type: "image/jpeg" });
    
        const fileInput = getByLabelText("Choose an image:");
        fireEvent.change(fileInput, { target: { files: [file] } });
    
        await waitFor(() => {
          const previewImage = document.querySelector("img[alt='profile']");
          expect(previewImage).toBeInTheDocument();
          expect(previewImage.src).toContain("data:image/jpeg;base64,");
        });
      });
  // it('should display error message if passwords do not match', async () => {
  //   const { getByLabelText, getByText } = render(<Router><SignupPage /></Router>);

  //   const roleDropdown = screen.getByLabelText('Select Role');
  //   fireEvent.change(roleDropdown, { target: { value: 'managementCompany' } }); 
  //   // Fill out the form with mismatched passwords
  //   fireEvent.change(getByLabelText('Company Name'), { target: { value: 'CondoConnect' } });
  //   fireEvent.change(getByLabelText('Email'), { target: { value: 'john.doe@example.com' } });
  //   fireEvent.change(getByLabelText('Phone Number'), { target: { value: 'password123' } });
  //   fireEvent.change(getByLabelText('Password'), { target: { value: 'password123' } });
  //   fireEvent.change(getByLabelText('Confirm Password'), { target: { value: 'password456' } });

  //   // Submit the form
  //   const signupButton = getByRole('button', { name: 'Signup' });

  //   // Submit the form
  //   fireEvent.click(signupButton);

  //   // Wait for error toast message to appear
  //   await waitFor(() => expect(getByText('Passwords do not match.')).toBeInTheDocument());
  // });

  // Add more tests as needed...
});