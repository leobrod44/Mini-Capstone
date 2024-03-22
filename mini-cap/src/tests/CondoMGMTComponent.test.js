import React from "react";
import { render, fireEvent, screen, cleanup } from "@testing-library/react";
import CondoComponent from "../components/CondoMGMTComponent.jsx";
import { MemoryRouter } from 'react-router-dom';
import { BrowserRouter } from 'react-router-dom';

afterEach(()=>{
    cleanup();
});

test('Should not render profile picture of condo component', () => {
    const condoDetails = {
        picture: null,
        parkingNumber: 'P101',
        lockerNumber: 'L101',
        property: 'Property Name',
        squareFeet: '100',
        unitNumber: '101',
        unitPrice: '100000',
        unitSize: '3.5'
    };

    render(
      <BrowserRouter>
        <CondoComponent
          {...condoDetails}
        />
      </BrowserRouter>
    );
    expect(screen.getByText(condoDetails.unitNumber)).toBeInTheDocument();
    expect(screen.getByText('Unit Number: ' + condoDetails.unitNumber)).toBeInTheDocument();
    expect(screen.queryByAltText('Profile')).not.toBeInTheDocument();
});

test('Should render profile picture of condo component', () => {
    const condoDetails = {
        picture: 'https://t4.ftcdn.net/jpg/01/69/69/21/360_F_169692156_L1aGrmJaHsZxF1sWQGuRKn3mR60bBqhN.jpg',
        parkingNumber: 'P101',
        lockerNumber: 'L101',
        property: 'Property Name',
        squareFeet: '100',
        unitNumber: '101',
        unitPrice: '100000',
        unitSize: '3.5'
    };

    render(
      <BrowserRouter>
        <CondoComponent
          {...condoDetails}
        />
      </BrowserRouter>
    );
    expect(screen.getByText(condoDetails.unitNumber)).toBeInTheDocument();
    expect(screen.getByText('Unit Number: ' + condoDetails.unitNumber)).toBeInTheDocument();
    const profilePicture = screen.getByAltText('Profile');
    expect(profilePicture).toBeInTheDocument();
    expect(profilePicture).toHaveAttribute('src', condoDetails.profilePicture);
});

test('Should render all condo management component details', () => {
  const condoDetails = {
    picture: 'https://t4.ftcdn.net/jpg/01/69/69/21/360_F_169692156_L1aGrmJaHsZxF1sWQGuRKn3mR60bBqhN.jpg',
    parkingNumber: 'P101',
    lockerNumber: 'L101',
    property: 'Property Name',
    squareFeet: '100',
    unitNumber: '101',
    unitPrice: '100000',
    unitSize: '3.5'
  };

  render(
    <BrowserRouter>
      <CondoComponent
        {...condoDetails}
      />
    </BrowserRouter>
  );
  expect(screen.getByText(condoDetails.unitNumber)).toBeInTheDocument();
  expect(screen.getByText('Unit Number: ' + condoDetails.unitNumber)).toBeInTheDocument();
  expect(screen.getByText('Parking Spot: ' + condoDetails.parkingNumber)).toBeInTheDocument();
  expect(screen.getByText('Locker: ' + condoDetails.lockerNumber)).toBeInTheDocument();
  const profilePicture = screen.getByAltText('Profile');
  expect(profilePicture).toBeInTheDocument();
  expect(profilePicture).toHaveAttribute('src', condoDetails.picture);
});

test('Should render only validator condo management component details', () => {
  const condoDetails = {
    picture: null,
    parkingNumber: null,
    lockerNumber: null,
    property: null,
    squareFeet: null,
    unitNumber: '101',
    unitPrice: null,
    unitSize: null
  };

  render(
    <BrowserRouter>
      <CondoComponent
        {...condoDetails}
      />
    </BrowserRouter>
  );
  expect(screen.queryByAltText('Profile')).not.toBeInTheDocument();
  expect(screen.queryByText('Parking Spot:')).not.toBeInTheDocument();
  expect(screen.queryByText('Locker: ')).not.toBeInTheDocument();
  expect(screen.getByText('Unit Number: ' + condoDetails.unitNumber)).toBeInTheDocument();
});

test('Should render condo management component details without parking and locker details', () => {
  const condoDetails = {
    picture: 'https://t4.ftcdn.net/jpg/01/69/69/21/360_F_169692156_L1aGrmJaHsZxF1sWQGuRKn3mR60bBqhN.jpg',
    parkingNumber: null,
    lockerNumber: null,
    property: 'Property Name',
    squareFeet: '100',
    unitNumber: '101',
    unitPrice: '100000',
    unitSize: '3.5'
  };

  render(
    <BrowserRouter>
      <CondoComponent
        {...condoDetails}
      />
    </BrowserRouter>
  );
  expect(screen.getByText(condoDetails.unitNumber)).toBeInTheDocument();
  expect(screen.getByText('Unit Number: ' + condoDetails.unitNumber)).toBeInTheDocument();
  expect(screen.queryByText('Parking Spot: ')).not.toBeInTheDocument();
  expect(screen.queryByText('Locker: ')).not.toBeInTheDocument();
  const profilePicture = screen.getByAltText('Profile');
  expect(profilePicture).toBeInTheDocument();
  expect(profilePicture).toHaveAttribute('src', condoDetails.profilePicture);
});

