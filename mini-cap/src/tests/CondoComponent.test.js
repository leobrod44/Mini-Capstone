import React from "react";
import { render, screen, cleanup } from "@testing-library/react";
import CondoComponent from "../components/CondoComponent.jsx";
import { BrowserRouter } from 'react-router-dom';

afterEach(()=>{
    cleanup();
});

test('Should render owner condo component', () => {
    const condoDetails = {
        property: 'Property Name',
        profilePicture: 'https://t4.ftcdn.net/jpg/01/69/69/21/360_F_169692156_L1aGrmJaHsZxF1sWQGuRKn3mR60bBqhN.jpg',
        address: '123 Main St, City',
        unitNumber: '101',
        parkingNumber: 'P101',
        locker: 'L101',
        userType: 'Owner'
    };

    render(
      <BrowserRouter>
        <CondoComponent
            condo={condoDetails}
        />
      </BrowserRouter>
    );

    expect(screen.getByText(condoDetails.property)).toBeInTheDocument();
    expect(screen.getByText(condoDetails.address)).toBeInTheDocument();
    expect(screen.getByText('Unit #: ' + condoDetails.unitNumber)).toBeInTheDocument();
    expect(screen.getByText('Owner')).toBeInTheDocument();
});

test('Should render renter condo component', () => {
    const condoDetails = {
        property: 'Property Name',
        profilePicture: 'https://t4.ftcdn.net/jpg/01/69/69/21/360_F_169692156_L1aGrmJaHsZxF1sWQGuRKn3mR60bBqhN.jpg',
        address: '123 Main St, City',
        unitNumber: '102',
        parkingNumber: 'P102',
        locker: 'L102',
        userType: 'Renter'
    };

    render(
      <BrowserRouter>
        <CondoComponent
            condo={condoDetails}
        />
      </BrowserRouter>
    );

    expect(screen.getByText(condoDetails.property)).toBeInTheDocument();
    expect(screen.getByText(condoDetails.address)).toBeInTheDocument();
    expect(screen.getByText('Unit #: ' + condoDetails.unitNumber)).toBeInTheDocument();
    expect(screen.getByText('Renter')).toBeInTheDocument();
});

test('Should not render profile picture of renter condo component', () => {
    const condoDetails = {
        property: 'Property Name',
        picture: null,
        address: '123 Main St, City',
        unitNumber: '102',
        parkingNumber: 'P102',
        locker: 'L102',
        userType: 'Renter'
    };

    render(
      <BrowserRouter>
        <CondoComponent
            condo={condoDetails}
        />
      </BrowserRouter>
    );

    expect(screen.getByText(condoDetails.property)).toBeInTheDocument();
    expect(screen.getByText(condoDetails.address)).toBeInTheDocument();
    expect(screen.getByText('Unit #: ' + condoDetails.unitNumber)).toBeInTheDocument();
    expect(screen.getByText('Renter')).toBeInTheDocument();
    expect(screen.queryByAltText('Profile')).not.toBeInTheDocument();
});

test('Should render profile picture of renter condo component', () => {
    const condoDetails = {
        property: 'Property Name',
        picture: 'https://t4.ftcdn.net/jpg/01/69/69/21/360_F_169692156_L1aGrmJaHsZxF1sWQGuRKn3mR60bBqhN.jpg',
        address: '123 Main St, City',
        unitNumber: '102',
        parkingNumber: 'P102',
        locker: 'L102',
        userType: 'Renter'
    };

    render(
      <BrowserRouter>
        <CondoComponent
            condo={condoDetails}
        />
      </BrowserRouter>
    );

    expect(screen.getByText(condoDetails.property)).toBeInTheDocument();
    expect(screen.getByText(condoDetails.address)).toBeInTheDocument();
    expect(screen.getByText('Unit #: ' + condoDetails.unitNumber)).toBeInTheDocument();
    expect(screen.getByText('Renter')).toBeInTheDocument();
    const picture = screen.getByAltText("Profile");
    expect(picture).toBeInTheDocument();
    expect(picture).toHaveAttribute('src', condoDetails.icture);
});

test('Should not render profile picture of owner condo component', () => {
  const condoDetails = {
      property: 'Property Name',
      picture: null,
      address: '123 Main St, City',
      unitNumber: '102',
      parkingNumber: 'P102',
      locker: 'L102',
      userType: 'Owner'
  };

  render(
    <BrowserRouter>
      <CondoComponent
          condo={condoDetails}
      />
    </BrowserRouter>
  );

  expect(screen.getByText('Owner')).toBeInTheDocument();
  expect(screen.queryByAltText('Profile')).not.toBeInTheDocument();
});

