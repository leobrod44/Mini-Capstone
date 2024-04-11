import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom'; // Since we're using Link, we need a Router
import FacilityComponent from '../components/FacilityComponent'; // Adjust the import path as necessary
import { render, waitFor, screen } from '@testing-library/react'; 


describe("FacilityComponent", () => {
  // Test data
  const props = {
    type: 'Gym',
    description: 'A gym with modern equipment',
    dailyAvailabilities: [], // Assuming this prop isn't used in the current implementation
    blockSize: 0, // Assuming this prop isn't used in the current implementation
    propertyID: '123',
    id: '456'
  };

  it('renders without crashing', () => {
    render(
      <Router>
        <FacilityComponent {...props} />
      </Router>
    );
    expect(screen.getByText(/facility:/i)).toBeInTheDocument();
  });

  it('displays the correct type and description', () => {
    render(
      <Router>
        <FacilityComponent {...props} />
      </Router>
    );
    expect(screen.getByText(`Facility: ${props.type}`)).toBeInTheDocument();
    expect(screen.getByText(`Description: ${props.description}`)).toBeInTheDocument();
  });

  it('constructs the Make Reservation link correctly', () => {
    render(
      <Router>
        <FacilityComponent {...props} />
      </Router>
    );
    const link = screen.getByRole('link', {name: /make reservation/i});
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', `/calendar?propertyID=${props.propertyID}&facilityID=${props.id}&facilityType=${props.type}&desc=${props.description}`);
  });

});