test('Should display "send key" popup', () => {
  const condoDetails = {
    picture: 'https://t4.ftcdn.net/jpg/01/69/69/21/360_F_169692156_L1aGrmJaHsZxF1sWQGuRKn3mR60bBqhN.jpg',
    parkingNumber: 'P101',
    lockerNumber: 'L101',
    property: 'Property Name',
    squareFeet: '100',
    unitNumber: '101',
    unitPrice: '100000',
    unitSize: '3.5'
  };

  render(
    <BrowserRouter>
      <CondoComponent
        {...condoDetails}
        
      />
    </BrowserRouter>
  );

  expect(screen.getByText('Send Key')).toBeInTheDocument();
  expect(screen.queryByText('Send Your Condo Key')).not.toBeInTheDocument();
  fireEvent.click(screen.getByText('Send Key'));
  expect(screen.getByText('Send Your Condo Key')).toBeInTheDocument();
});

test('Should toggle popup when "Send Key" button is clicked', () => {
  const condoDetails = {
    picture: 'https://example.com/profile.jpg',
    unitNumber: '101',
    parkingNumber: 'P101',
    lockerNumber: 'L101',
    property: 'Property Name',
    squareFeet: '100',
    unitPrice: '100000',
    unitSize: '3.5',
    condoId: '123'
  };

  render(
    <BrowserRouter>
      <CondoComponent
        {...condoDetails}
      />
    </BrowserRouter>
  );

  expect(screen.queryByText('Send Your Condo Key')).not.toBeInTheDocument();
  fireEvent.click(screen.getByTestId("send-key-button"));
  expect(screen.getByText('Send Your Condo Key')).toBeInTheDocument();
  fireEvent.click(screen.getByTestId("send-key-button"));
  expect(screen.queryByText('Send Your Condo Key')).not.toBeInTheDocument();
});

test('Should call handlePopupToggle when "Send Key" button is clicked', () => {
  const condoDetails = {
    picture: 'https://example.com/profile.jpg',
    unitNumber: '101',
    parkingNumber: 'P101',
    lockerNumber: 'L101',
    property: 'Property Name',
    squareFeet: '100',
    unitPrice: '100000',
    unitSize: '3.5',
    condoId: '123'
  };

  const handlePopupToggle = jest.fn();

  render(
    <BrowserRouter>
      <CondoComponent 
        {...condoDetails} 
        handlePopupToggle={handlePopupToggle} 
      />
    </BrowserRouter>
  );

  fireEvent.click(screen.getByTestId("send-key-button"));
});


afterEach(() => {
  cleanup();
});

test('Should not render profile picture of condo component', () => {
  const condoDetails = {
      picture: null,
      parkingNumber: 'P101',
      lockerNumber: 'L101',
      property: 'Property Name',
      squareFeet: '100',
      unitNumber: '101',
      unitPrice: '100000',
      unitSize: '3.5'
  };

  render(
    <MemoryRouter> {/* Wrap CondoComponent with MemoryRouter */}
      <CondoComponent
        {...condoDetails}
      />
    </MemoryRouter>
  );
  expect(screen.getByText(condoDetails.unitNumber)).toBeInTheDocument();
  expect(screen.getByText('Unit Number: ' + condoDetails.unitNumber)).toBeInTheDocument();
  expect(screen.queryByAltText('Profile')).not.toBeInTheDocument();
});

test('Toggling showPopup state when "Send Key" button is clicked', () => {
  const condoDetails = {
    picture: 'https://example.com/profile.jpg',
    unitNumber: '101',
    parkingNumber: 'P101',
    lockerNumber: 'L101',
    property: 'Property Name',
    squareFeet: '100',
    unitPrice: '100000',
    unitSize: '3.5',
    condoId: '123'
  };

  render(
    <MemoryRouter>
      <CondoComponent
        {...condoDetails}
      />
    </MemoryRouter>
  );

  // Initially, showPopup should be false
  expect(screen.queryByText('Send Your Condo Key')).not.toBeInTheDocument();

  // Click on the "Send Key" button to toggle showPopup to true
  fireEvent.click(screen.getByTestId('send-key-button'));

  expect(screen.getByText('Send Your Condo Key')).toBeInTheDocument();

  // Click again on the "Send Key" button to toggle showPopup back to false
  fireEvent.click(screen.getByTestId('send-key-button'));

  expect(screen.queryByText('Send Your Condo Key')).not.toBeInTheDocument();
});

test('Should verify "Details" button is clicked', () => {
  const condoDetails = {
    picture: 'https://example.com/profile.jpg',
    unitNumber: '101',
    parkingNumber: 'P101',
    lockerNumber: 'L101',
    property: 'Property Name',
    squareFeet: '100',
    unitPrice: '100000',
    unitSize: '3.5',
    condoId: '123'
  };

  const navigateMock = jest.fn(); 

  render(
    <BrowserRouter>
      <CondoComponent
        {...condoDetails}
        navigate={navigateMock} 
      />
    </BrowserRouter>
  );

  const detailsButton = screen.getByText('Details'); 
  fireEvent.click(detailsButton); 
});