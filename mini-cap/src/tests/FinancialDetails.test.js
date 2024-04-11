import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import FinancialDetails from '../components/FinancialDetails';
import { BrowserRouter as Router } from "react-router-dom";
import * as FinancialHandler from '../backend/FinancialHandler';
import * as PropertyHandler from '../backend/PropertyHandler'

jest.mock('../backend/FinancialHandler');
jest.mock('../backend/UserHandler');
jest.mock('../backend/PropertyHandler');

jest.mock("react-router-dom", () => {
  const originalModule = jest.requireActual("react-router-dom");
  return {
    ...originalModule,
    useNavigate: jest.fn()
  };
});

describe('FinancialDetails component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders FinancialDetails with all information slots', () => {
    const { getByText } = render(
      <Router>
        <FinancialDetails />
      </Router>
    );

    expect(getByText('Base Price:')).toBeInTheDocument();
    expect(getByText('Parking Price:')).toBeInTheDocument();
    expect(getByText('Locker Price:')).toBeInTheDocument();
    expect(getByText('Additional Fees:')).toBeInTheDocument();
    expect(getByText('Total Unit Price:')).toBeInTheDocument();
    expect(getByText('Rent Paid:')).toBeInTheDocument();
    expect(getByText('Pay Rent')).toBeInTheDocument();
  });

  it('renders FinancialDetails with all information slots', async () => {
    // Mock data
    PropertyHandler.getCondo.mockResolvedValue({ status: 'Vacant' });
    FinancialHandler.calculateCondoFees.mockResolvedValue({
      rent: 1000,
      parkingPrice: 50,
      lockerPrice: 20,
      additionalFees: 0,
      amenitiesPrice: 100,
      totalPrice: 1170,
    });

    const { getByText } = render(<FinancialDetails />);

    await waitFor(() => {
      expect(getByText('Base Price:')).toBeInTheDocument();
      expect(getByText('Parking Price:')).toBeInTheDocument();
      expect(getByText('Locker Price:')).toBeInTheDocument();
      expect(getByText('Total Amenity Fees:')).toBeInTheDocument();
      expect(getByText('Additional Fees:')).toBeInTheDocument();
      expect(getByText('Total Unit Price:')).toBeInTheDocument();
    });
  });
  
  it('successfully displayed "Unpaid" when button is not clicked', async () => {
    jest.spyOn(FinancialHandler, 'payRent').mockResolvedValueOnce(true);
    jest.spyOn(FinancialHandler, 'checkRentPaid').mockResolvedValueOnce(true);
  
    const { getByText } = render(
      <Router>
        <FinancialDetails />
      </Router>
    );

    expect(getByText('Rent Paid:')).toBeInTheDocument();
    expect(getByText('Unpaid')).toBeInTheDocument();
  });

  it('renders Pay Rent button when role is not management company', () => {
    render(<Router><FinancialDetails role="Renter/Owner" /></Router>);
    const payRentButton = screen.getByText('Pay Rent');
    expect(payRentButton).toBeInTheDocument();
  });

  it('renders rent payment status for management company', () => {
    render(<Router><FinancialDetails role="MANAGEMENT_COMPANY" /></Router>);
    expect(screen.getByText('Rent Paid:')).toBeInTheDocument();
  });
  
  it('successfully pays rent when button is clicked', async () => {
    // Mock successful rent payment
    jest.spyOn(FinancialHandler, 'payRent').mockResolvedValueOnce(true);
    jest.spyOn(FinancialHandler, 'checkRentPaid').mockResolvedValueOnce(true);
    
    render(<Router><FinancialDetails /></Router>);
    const payRentButton = screen.getByText('Pay Rent');
    fireEvent.click(payRentButton);
  
    await waitFor(() => {
      expect(screen.getByText('Rent Paid:')).toBeInTheDocument();
      expect(screen.getByText('Paid')).toBeInTheDocument();
    });
  });
});
