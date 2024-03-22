import React from 'react';
import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CondoDetails from '../pages/CondoDetails';
import {BrowserRouter, MemoryRouter} from "react-router-dom";

// Mock required components
jest.mock('../components/Header.jsx', () => () => <div data-testid="header-mock">Header Mock</div>);
jest.mock('../components/Footer.jsx', () => () => <div data-testid="footer-mock">Footer Mock</div>);
jest.mock('../components/AddCondoBtn.jsx', () => () => <button data-testid="add-condo-btn-mock">Add Condo Btn Mock</button>);
jest.mock('../components/BackArrowBtn.jsx', () => () => <button data-testid="back-arrow-btn-mock">Back Arrow Btn Mock</button>);
jest.mock('../components/DeleteModal.jsx', () => ({ show, handleClose, message }) => (
  <div data-testid="delete-modal-mock" onClick={handleClose}>
    {show && <div>{message}</div>}
  </div>
));
jest.mock('../components/Popup_SendKey.js', () => ({ handleClose }) => (
  <div data-testid="popup-send-key-mock" onClick={handleClose}>
    <span>Popup Send Key Mock</span>
  </div>
));

describe('CondoDetails Component', () => {
  const condoDetailsProps = {
    name: 'Sample Condo',
    profilePicture: 'sample.jpg',
    address: '123 Main St',
    parkingCount: '2',
    lockerCount: '1',
    unitNumber: 'A101',
    price: '$500,000',
    size: '1000',
    squareFeet: '1200',
    pricesf: '$400/sq ft',
    status: 'Vacant',
    contact: 'john.doe@example.com',
    currentPrice: '$1200',
    rentDueDate: '2024-03-01',
  };

  it('renders CondoDetails component with provided props', () => {
    render(<MemoryRouter><CondoDetails {...condoDetailsProps} /></MemoryRouter>);
    
    // Modify the assertion to look for part of the text or use a different approach
    expect(screen.getByText(/Sample Condo/)).toBeInTheDocument();
    // Include other assertions for the rendered content
  });

  it('handles popup toggle correctly', async () => {
    render(<MemoryRouter><CondoDetails {...condoDetailsProps} /></MemoryRouter>);
    
    // Look for the button that triggers the popup
    const sendKeyButton = screen.getByText('Send Key');
    expect(sendKeyButton).toBeInTheDocument();
    
    // Trigger the click on the button to open the popup
    userEvent.click(sendKeyButton);
    
    // Use waitFor to wait for the popup to be rendered
    await waitFor(() => {
      const popupElement = screen.getByTestId('popup-send-key-mock');
      expect(popupElement).toBeInTheDocument();
      expect(popupElement).toHaveTextContent('Popup Send Key Mock');
    });
  });


  it('handles closing popup correctly', async () => {
    render(<MemoryRouter><CondoDetails {...condoDetailsProps} /></MemoryRouter>);
    
    // Look for the button that triggers the popup
    const sendKeyButton = screen.getByText('Send Key');
    expect(sendKeyButton).toBeInTheDocument();
    
    // Trigger the click on the button to open the popup
    userEvent.click(sendKeyButton);
    
    // Use waitFor to wait for the popup to be rendered
    await waitFor(() => {
      const popupElement = screen.getByTestId('popup-send-key-mock');
      expect(popupElement).toBeInTheDocument();
      expect(popupElement).toHaveTextContent('Popup Send Key Mock');
    });

    // Trigger the click on the popup to close it
    userEvent.click(screen.getByTestId('popup-send-key-mock'));

    // Use waitFor to wait for the popup to be removed from the DOM
    await waitFor(() => {
      const popupElement = screen.queryByTestId('popup-send-key-mock');
      expect(popupElement).toBeNull();
    });
  });

  it('handles click delete correctly', () => {
    render(<MemoryRouter><CondoDetails {...condoDetailsProps} /></MemoryRouter>);
    
    // Trigger the click delete function
    userEvent.click(screen.getByText('Delete'));
    
    // Add assertions for the updated state or UI based on the click delete
    expect(screen.getByTestId('delete-modal-mock')).toBeInTheDocument();
  });


  it('handles delete toggle correctly', () => {
    render(<MemoryRouter><CondoDetails {...condoDetailsProps} /></MemoryRouter>);
    
    // Trigger the delete toggle
    userEvent.click(screen.getByText('Delete'));
    
    // Add assertions for the updated state or UI based on the delete toggle
    expect(screen.getByTestId('delete-modal-mock')).toBeInTheDocument();
  });

  it('handles click delete correctly', () => {
    render(<MemoryRouter><CondoDetails {...condoDetailsProps} /></MemoryRouter>);
    
    // Trigger the click delete function
    userEvent.click(screen.getByText('Delete'));
    
    // Add assertions for the updated state or UI based on the click delete
    expect(screen.getByTestId('delete-modal-mock')).toBeInTheDocument();
  });

});
test('renders CondoDetails without crashing', () => {
  const { getByTestId } = render(
  <MemoryRouter>
    <CondoDetails/>
  </MemoryRouter>);
  expect(getByTestId('delete-button-test')).toBeInTheDocument();
});

