import React from 'react';
import { render } from '@testing-library/react';
import FinancialDetails from '../components/FinancialDetails';
import { BrowserRouter as Router } from "react-router-dom";
import * as FinancialHandler from '../backend/FinancialHandler';

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
});
