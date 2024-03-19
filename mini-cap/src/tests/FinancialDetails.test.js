import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import FinancialDetails from '../components/FinancialDetails';

describe('FinancialDetails component', () => {
  it('renders FinancialDetails component with default state', () => {
    const { getByText } = render(<FinancialDetails />);
    
    // Assert default state
    expect(getByText('Base Price:')).toBeInTheDocument();
    expect(getByText('Parking Price:')).toBeInTheDocument();
    expect(getByText('Locker Price:')).toBeInTheDocument();
    expect(getByText('Additional Fees:')).toBeInTheDocument();
    expect(getByText('Total Unit Price:')).toBeInTheDocument();
    expect(getByText('Rent Paid:')).toBeInTheDocument();
    expect(getByText('Toggle Rent Paid')).toBeInTheDocument();
    expect(getByText('Toggle Rent Paid').textContent).toBe('Toggle Rent Paid');
  });
});
