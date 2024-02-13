import React from 'react';
import { render, screen, fireEvent,act } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'; 
import Dashboard from '../pages/Dashboard';

// Mock the Header and Footer components
jest.mock("../components/Header", () => () => <div>Header Mock</div>);
jest.mock("../components/Footer", () => () => <div>Footer Mock</div>);


describe('Dashboard Component', () => {
  
  it('renders without crashing and contains all condos (if any)', () => {
    render(
    <Dashboard />
    );
    // Check if Header and Footer are rendered
    expect(screen.getByText("Header Mock")).toBeInTheDocument();
    expect(screen.getByText("Footer Mock")).toBeInTheDocument();
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

});