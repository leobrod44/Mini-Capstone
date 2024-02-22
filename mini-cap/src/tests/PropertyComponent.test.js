import React from "react";
import { render, screen, cleanup } from "@testing-library/react";
import PropertyComponent from "../components/PropertyComponent.jsx";

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
      <PropertyComponent
        {...propertyDetails}
      />
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
      <PropertyComponent
        {...propertyDetails}
      />
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
      <PropertyComponent
        {...propertyDetails}
      />
    );
    const profilePicture = screen.getByAltText('Profile');
    expect(profilePicture).toBeInTheDocument();
    expect(profilePicture).toHaveAttribute('src', propertyDetails.profilePicture);
});