test('Should render profile picture of owner condo component', () => {
  const condoDetails = {
      property: 'Property Name',
      picture: 'https://t4.ftcdn.net/jpg/01/69/69/21/360_F_169692156_L1aGrmJaHsZxF1sWQGuRKn3mR60bBqhN.jpg',
      address: '123 Main St, City',
      unitNumber: '102',
      parkingNumber: 'P102',
      locker: 'L102',
      userType: 'Owner'
  };

  render(
    <BrowserRouter>
      <CondoComponent
          condo={condoDetails}
      />
    </BrowserRouter>
  );

  expect(screen.getByText('Owner')).toBeInTheDocument();
  const picture = screen.getByAltText("Profile");
  expect(picture).toBeInTheDocument();
  expect(picture).toHaveAttribute('src', condoDetails.picture);
});

test('Should render renter condo component with parking spot', () => {
  const condoDetails = {
    property: 'Property Name',
    picture: 'https://example.com/profile.jpg',
    address: '123 Main St, City',
    unitNumber: '101',
    parkingNumber: 'P102',
    userType: 'Renter'
  };

  render(
    <BrowserRouter>
      <CondoComponent
          condo={condoDetails}
      />
    </BrowserRouter>
  );

  expect(screen.getByText(condoDetails.property)).toBeInTheDocument();
  expect(screen.getByText(condoDetails.address)).toBeInTheDocument();
  expect(screen.getByText('Unit #: ' + condoDetails.unitNumber)).toBeInTheDocument();
  expect(screen.getByText('Renter')).toBeInTheDocument();
  expect(screen.queryByText('Parking #: ' + condoDetails.parkingNumber)).toBeInTheDocument();
});

test('Should render condo component with locker number', () => {
  const condoDetails = {
    property: 'Property Name',
    picture: 'https://example.com/profile.jpg',
    address: '123 Main St, City',
    unitNumber: '101',
    lockerNumber: 'L101',
    userType: 'Owner'
  };

  render(
    <BrowserRouter>
      <CondoComponent
          condo={condoDetails}
      />
    </BrowserRouter>
  );

  expect(screen.getByText(condoDetails.property)).toBeInTheDocument();
  expect(screen.getByText(condoDetails.address)).toBeInTheDocument();
  expect(screen.getByText('Unit #: ' + condoDetails.unitNumber)).toBeInTheDocument();
  expect(screen.getByText('Owner')).toBeInTheDocument();
  expect(screen.getByText('Locker #: ' + condoDetails.lockerNumber)).toBeInTheDocument();
});


test('Should render renter condo component without parking spot', () => {
  const condoDetails = {
    property: 'Property Name',
    picture: 'https://example.com/profile.jpg',
    address: '123 Main St, City',
    unitNumber: '101',
    parkingNumber: 'P102',
    userType: 'Renter'
  };

  render(
    <BrowserRouter>
      <CondoComponent
          condo={condoDetails}
      />
    </BrowserRouter>
  );

  expect(screen.queryByText('Parking #:')).not.toBeInTheDocument();
});

test('Should render condo component without locker number', () => {
  const condoDetails = {
    property: 'Property Name',
    picture: 'https://example.com/profile.jpg',
    address: '123 Main St, City',
    unitNumber: '101',
    lockerNumber: 'L101',
    userType: 'Owner'
  };

  render(
    <BrowserRouter>
      <CondoComponent
          condo={condoDetails}
      />
    </BrowserRouter>
  );

  expect(screen.queryByText('Locker #:')).not.toBeInTheDocument();
});

test('Should render renter condo component without parking spot and locker number', () => {
  const condoDetails = {
    property: 'Property Name',
    picture: 'https://example.com/profile.jpg',
    address: '123 Main St, City',
    unitNumber: '101',
    userType: 'Renter'
  };

  render(
    <BrowserRouter>
      <CondoComponent
          condo={condoDetails}
      />
    </BrowserRouter>
  );

  expect(screen.getByText(condoDetails.property)).toBeInTheDocument();
  expect(screen.getByText(condoDetails.address)).toBeInTheDocument();
  expect(screen.getByText('Unit #: ' + condoDetails.unitNumber)).toBeInTheDocument();
  expect(screen.getByText('Renter')).toBeInTheDocument();
  expect(screen.queryByText('Parking #:')).not.toBeInTheDocument();
  expect(screen.queryByText('Locker #:')).not.toBeInTheDocument();
});