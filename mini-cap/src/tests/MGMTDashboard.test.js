import React from 'react';
import { render, screen, fireEvent,waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import MGMTDashboard from '../pages/MGMTDashboard';

jest.mock("../components/Header", () => () => <div>Header Mock</div>);
jest.mock("../components/Footer", () => () => <div>Footer Mock</div>);

describe('MGMTDashboard Component', () => {
  
  it('renders without crashing and contains all properties (if any)', () => {
    render(
    <BrowserRouter>
    <MGMTDashboard />
    </BrowserRouter>
    );
    
    expect(screen.getByText("Header Mock")).toBeInTheDocument();
    expect(screen.getByText("Footer Mock")).toBeInTheDocument();

    const toggleButton = screen.getByTestId('toggle');
    fireEvent.click(toggleButton);

    // Wait for the state update to complete
    waitFor(() => {
      expect(screen.getByText('You have not created a property yet.')).toBeInTheDocument();
    });

    fireEvent.click(toggleButton);

    // Wait for the state update to complete
    waitFor(() => {
      expect(screen.getByText('You have registered properties:')).toBeInTheDocument();
    });



  });


 

  it('renders the registration property section when the user has no properties', () => {
    render(
    <BrowserRouter>
    <MGMTDashboard />
    </BrowserRouter>);
    expect(
      screen.getByText('You have not created a property yet.')
    ).toBeInTheDocument();
    expect(
      screen.getByText('Create my first Property')
    ).toBeInTheDocument();
  });

  
  it('does not render the AddCondoBtn when the user has no properties', () => {
    render(
    <BrowserRouter>
    <MGMTDashboard />
    </BrowserRouter>
    );
    expect(screen.queryByTestId('add-condo-btn')).not.toBeInTheDocument();
  });


  it('navigates to the "/add-property" page when clicking the "Create my first Property" link', () => {
    render(<BrowserRouter><MGMTDashboard /></BrowserRouter>);
    fireEvent.click(screen.getByText('Create my first Property'));
    expect(window.location.pathname).toBe('/add-property');
  });

 

  it('renders AddCondoBtn when hasProperties is true and does not render it when hasProperties is false', () => {
    render(
      <BrowserRouter>
        <MGMTDashboard />
      </BrowserRouter>
    );

    expect(screen.queryByTestId('add-condo-btn')).not.toBeInTheDocument(); // Button shouldn't be rendered initially
    const toggleButton = screen.getByTestId('toggle');
    fireEvent.click(toggleButton); // Set hasProperties to true
    
   waitFor(() => {
    expect(screen.getByTestId('add-condo-btn')).toBeInTheDocument(); // Button should be rendered now
  });
  fireEvent.click(toggleButton); // Set hasProperties to false
  // Wait for the component to update with the new state
   waitFor(() => {
    expect(screen.queryByTestId('add-condo-btn')).not.toBeInTheDocument(); // Button should not be rendered now
  });

  });
});
