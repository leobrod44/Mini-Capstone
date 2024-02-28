import React from 'react';
import { render, screen, fireEvent,waitFor } from '@testing-library/react';
import Dashboard from '../pages/Dashboard';
import { BrowserRouter } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as PropertyHandler from '../backend/PropertyHandler';

// Mock the Header and Footer components
jest.mock("../components/Header", () => () => <div>Header Mock</div>);
jest.mock("../components/Footer", () => () => <div>Footer Mock</div>);


jest.mock("../backend/PropertyHandler");



// Mock React toast
jest.mock("react-toastify", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn()
  }
}));


describe('Dashboard Component', () => {
  

  const mockCondos = [
    {
      propertyName: 'Property 1',
      unitNumber: '101',
      parkingNumber: 'P101',
      lockerNumber: 'L101',
      userType: 'Owner',
    },
    {
      propertyName: 'Property 2',
      unitNumber: '102',
      parkingNumber: 'P102',
      lockerNumber: 'L102',
      userType: 'Renter',
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(toast, 'success').mockImplementation();
    jest.spyOn(toast, 'error').mockImplementation();
  });


  it('renders without crashing and contains no condos (if none)', () => {
    jest.spyOn(PropertyHandler, 'getUserCondos').mockResolvedValue([]);

    render(
    <BrowserRouter>
    <Dashboard />
    </BrowserRouter>
    );
    // Check if Header and Footer are rendered
    expect(screen.getByText("Header Mock")).toBeInTheDocument();
    expect(screen.getByText("Footer Mock")).toBeInTheDocument();

    
    waitFor(() => {
      expect(screen.getByText('You have not created a property yet.')).toBeInTheDocument();
    });


    // Wait for the state update to complete
    waitFor(() => {
      expect(screen.getByText('You have registered properties:')).toBeInTheDocument();
    });

  });

  it('renders without crashing and contains all condos (if any)', async () => {
    // Mock getUserCondos to return condos
    jest.spyOn(PropertyHandler, 'getUserCondos').mockResolvedValue(mockCondos);


    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );

    // Wait for condos to be loaded
    await waitFor( () => {
      expect(screen.getByText('Property 1')).toBeInTheDocument();
      expect(screen.getByText('Property 2')).toBeInTheDocument();
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