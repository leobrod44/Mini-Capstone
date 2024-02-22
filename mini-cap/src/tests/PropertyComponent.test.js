import React from "react";
import { render, fireEvent, screen, cleanup } from "@testing-library/react";
import PropertyComponent from "../components/PropertyComponent.jsx";
import { BrowserRouter } from 'react-router-dom';

afterEach(()=>{
    cleanup();
});

test('Should render property component with validator attributes', () => {
    const propertyDetails = {
        name: 'Property Name',
        profilePicture: 'https://t4.ftcdn.net/jpg/01/69/69/21/360_F_169692156_L1aGrmJaHsZxF1sWQGuRKn3mR60bBqhN.jpg',
        address: '123 Main St, City',
        unitCount: '101',
        parkingCount: 'P101',
        lockerCount: 'L101',
    };

    render(
      <BrowserRouter>
        <PropertyComponent
          {...propertyDetails}
        />
      </BrowserRouter>
    );
    expect(screen.getByText(propertyDetails.name)).toBeInTheDocument();
    expect(screen.getByText(propertyDetails.address)).toBeInTheDocument();
    expect(screen.getByText('Unit Count: ' + propertyDetails.unitCount)).toBeInTheDocument();
});

test('Should not render profile picture of property component', () => {
    const propertyDetails = {
        name: 'Property Name',
        profilePicture: null,
        address: '123 Main St, City',
        unitCount: '102',
        parkingCount: 'P102',
        lockerCount: 'L102'
    };

    render(
      <BrowserRouter>
        <PropertyComponent
          {...propertyDetails}
        />
      </BrowserRouter>
    );
    expect(screen.queryByAltText('Profile')).not.toBeInTheDocument();
});

test('Should render profile picture of condo component', () => {
    const propertyDetails = {
        name: 'Property Name',
        profilePicture: 'https://t4.ftcdn.net/jpg/01/69/69/21/360_F_169692156_L1aGrmJaHsZxF1sWQGuRKn3mR60bBqhN.jpg',
        address: '123 Main St, City',
        unitCount: '102',
        parkingCount: 'P102',
        lockerCount: 'L102'
    };

    render(
      <BrowserRouter>
        <PropertyComponent
          {...propertyDetails}
        />
      </BrowserRouter>
    );
    const profilePicture = screen.getByAltText('Profile');
    expect(profilePicture).toBeInTheDocument();
    expect(profilePicture).toHaveAttribute('src', propertyDetails.profilePicture);
});

test('Should navigate to property details page when "Details" button is clicked', () => {
  const propertyDetails = {
    name: 'Property Name',
    profilePicture: 'https://example.com/profile.jpg',
    address: '123 main rd',
    unitCount: '10',
    parkingCount: '5',
    lockerCount: '2',
  };

  render(
    <BrowserRouter>
      <PropertyComponent
        {...propertyDetails}
      />
    </BrowserRouter>
  );

  // Simulate a click on the "Details" button
  fireEvent.click(screen.getByText('Details'));
});