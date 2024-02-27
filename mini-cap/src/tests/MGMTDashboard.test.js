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

    expect(screen.queryByText('Welcome to your Properties Dashboard !')).toBeInTheDocument();

    const propertyComponents = screen.queryAllByTestId('property-component');
    if (propertyComponents.length > 0) {
      // If property components are rendered, ensure they are present
      expect(screen.getByText('Property Name')).toBeInTheDocument(); 
    } else {
      // If no property components are rendered, ensure the registration section is present
      expect(screen.getByText('You have not created a property yet.')).toBeInTheDocument();
      expect(screen.getByText('Create my first Property')).toBeInTheDocument();
    }
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

  it('renders the AddCondoBtn when the user has properties', () => {
    const propertyDetails = [
      {
        picture: 'property1.jpg',
        propertyID: '123',
        propertyName: 'Property 1',
        address: '123 Main St',
        unitCount: 10,
        parkingCount: 5,
        lockerCount: 2
      },
    ];

    render(
      <BrowserRouter>
        <MGMTDashboard propertyDetails={propertyDetails} />
      </BrowserRouter>
    );

    // Assert that the AddCondoBtn is rendered
    expect(screen.getByTestId('add-condo-btn')).toBeInTheDocument();
  });

  it('navigates to the "/add-property" page when clicking the AddCondoBtn', () => {
    const propertyDetails = [
      {
        picture: 'property1.jpg',
        propertyID: '123',
        propertyName: 'Property 1',
        address: '123 Main St',
        unitCount: 10,
        parkingCount: 5,
        lockerCount: 2
      },
    ];

    // Mocking the useNavigate function
    const mockNavigate = jest.fn();
    jest.mock('react-router-dom', () => ({
      ...jest.requireActual('react-router-dom'),
      useNavigate: () => mockNavigate
    }));

    render(
      <BrowserRouter>
        <MGMTDashboard />
      </BrowserRouter>
    );

    // Click the AddCondoBtn
    fireEvent.click(screen.getByTestId('add-condo-btn'));

    // Assert that navigate function is called with the correct path
    expect(mockNavigate).toHaveBeenCalledWith('/add-property');
  });
 

});
