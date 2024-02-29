import React from "react";
import { render, fireEvent, screen, cleanup } from "@testing-library/react";
import PropertyComponent from "../components/PropertyComponent.jsx";
import { BrowserRouter } from 'react-router-dom';

afterEach(()=>{
    cleanup();
});

test('Should render property component with validator attributes', () => {
    const propertyDetails = {
        picture: 'https://t4.ftcdn.net/jpg/01/69/69/21/360_F_169692156_L1aGrmJaHsZxF1sWQGuRKn3mR60bBqhN.jpg',
        propertyID: 'ID#',
        propertyName: 'Property Name',
        address: '123 Main St, City',
        unitCount: '101',
        parkingCount: 'P101',
        lockerCount: 'L101',
    };

    render(
      <BrowserRouter>
        <PropertyComponent
          property={propertyDetails}
        />
      </BrowserRouter>
    );
    expect(screen.getByText(propertyDetails.propertyName)).toBeInTheDocument();
    expect(screen.getByText(propertyDetails.address)).toBeInTheDocument();
    expect(screen.getByText('Unit Count: ' + propertyDetails.unitCount)).toBeInTheDocument();
});

test('Should not render profile picture of property component', () => {
    const propertyDetails = {
        picture: null,
        propertyID: 'ID#',
        propertyName: 'Property Name',
        address: '123 Main St, City',
        unitCount: '102',
        parkingCount: 'P102',
        lockerCount: 'L102'
    };

    render(
      <BrowserRouter>
        <PropertyComponent
          property={propertyDetails}
        />
      </BrowserRouter>
    );
    expect(screen.queryByAltText('Profile')).not.toBeInTheDocument();
});

test('Should render profile picture of condo component', () => {
    const propertyDetails = {
        picture: 'https://t4.ftcdn.net/jpg/01/69/69/21/360_F_169692156_L1aGrmJaHsZxF1sWQGuRKn3mR60bBqhN.jpg',
        propertyID: 'ID#',
        propertyName: 'Property Name',
        address: '123 Main St, City',
        unitCount: '102',
        parkingCount: 'P102',
        lockerCount: 'L102'
    };

    render(
      <BrowserRouter>
        <PropertyComponent
          property={propertyDetails}
        />
      </BrowserRouter>
    );
    const picture = screen.getByAltText('Profile');
    expect(picture).toBeInTheDocument();
    expect(picture).toHaveAttribute('src', propertyDetails.picture);
});

test('Should navigate to property details page when "Details" button is clicked', () => {
  const propertyDetails = {
    picture: 'https://example.com/profile.jpg',
    propertyID: 'ID#',
    propertyName: 'Property Name',
    address: '123 main rd',
    unitCount: '10',
    parkingCount: '5',
    lockerCount: '2',
  };

  render(
    <BrowserRouter>
      <PropertyComponent
        property={propertyDetails}
      />
    </BrowserRouter>
  );

  // Simulate a click on the "Details" button
  fireEvent.click(screen.getByText('Details'));
});