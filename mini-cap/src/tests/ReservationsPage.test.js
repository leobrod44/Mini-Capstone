import React from 'react';
import { render, waitFor, screen } from '@testing-library/react'; 
import { getUserCondos, getPropertyData } from "../backend/PropertyHandler.js";
import { getUsersProperty } from "../backend/ImageHandler.js";
import Reservations from '../pages/Reservations'; 
import { BrowserRouter as Router } from 'react-router-dom';
import { getFacilities } from "../backend/FacilityHandler.js"; 


jest.mock("../components/Header", () => () => <div>Header Mock</div>);
jest.mock("../components/Footer", () => () => <div>Footer Mock</div>);
jest.mock("../backend/PropertyHandler.js", () => ({
  getUserCondos: jest.fn(),
  getPropertyData: jest.fn(),
 
}));
jest.mock("../backend/ImageHandler.js", () => ({
  getUsersProperty: jest.fn(),
}));
jest.mock("../backend/FacilityHandler.js", () => ({ 
  getFacilities: jest.fn(),
}));
describe("Reservations ", () => {

  it("renders without crashing and renders properties (if any)", async() => {
    getUserCondos.mockResolvedValue('userCondosMock');
    getUsersProperty.mockResolvedValue(['propertyId1', 'propertyId2']);
    getPropertyData.mockResolvedValueOnce('propertyData1').mockResolvedValueOnce('propertyData2');

    render(
      <Router>
        <Reservations />
      </Router>
    );

    // Verify that your async functions were called correctly
    await waitFor(() => expect(getUserCondos).toHaveBeenCalled());
    await waitFor(() => expect(getUsersProperty).toHaveBeenCalledWith('userCondosMock'));
    await waitFor(() => expect(getPropertyData).toHaveBeenCalledTimes(2));
   
    
  });
  
});