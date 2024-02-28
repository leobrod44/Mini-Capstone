import CondoDetails from "../components/CondoDetails.jsx";
import React from 'react';
import { render } from '@testing-library/react';


// Test Case: Rendering the CondoDetails component without errors
test('renders CondoDetails component without errors', () => {
    const props = {
      name: 'Sample Condo',
      address: '123 Main St',
      unitNumber: '101',
      squareFeet: '1000',
      size: '2 bedrooms',
      parkingCount: '1',
      lockerCount: '1',
      pricesf: '$200',
      price: '$200,000',
      status: 'Available',
      contact: 'test@example.com',
      currentPrice: '$1000',
      rentDueDate: '2024-03-01',
    };
  
    // Use a try-catch block to catch any errors during rendering
    try {
      render(<CondoDetails {...props} />);
    } catch (error) {
      // If there's an error, fail the test with the error message
      fail(error.message);
    }
  });

  
// Test Case 2: Rendering the component without optional props
test('renders CondoDetails component without optional props', () => {
  const props = {
    name: 'Sample Condo',
    address: '123 Main St',
    unitNumber: '101',
    squareFeet: '1000',
    size: '2 bedrooms',
    parkingCount: '1',
    lockerCount: '1',
    pricesf: '$200',
    price: '$200,000',
    status: 'Available',
    contact: 'test@example.com',
  };

  const { queryByText } = render(<CondoDetails {...props} />);

  // Ensure that optional content is not rendered using regular expressions
  expect(queryByText(new RegExp('Current Rent Price:', 'i'))).toBeNull();
  expect(queryByText(new RegExp('Next Rent Due Date:', 'i'))).toBeNull();
});

// Test Case 3: Rendering the component with different status and role
test('renders CondoDetails component with different status and role', () => {
  const props = {
    name: 'Sample Condo',
    address: '123 Main St',
    unitNumber: '101',
    squareFeet: '1000',
    size: '2 bedrooms',
    parkingCount: '1',
    lockerCount: '1',
    pricesf: '$200',
    price: '$200,000',
    status: 'Rented',
    contact: 'test@example.com',
    currentPrice: '$1000',
    rentDueDate: '2024-03-01',
  };

  const { getByText } = render(<CondoDetails {...props} />);

  // Ensure that role-specific content is rendered using regular expressions
  expect(getByText(new RegExp(props.status, 'i'))).toBeInTheDocument();
  expect(getByText(/Send Key/i)).toBeInTheDocument();
});

// Add more test cases based on your component's logic and possible variations