test('setShow function is defined', () => {
  const { getByTestId } = render(
  <MemoryRouter>
    <CondoDetails/>
  </MemoryRouter>);
  const deleteButton = getByTestId('delete-button-test');

  fireEvent.click(deleteButton); // Simulate a click event on the delete button

  const popup = getByTestId('popup-delete-test'); 
  expect(popup).toBeInTheDocument();
 });


test('handleClose sets show to false', () => {
  const { getByTestId } = render
  (<MemoryRouter>
    <CondoDetails/>
  </MemoryRouter>);
  const sendKeyButton = getByTestId('popup-delete-test');

  fireEvent.click(sendKeyButton); // Simulate a click event on the send key button to set show to true
  expect(getByTestId('popup-delete-test')).toBeInTheDocument(); // Assuming popup is rendered when show is true

  fireEvent.click(sendKeyButton); // Simulate a click event on the send key button again
  const popup = getByTestId('popup-delete-test');
  expect(popup).toBeInTheDocument();
  expect(window.getComputedStyle(popup).getPropertyValue('display')).toBe('block');
});


//MATTS TESTS------------------
// Mock the asynchronous functions and other necessary imports...
// Mock the backend functions

// Mock the backend functions
// Mock the backend functions and other dependencies...
jest.mock('../backend/PropertyHandler', () => ({
  getCondo: jest.fn(() => Promise.resolve({
    propertyName: 'Bus Stand Manor',
    address: '43 Bus Stand Rd, Sector 43-A, Sector 43, Chandigarh, 160047, India',
    unitNumber: '1',
    unitSize: '2.5',
    parkingNumber: '7',
    lockerNumber: '2',
    propertyID: '4NMQJngouRxKmmzeCNgY',
    occupant: 'disbister.reid@gmail.com',
    status: 'Owned'
  })),
}));
jest.mock('../backend/ImageHandler', () => ({
  getCondoPicture: jest.fn(() => Promise.resolve('mocked_image_url')),
}));
jest.mock('../backend/UserHandler', () => ({
  getCompanyEmail: jest.fn(() => Promise.resolve('mocked_company_email')),
}));
jest.mock('../backend/RequestHandler', () => ({
  getRequests: jest.fn(() => Promise.resolve([{ /* mocked request data */ }])),
}));

describe('CondoDetails Component', () => {
  test('fetches condo details and requests on mount', async () => {
    render(
        <MemoryRouter>
          <CondoDetails/>
        </MemoryRouter>
    );

    // Wait for the asynchronous operations to complete
    await waitFor(() => {
      expect(require('../backend/PropertyHandler').getCondo).toHaveBeenCalledTimes(1);
      expect(require('../backend/ImageHandler').getCondoPicture).toHaveBeenCalledTimes(0);
      expect(require('../backend/UserHandler').getCompanyEmail).toHaveBeenCalledTimes(0);
      expect(require('../backend/RequestHandler').getRequests).toHaveBeenCalledTimes(1);
    });

    // Add any additional assertions here based on your component's behavior
  });
});