import React from "react";
import { render, screen, cleanup } from "@testing-library/react";
import CondoComponent from "../components/CondoMGMTComponent.jsx";

afterEach(()=>{
    cleanup();
});

test('Should not render profile picture of condo component', () => {
    const condoDetails = {
        name: 'Property Name',
        profilePicture: null,
        unitNumber: '101',
        parkingSpot: 'P101',
        locker: 'L101'
    };

    render(
      <CondoComponent
        {...condoDetails}
      />
    );
    expect(screen.getByText(condoDetails.name + ' + ' + condoDetails.unitNumber)).toBeInTheDocument();
    expect(screen.getByText('Unit Number: ' + condoDetails.unitNumber)).toBeInTheDocument();
    expect(screen.queryByAltText('Profile')).not.toBeInTheDocument();
});

test('Should render profile picture of condo component', () => {
    const condoDetails = {
        name: 'Property Name',
        profilePicture: 'https://t4.ftcdn.net/jpg/01/69/69/21/360_F_169692156_L1aGrmJaHsZxF1sWQGuRKn3mR60bBqhN.jpg',
        unitNumber: '101',
        parkingSpot: 'P101',
        locker: 'L101'
    };

    render(
      <CondoComponent
        {...condoDetails}
      />
    );
    expect(screen.getByText(condoDetails.name + ' + ' + condoDetails.unitNumber)).toBeInTheDocument();
    expect(screen.getByText('Unit Number: ' + condoDetails.unitNumber)).toBeInTheDocument();
    const profilePicture = screen.getByAltText('Profile');
    expect(profilePicture).toBeInTheDocument();
    expect(profilePicture).toHaveAttribute('src', condoDetails.profilePicture);
});

test('Should render all condo management component details', () => {
  const condoDetails = {
      name: 'Property Name',
      profilePicture: 'https://t4.ftcdn.net/jpg/01/69/69/21/360_F_169692156_L1aGrmJaHsZxF1sWQGuRKn3mR60bBqhN.jpg',
      unitNumber: '101',
      parkingSpot: 'P101',
      locker: 'L101'
  };

  render(
    <CondoComponent
      {...condoDetails}
    />
  );
  expect(screen.getByText(condoDetails.name + ' + ' + condoDetails.unitNumber)).toBeInTheDocument();
  expect(screen.getByText('Unit Number: ' + condoDetails.unitNumber)).toBeInTheDocument();
  expect(screen.getByText('Parking Spot: ' + condoDetails.parkingSpot)).toBeInTheDocument();
  expect(screen.getByText('Locker: ' + condoDetails.locker)).toBeInTheDocument();
  const profilePicture = screen.getByAltText('Profile');
  expect(profilePicture).toBeInTheDocument();
  expect(profilePicture).toHaveAttribute('src', condoDetails.profilePicture);
});


test('Should render condo management component details without parking details', () => {
  const condoDetails = {
      name: 'Property Name',
      profilePicture: 'https://t4.ftcdn.net/jpg/01/69/69/21/360_F_169692156_L1aGrmJaHsZxF1sWQGuRKn3mR60bBqhN.jpg',
      unitNumber: '101',
      parkingSpot: null,
      locker: 'L101'
  };

  render(
    <CondoComponent
      {...condoDetails}
    />
  );
  expect(screen.getByText(condoDetails.name + ' + ' + condoDetails.unitNumber)).toBeInTheDocument();
  expect(screen.getByText('Unit Number: ' + condoDetails.unitNumber)).toBeInTheDocument();
  expect(screen.queryByText('Parking Spot:')).not.toBeInTheDocument();
  expect(screen.getByText('Locker: ' + condoDetails.locker)).toBeInTheDocument();
  const profilePicture = screen.getByAltText('Profile');
  expect(profilePicture).toBeInTheDocument();
  expect(profilePicture).toHaveAttribute('src', condoDetails.profilePicture);
});

test('Should render condo management component details without locker details', () => {
  const condoDetails = {
      name: 'Property Name',
      profilePicture: 'https://t4.ftcdn.net/jpg/01/69/69/21/360_F_169692156_L1aGrmJaHsZxF1sWQGuRKn3mR60bBqhN.jpg',
      unitNumber: '101',
      parkingSpot: 'p101',
      locker: null
  };

  render(
    <CondoComponent
      {...condoDetails}
    />
  );
  expect(screen.getByText(condoDetails.name + ' + ' + condoDetails.unitNumber)).toBeInTheDocument();
  expect(screen.getByText('Unit Number: ' + condoDetails.unitNumber)).toBeInTheDocument();
  expect(screen.getByText('Parking Spot: ' + condoDetails.parkingSpot)).toBeInTheDocument();
  expect(screen.queryByText('Locker: ')).not.toBeInTheDocument();
  const profilePicture = screen.getByAltText('Profile');
  expect(profilePicture).toBeInTheDocument();
  expect(profilePicture).toHaveAttribute('src', condoDetails.profilePicture);
});

test('Should render condo management component details without parking and locker details', () => {
  const condoDetails = {
      name: 'Property Name',
      profilePicture: 'https://t4.ftcdn.net/jpg/01/69/69/21/360_F_169692156_L1aGrmJaHsZxF1sWQGuRKn3mR60bBqhN.jpg',
      unitNumber: '101',
      parkingSpot: 'p101',
      locker: null
  };

  render(
    <CondoComponent
      {...condoDetails}
    />
  );
  expect(screen.getByText(condoDetails.name + ' + ' + condoDetails.unitNumber)).toBeInTheDocument();
  expect(screen.getByText('Unit Number: ' + condoDetails.unitNumber)).toBeInTheDocument();
  expect(screen.queryByText('Parking Spot: ')).not.toBeInTheDocument();
  expect(screen.queryByText('Locker: ')).not.toBeInTheDocument();
  const profilePicture = screen.getByAltText('Profile');
  expect(profilePicture).toBeInTheDocument();
  expect(profilePicture).toHaveAttribute('src', condoDetails.profilePicture);
});