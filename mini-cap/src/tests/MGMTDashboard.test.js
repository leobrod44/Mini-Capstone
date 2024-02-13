import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter } from 'react-router-dom';
import MGMTDashboard from '../pages/MGMTDashboard';

jest.mock("../components/Header", () => () => <div>Header Mock</div>);
jest.mock("../components/Footer", () => () => <div>Footer Mock</div>);

describe('MGMTDashboard Component', () => {
  
  it('renders without crashing and contains all properties (if any)', () => {
    render(
    <BrowserRouter>
    <MGMTDashboard />
    </BrowserRouter>);
    
    expect(screen.getByText("Header Mock")).toBeInTheDocument();
    expect(screen.getByText("Footer Mock")).toBeInTheDocument();
  });

  it('renders the welcome message correctly', () => {
    render(
    <BrowserRouter>
    <MGMTDashboard />
    </BrowserRouter>);
    expect(
      screen.getByText('Welcome to your Properties Dashboard !')
    ).toBeInTheDocument();
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

 
});
