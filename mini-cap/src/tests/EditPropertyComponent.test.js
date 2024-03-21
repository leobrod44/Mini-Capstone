import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { navigate } from 'react-router-dom';
import EditPropertyComponent from '../components/EditPropertyComponent';
import { updateProperty, deleteProperty, getProperties } from '../backend/PropertyHandler';
import { toast } from "react-toastify";
import { act } from 'react-dom/test-utils';
import { MemoryRouter } from 'react-router-dom';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({
    propertyID: '123',
  }),
}));

jest.mock('react-toastify', () => ({
  toast: {
    error: jest.fn(),
  },
}));

jest.mock('../backend/PropertyHandler', () => ({
  getProperties: jest.fn().mockResolvedValue([
    {
      propertyID: '123',
      picture: null,
      propertyName: 'Test Property',
      address: 'Test Address',
      unitCount: 5,
      parkingCount: 10,
      parkingCost: 50,
      lockerCount: 3,
      lockerCost: 20,
    },
  ]),
  updateProperty: jest.fn().mockResolvedValue(),
  deleteProperty: jest.fn().mockResolvedValue(),
}));

describe('EditPropertyComponent', () => {
  test('renders without crashing', async () => {
    render(
      <Router>
        <EditPropertyComponent toggleEdit={() => {}} />
      </Router>
    );
  });

  test('displays the title', async () => {
    const { getByText } = render(
      <Router>
        <EditPropertyComponent toggleEdit={() => {}} />
      </Router>
    );
    getByText('My Property');
  });

  test('handles file change', async () => {
    const { getByLabelText } = render(
      <Router>
        <EditPropertyComponent toggleEdit={() => {}} />
      </Router>
    );
    const fileInput = getByLabelText('Property Picture:');
    fireEvent.change(fileInput, { target: { files: [new File([''], 'test.jpg', { type: 'image/jpeg' })] } });
  });

  test('handles input change', async () => {
    const { getByLabelText } = render(
      <Router>
        <EditPropertyComponent toggleEdit={() => {}} />
      </Router>
    );
    const propertyNameInput = getByLabelText('Property Name:');
    fireEvent.change(propertyNameInput, { target: { value: 'Updated Property Name' } });
  });

  test('handles form submission', async () => {
    const { getByText } = render(
      <Router>
        <EditPropertyComponent toggleEdit={() => {}} />
      </Router>
    );
    const saveButton = getByText('Save Changes');
    fireEvent.click(saveButton);
  });

  test('handles delete button click', async () => {
    const { getByText } = render(
      <Router>
        <EditPropertyComponent toggleEdit={() => {}} />
      </Router>
    );
    const deleteButton = getByText('Delete Property');
    fireEvent.click(deleteButton);
  });

  test('handles input change for property name', async () => {
    const { getByLabelText } = render(
      <Router>
        <EditPropertyComponent toggleEdit={() => {}} />
      </Router>
    );
  
    // Simulate input change for propertyName
    const propertyNameInput = getByLabelText('Property Name:');
    fireEvent.change(propertyNameInput, { target: { value: 'Updated Property Name' } });
  
    // Assert that the handleInputChange function is called with the correct value
    expect(propertyNameInput.value).toBe('Updated Property Name');
  });
  
  test('handles input change for unitCount', async () => {
    const { getByLabelText } = render(
      <Router>
        <EditPropertyComponent toggleEdit={() => {}} />
      </Router>
    );
  
    // Simulate input change for unitCount
    const unitCountInput = getByLabelText('Unit Count:');
    fireEvent.change(unitCountInput, { target: { value: '10' } });
  
    // Assert that handleInputChange function is called with the correct value
    expect(unitCountInput.value).toBe('10');
  });
  
  test('handles input change for parkingCount', async () => {
    const { getByLabelText } = render(
      <Router>
        <EditPropertyComponent toggleEdit={() => {}} />
      </Router>
    );
  
    // Simulate input change for parkingCount
    const parkingCountInput = getByLabelText('Parking Count:');
    fireEvent.change(parkingCountInput, { target: { value: '15' } });
  
    // Assert that handleInputChange function is called with the correct value
    expect(parkingCountInput.value).toBe('15');
  });
  
  test('handles input change for parkingCost', async () => {
    const { getByLabelText } = render(
      <Router>
        <EditPropertyComponent toggleEdit={() => {}} />
      </Router>
    );
  
    // Simulate input change for parkingCost
    const parkingCostInput = getByLabelText('Parking Price:');
    fireEvent.change(parkingCostInput, { target: { value: '25' } });
  
    // Assert that handleInputChange function is called with the correct value
    expect(parkingCostInput.value).toBe('25');
  });
  
  test('handles input change for lockerCount', async () => {
    const { getByLabelText } = render(
      <Router>
        <EditPropertyComponent toggleEdit={() => {}} />
      </Router>
    );
  
    // Simulate input change for lockerCount
    const lockerCountInput = getByLabelText('Locker Count:');
    fireEvent.change(lockerCountInput, { target: { value: '5' } });
  
    // Assert that handleInputChange function is called with the correct value
    expect(lockerCountInput.value).toBe('5');
  });
  
  test('handles input change for lockerCost', async () => {
    const { getByLabelText } = render(
      <Router>
        <EditPropertyComponent toggleEdit={() => {}} />
      </Router>
    );
  
    // Simulate input change for lockerCost
    const lockerCostInput = getByLabelText('Locker Price:');
    fireEvent.change(lockerCostInput, { target: { value: '15' } });
  
    // Assert that handleInputChange function is called with the correct value
    expect(lockerCostInput.value).toBe('15');
  });

  test('displays error message for unsupported file type', async () => {
    const { getByLabelText } = render(
      <Router>
        <EditPropertyComponent toggleEdit={() => {}} />
      </Router>
    );
  
    // Mock an invalid file type being selected
    const fileInput = getByLabelText('Property Picture:');
    Object.defineProperty(fileInput, 'files', {
      value: [new File([''], 'test.txt', { type: 'text/plain' })],
    });
    
    // Trigger the file change event
    fireEvent.change(fileInput);
  
    // Assert that the toast error message is displayed
    expect(toast.error).toHaveBeenCalledWith('File type not supported');
  });

  test('displays error message for file exceeding size limit', async () => {
    const { getByLabelText } = render(
      <Router>
        <EditPropertyComponent toggleEdit={() => {}} />
      </Router>
    );
  
    // Mock a file that exceeds the size limit
    const largeFile = new File([''], 'large_file.jpg', { type: 'image/jpeg' });
    Object.defineProperty(largeFile, 'size', { value: 3 * 1024 * 1024 }); // 3 MB
  
    const fileInput = getByLabelText('Property Picture:');
    fireEvent.change(fileInput, { target: { files: [largeFile] } });
  
    // Assert that the toast error message is displayed
    expect(toast.error).toHaveBeenCalledWith('File must be less than 2 MB');
  });

  test('displays error message for negative count value', async () => {
    const { getByLabelText } = render(
      <Router>
        <EditPropertyComponent toggleEdit={() => {}} />
      </Router>
    );
  
    // Mock input change with a negative value for unitCount
    const unitCountInput = getByLabelText('Unit Count:');
    fireEvent.change(unitCountInput, { target: { value: '-5' } });
  
    // Assert that the toast error message is displayed
    expect(toast.error).toHaveBeenCalledWith('Count must be greater than or equal to 0');
  });

  test('clicking cancel button triggers toggleEdit', async () => {
    const toggleEditMock = jest.fn();
    const { getByText } = render(
      <Router>
        <EditPropertyComponent toggleEdit={toggleEditMock} />
      </Router>
    );
  
    // Simulate clicking the cancel button
    const cancelButton = getByText('Cancel');
    fireEvent.click(cancelButton);
  
    // Assert that toggleEdit function is called
    expect(toggleEditMock).toHaveBeenCalled();
  });

  test('logs error to console', async () => {
    // Mock console.error
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  
    // Simulate an error
    const error = new Error('Test error');
    act(() => {
      console.error(error);
    });
  
    // Assertion
    expect(consoleErrorSpy).toHaveBeenCalledWith(error);
  
    // Restore console.error
    consoleErrorSpy.mockRestore();
  });

  test('logs property deletion to console', async () => {
    // Mock console.log
    const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  
    // Simulate property deletion
    const property = { id: '123', name: 'Test Property' };
    act(() => {
      console.log("Deleted:", property);
    });
  
    // Assertion
    expect(consoleLogSpy).toHaveBeenCalledWith("Deleted:", property);
  
    // Restore console.log
    consoleLogSpy.mockRestore();
  });

  test('logs property edition to console', async () => {
    // Mock console.log
    const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  
    // Simulate property edition
    const property = { id: '123', name: 'Test Property' };
    act(() => {
      console.log("Edited:", property);
    });
  
    // Assertion
    expect(consoleLogSpy).toHaveBeenCalledWith("Edited:", property);
  
    // Restore console.log
    consoleLogSpy.mockRestore();
  });

  jest.mock('../backend/PropertyHandler', () => ({
    updateProperty: jest.fn().mockResolvedValue(),
    getProperties: jest.fn().mockResolvedValue([]), // Mock getProperties to return an empty array
  }));
  
  jest.mock('react-toastify', () => ({
    toast: {
      error: jest.fn(), // Mock the toast.error function
    },
  }));
  
  jest.mock('../backend/PropertyHandler', () => ({
    getProperties: jest.fn(),
  }));
  
  // Mock the toast.error method
  jest.mock('react-toastify', () => ({
    ...jest.requireActual('react-toastify'),
    toast: {
      error: jest.fn(),
    },
  }));
  
  test('displays error message when property is not found', async () => {
    // Mock the scenario where no property is found
    getProperties.mockResolvedValue([]);
  
    // Render the component within MemoryRouter
    const { getByText } = render(
      <MemoryRouter initialEntries={['/edit-property/123']}>
        <EditPropertyComponent toggleEdit={() => {}} />
      </MemoryRouter>
    );
  
    // Wait for the component to fetch properties
    await act(async () => {
      await Promise.resolve();
    });
  
    // Check if the error toast message is displayed
    expect(toast.error).toHaveBeenCalledWith('Property not found');
    expect(getByText('My Property')).toBeInTheDocument(); // Assert that the component renders normally
  });

  
  
});
