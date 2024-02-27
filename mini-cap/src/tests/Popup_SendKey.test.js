import React from 'react';
import { render, screen, fireEvent, waitFor,cleanup } from '@testing-library/react';
import Popup_SendKey from '../components/Popup_SendKey';
import { BrowserRouter } from 'react-router-dom';
import { toast } from "react-toastify";

// Mocking asynchronous functions
jest.mock('../backend/Fetcher', () => ({
  checkEmailExists: jest.fn(),
  storeCondoKey: jest.fn(),
  sendCondoKey: jest.fn(),
}));


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


describe('Popup_SendKey Component', () => {
  it('renders the popup content correctly', () => {
    render(
    <BrowserRouter>
    <Popup_SendKey handleClose={() => {}} />
    </BrowserRouter>
    ); 

    expect(screen.getByText('Send Your Condo Key')).toBeInTheDocument();
    expect(screen.getByText('Who are you sending this key to?')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('Send Key')).toBeInTheDocument();
  });

  it('handles form input changes correctly', () => {
    render(
      <BrowserRouter>
        <Popup_SendKey handleClose={() => {}} />
      </BrowserRouter>
    );

    // Simulate user input
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } });

    // Check if input change is reflected in the input field
    expect(screen.getByLabelText('Email').value).toBe('test@example.com');
  });




  it('displays validation error messages correctly', async () => {
    render(
      <BrowserRouter>
        <Popup_SendKey handleClose={() => {}} />
      </BrowserRouter>
    );

    // Submit form without filling any fields
    fireEvent.click(screen.getByText('Send Key'));

    // Check if validation error message is displayed
      expect(toast.error).toHaveBeenCalledWith("Please fill in all fields.");
  });

  it('returns the correct form data using getFormData', () => {
    const { getByLabelText } = render(
      <BrowserRouter>
        <Popup_SendKey handleClose={() => {}} />
      </BrowserRouter>
    );

    // Fill out the form
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } });

    // Get the form data using getFormData function
    const formData = Popup_SendKey.getFormData();

    // Assert that the form data is correct
    expect(formData.role).toBe('renter');
    expect(formData.email).toBe('test@example.com');
  });

  it('displays error toast message for invalid email format (missing ".")', () => {
    render(
      <BrowserRouter>
        <Popup_SendKey handleClose={() => {}} />
      </BrowserRouter>
    );

    // Fill out the form with an invalid email format (missing ".")
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'invalidemail@examplecom' } });

    // Submit the form
    fireEvent.click(screen.getByText('Send Key'));

    // Check if error toast is displayed for invalid email format
    expect(toast.error).toHaveBeenCalledWith(
      "Invalid email format. Please include '@' and '.' in your email address."
    );
  });
  
})