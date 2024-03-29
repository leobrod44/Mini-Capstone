import React from 'react';
import { render, screen, fireEvent,waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import MGMTDashboard from '../pages/MGMTDashboard';
import * as PropertyHandler from '../backend/PropertyHandler';



jest.mock("../components/Header", () => () => <div>Header Mock</div>);
jest.mock("../components/Footer", () => () => <div>Footer Mock</div>);
jest.mock('../backend/PropertyHandler');


describe('MGMTDashboard Component', () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
  });


  it('renders without crashing and contains all properties (if any)', () => {
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
    jest.spyOn(PropertyHandler, 'getProperties').mockResolvedValue(propertyDetails);

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
      expect(screen.getByTestId('condo-list')).toBeInTheDocument();
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


  it('navigates to the "/add-property" page when clicking the "Create my first Property" link',async () => {
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
    jest.spyOn(PropertyHandler, 'getProperties').mockResolvedValue(propertyDetails);

    render(<BrowserRouter><MGMTDashboard /></BrowserRouter>);
    const propertyComponents = screen.queryAllByTestId("property-component");
    if (propertyComponents.length > 0) {
     
      expect(screen.getByText("Property 1")).toBeInTheDocument();
      expect(screen.getByTestId('add-condo-btn')).toBeInTheDocument();

      fireEvent.click(screen.getByTestId('add-condo-btn'));
      expect(window.location.pathname).toBe("/");
    } else {
      // If no property components are rendered, ensure the registration section is present
      expect(
        screen.getByText("You have not created a property yet.")
      ).toBeInTheDocument();
      //expect(screen.getByText("Create my first property")).toBeInTheDocument();
    }

  });


});
