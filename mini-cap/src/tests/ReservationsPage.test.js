import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Reservations from '../pages/Reservations'; // Adjust the import path based on your project structure
import { waitFor } from '@testing-library/react';


jest.mock("../components/Header", () => () => <div>Header</div>);
jest.mock("../components/Footer", () => () => <div>Footer</div>);
jest.mock("../components/BackArrowBtn", () => () => <div>BackArrowBtn</div>);
jest.mock("../components/Pagination", () => () => <div>Pagination</div>);
jest.mock("../components/ReservationComponent", () => () => <div>ReservationComponent</div>);
jest.mock("../components/FacilityComponent", () => () => <div>FacilityComponent</div>);


describe('Reservations Page', () => {
    it('renders without crashing', () => {
      render(<Reservations />);
      expect(screen.getByText("My Reservations")).toBeInTheDocument();
    });
  
    it('renders the Pagination component', () => {
      render(<Reservations />);
      expect(screen.getByText('Pagination')).toBeInTheDocument();
    });
  
    it('renders ReservationComponent for each condo with reservations', () => {
      render(<Reservations />);
      // Assuming your mock condos data have at least one condo with reservations
      expect(screen.getAllByText('ReservationComponent').length).toBeGreaterThan(0);
    });

    it('toggles the visibility of FacilityComponent when the button is clicked', async () => {
        const { getByText, queryByText } = render(<Reservations />);
        // Assuming "Show Condo Facilities" button is what triggers toggleFacilities
        // Initially, we expect not to find "FacilityComponent" if it depends on the toggle.
        expect(queryByText('FacilityComponent')).not.toBeInTheDocument();
    
        // Simulate the click event that triggers toggleFacilities
        fireEvent.click(getByText('Show Condo Facilities'));
    
        // Now, we expect "FacilityComponent" to be in the document.
        expect(getByText('FacilityComponent')).toBeInTheDocument();
    
        // Optionally, click again to hide and confirm it disappears.
        fireEvent.click(getByText('Show Condo Facilities'));
        await waitFor(() => expect(queryByText('FacilityComponent')).not.toBeInTheDocument());
    });
});
