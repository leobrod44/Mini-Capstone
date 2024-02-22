import React from "react";
import { render, screen, cleanup } from "@testing-library/react";
import CondoComponent from "../components/CondoComponent.jsx";

afterEach(()=>{
    cleanup();
});

test('Should render owner condo component', () => {
    const condoDetails = {
        name: 'Property Name',
        profilePicture: 'https://t4.ftcdn.net/jpg/01/69/69/21/360_F_169692156_L1aGrmJaHsZxF1sWQGuRKn3mR60bBqhN.jpg',
        address: '123 Main St, City',
        unitNumber: '101',
        parkingSpot: 'P101',
        locker: 'L101',
        userType: 'Owner'
    };

    render(
      <CondoComponent
        {...condoDetails}
      />
    );
    expect(screen.getByText(condoDetails.name)).toBeInTheDocument();
    expect(screen.getByText(condoDetails.address)).toBeInTheDocument();
    expect(screen.getByText('Unit Number: ' + condoDetails.unitNumber)).toBeInTheDocument();
    expect(screen.getByText('Owner')).toBeInTheDocument();
});

test('Should render renter condo component', () => {
    const condoDetails = {
        name: 'Property Name',
        profilePicture: 'https://t4.ftcdn.net/jpg/01/69/69/21/360_F_169692156_L1aGrmJaHsZxF1sWQGuRKn3mR60bBqhN.jpg',
        address: '123 Main St, City',
        unitNumber: '102',
        parkingSpot: 'P102',
        locker: 'L102',
        userType: 'Renter'
    };

    render(
      <CondoComponent
        {...condoDetails}
      />
    );
    expect(screen.getByText(condoDetails.name)).toBeInTheDocument();
    expect(screen.getByText(condoDetails.address)).toBeInTheDocument();
    expect(screen.getByText('Unit Number: ' + condoDetails.unitNumber)).toBeInTheDocument();
    expect(screen.getByText('Renter')).toBeInTheDocument();
});

test('Should not render profile picture of condo component', () => {
    const condoDetails = {
        name: 'Property Name',
        profilePicture: null,
        address: '123 Main St, City',
        unitNumber: '102',
        parkingSpot: 'P102',
        locker: 'L102',
        userType: 'Renter'
    };

    render(
      <CondoComponent
        {...condoDetails}
      />
    );
    expect(screen.getByText(condoDetails.name)).toBeInTheDocument();
    expect(screen.getByText(condoDetails.address)).toBeInTheDocument();
    expect(screen.getByText('Unit Number: ' + condoDetails.unitNumber)).toBeInTheDocument();
    expect(screen.getByText('Renter')).toBeInTheDocument();
    expect(screen.queryByAltText('Profile')).not.toBeInTheDocument();
});

test('Should render profile picture of condo component', () => {
    const condoDetails = {
        name: 'Property Name',
        profilePicture: 'https://t4.ftcdn.net/jpg/01/69/69/21/360_F_169692156_L1aGrmJaHsZxF1sWQGuRKn3mR60bBqhN.jpg',
        address: '123 Main St, City',
        unitNumber: '102',
        parkingSpot: 'P102',
        locker: 'L102',
        userType: 'Renter'
    };

    render(
      <CondoComponent
        {...condoDetails}
      />
    );
    expect(screen.getByText(condoDetails.name)).toBeInTheDocument();
    expect(screen.getByText(condoDetails.address)).toBeInTheDocument();
    expect(screen.getByText('Unit Number: ' + condoDetails.unitNumber)).toBeInTheDocument();
    expect(screen.getByText('Renter')).toBeInTheDocument();
    const profilePicture = screen.getByAltText('Profile');
    expect(profilePicture).toBeInTheDocument();
    expect(profilePicture).toHaveAttribute('src', condoDetails.profilePicture);
});