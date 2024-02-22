import React from 'react';
import { render, screen, fireEvent,waitFor } from '@testing-library/react';
import Dashboard from '../pages/Dashboard';
import { BrowserRouter } from 'react-router-dom';

// Mock the Header and Footer components
jest.mock("../components/Header", () => () => <div>Header Mock</div>);
jest.mock("../components/Footer", () => () => <div>Footer Mock</div>);


describe('Dashboard Component', () => {
  
  it('renders without crashing and contains all condos (if any)', () => {
    render(
    <BrowserRouter>
    <Dashboard />
    </BrowserRouter>
    );
    // Check if Header and Footer are rendered
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

  

  it('renders the welcome message correctly', () => {
    render(<Dashboard />);
    expect(
        screen.getByText(
            'Welcome to your Condo Dashboard !'
            )
        ).toBeInTheDocument();
  });

  
  it('renders the registration condo section when the user has no condos', () => {
    render(<Dashboard />);
    expect(
        screen.getByText(
            'You have not registered a condo yet.'
            )
        ).toBeInTheDocument();
    expect(
        screen.getByText(
            'Register my first condo'
        )
    ).toBeInTheDocument();
  });


  
  it('toggles the visibility of the popup when clicking the "Register my first condo" button', () => {
    render(<Dashboard />);
    fireEvent.click(screen.getByText('Register my first condo'));
    expect(screen.getByText('Register your condo')).toBeInTheDocument(); 
    fireEvent.click(screen.getByTestId('close-button')); 
    expect(screen.queryByText('Register your condo')).not.toBeInTheDocument(); 
  });




//when hascondos is true check that the addcondobtn is rendered

//when hascondos is true check that the register my first condo is not rendered

// WHEN HAS condos is true condos should be rendered

it('renders AddCondoBtn when hasCondos is true and does not render it when hasCondos is false', () => {
  render(
    <BrowserRouter>
      <Dashboard />
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